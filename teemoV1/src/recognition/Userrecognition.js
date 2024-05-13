import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, PermissionsAndroid, ToastAndroid } from 'react-native';
import { Camera, useCameraDevices, RNVisionCamera } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

const Userrecognition = () => {
  const cameraRef = useRef(null);
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const instructions = [
    '얼굴을 오른쪽에서 찍어주세요',  // Right
    '얼굴을 왼쪽에서 찍어주세요',   // Left
    '얼굴을 위에서 찍어주세요',     // Top
    '얼굴을 아래에서 찍어주세요',   // Bottom
    '얼굴 중앙을 찍어주세요'        // Front
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
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setIsCameraInitialized(true);
        } else {
          console.warn('카메라 권한이 거부되었습니다');
          navigation.navigate('PermissionScreen');
        }
      } catch (error) {
        console.error('카메라 권한 확인 중 오류:', error);
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
      {isCameraInitialized && devices && devices.length > 0 && (
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
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  preview: {
    flex: 0.6,
  },
  controlContainer: {
    flex: 0.4,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  angleButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  instruction: {
    fontSize: 20,
    marginBottom: 20,
    color: 'black',
  },
  captureButton: {
    backgroundColor: '#ddd',
    borderRadius: 50,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  captureInnerButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    height: 50,
    width: 50,
  },
});

export default Userrecognition;