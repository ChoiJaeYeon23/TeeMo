import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

const Userrecognition = () => {
  const cameraRef = useRef(null);
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
  const device = useCameraDevice('front'); // front 또는 back 중 선택

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
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto();

        // 사진 객체에서 필요한 정보만 추출하여 사용
        console.log(photo.uri);

        if (instructionIndex < instructions.length - 1) {
          setInstructionIndex(instructionIndex + 1);
        }
      } catch (error) {
        console.error('사진 찍기 오류:', error);
      }
    }
  };

  const onCameraInitialized = () => {
    console.log('카메라 초기화 완료');
    setIsCameraInitialized(true);
  };

  return (
    <View style={styles.container}>
      {isCameraInitialized && device && (
        <Camera
          ref={cameraRef}
          style={styles.preview}
          autoFocus="on"
          device={device}
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
