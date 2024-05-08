import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, PermissionsAndroid, ToastAndroid } from 'react-native';
import { Camera, useCameraDevices, RNVisionCamera } from 'react-native-vision-camera'; // useCameraDevices 추가
import { useNavigation } from '@react-navigation/native';

const Userrecognition = () => {
  const cameraRef = useRef<RNVisionCamera>(null);
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const instructions = [
    '얼굴을 오른쪽에서 찍어주세요',
    '얼굴을 왼쪽에서 찍어주세요',
    '얼굴을 위에서 찍어주세요',
    '얼굴을 아래에서 찍어주세요',
    '얼굴 중앙을 찍어주세요'
  ];
  const navigation = useNavigation();
  const devices = useCameraDevices(); // useCameraDevices 훅을 사용하여 카메라 장치 목록 가져오기

  useEffect(() => {
    // 권한 확인 및 초기화
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted) {
          console.log('카메라 권한이 이미 허용됨');
          setIsCameraInitialized(true);
        } else {
          console.log('카메라 권한이 허용되지 않음');
          navigation.navigate('PermissionScreen');
        }
      } catch (err) {
        console.warn('카메라 권한 확인 중 오류:', err);
      }
    }
  };

  const takePicture = async () => {
    try {
      if (cameraRef.current == null) {
        return;
      }
      await RNVisionCamera.requestCameraPermission();
      const data = await cameraRef.current?.takePhoto({
        qualityPrioritization: 'speed',
        flash: 'off', // 플래시 설정
        quality: 50,
        enableShutterSound: false
      });
      const { path, width, height } = data || {};
      const uri = `file://${path}`;
      console.log('사진 경로:', uri);

      if (instructionIndex < instructions.length - 1) {
        setInstructionIndex(instructionIndex + 1);
      }
    } catch (e) {
      console.error('사진 찍기 오류:', e);
      ToastAndroid.show('카메라 오류가 발생했습니다', ToastAndroid.SHORT);
    }
  };

  const onCameraInitialized = () => {
    console.log('카메라 초기화 완료');
    setIsCameraInitialized(true);
  };

  return (
    <View style={styles.container}>
      {isCameraInitialized && devices.length > 0 && ( // 장치가 존재하는지 확인
        <Camera
          ref={cameraRef}
          style={styles.preview}
          autoFocus="on"
          device={devices[0]} // 첫 번째 카메라 장치를 선택
          photo={true} // 사진 촬영 기능 활성화
          onInitialized={onCameraInitialized}
        />
      )}
      <View style={styles.bottomContainer}>
        <Text style={styles.instruction}>{instructions[instructionIndex]}</Text>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureInnerButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 0.6,
  },
  bottomContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
  },
  captureButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  captureInnerButton: {
    backgroundColor: 'black',
    borderRadius: 50,
    height: 50,
    width: 50,
  },
});

export default Userrecognition;
