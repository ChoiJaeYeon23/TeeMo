import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, PermissionsAndroid, ToastAndroid } from 'react-native';
import { Camera, useCameraDevices, RNVisionCamera } from 'react-native-vision-camera';
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
  const devices = useCameraDevices();
  const [photoData, setPhotoData] = useState([]);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (instructionIndex === instructions.length) {
      navigation.navigate('UserList', { photos: photoData });
    }
  }, [instructionIndex, photoData, navigation]);

  const checkCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (granted) {
        setIsCameraInitialized(true);
      } else {
        console.warn('카메라 권한 확인 중 오류');
        navigation.navigate('PermissionScreen');
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePhoto({
        qualityPrioritization: 'speed',
        flash: 'off',
        quality: 50,
        enableShutterSound: false
      });
      setPhotoData([...photoData, data]);
      setInstructionIndex(instructionIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      {isCameraInitialized && devices.length > 0 && (
        <Camera
          ref={cameraRef}
          style={styles.preview}
          autoFocus="on"
          device={devices[0]}
          photo={true}
          onInitialized={() => setIsCameraInitialized(true)}
        />
      )}
      <View style={styles.controlContainer}>
        <View style={styles.buttonRow}>
          {instructions.map((instruction, index) => (
            <TouchableOpacity key={index} style={styles.angleButton} onPress={() => setInstructionIndex(index)}>
              <Text style={styles.buttonText}>{instruction.split(' ')[1]}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  controlContainer: {
    flex: 0.4,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  angleButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },
  buttonText: {
    color: 'black',
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
