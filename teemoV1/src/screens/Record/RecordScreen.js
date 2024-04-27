import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

//영상 녹화 화면 코드
const RecordScreen = () => {
  const [cameraPermission, setCameraPermission] = useState('not-determined');
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [processing, setProcessing] = useState(false);
  const device = useCameraDevice('front')

  const cameraRef = useRef(null);

  useEffect(() => {
    const checkPermissionAndLoadDevices = async () => {
      let permission = await Camera.getCameraPermissionStatus();
      if (permission === 'not-determined') {
        permission = await Camera.requestCameraPermission();
      }
      setCameraPermission(permission);
  
      if (permission === 'authorized') {
        const availableDevices = await Camera.getAvailableCameraDevices();
        setDevices(availableDevices);
        const frontCamera = availableDevices.find(device => device.position === 'front');
        setSelectedDevice(frontCamera); // 전면 카메라로 변경
      } else {
        alert('카메라 권한이 필요합니다. 권한을 허용해주세요.');
      }
    };
  
    checkPermissionAndLoadDevices();
  }, []);  

  const startRecording = async () => {
    if (cameraRef.current) {
      setRecording(true);
      try {
        const video = await cameraRef.current.recordAsync();
        setRecording(false);
        setVideoPath(video.uri);
        setProcessing(true);
      } catch (error) {
        console.error('녹화 오류 :', error);
      }
    } else {
      console.error('카메라가 준비 되지 않았습니다.');
    }
  };  

  const stopRecording = () => {
    cameraRef.current.stopRecording();
  };

  const resumeVideo = () => {
    setVideoPath(null);
    setProcessing(false);
  };

  let button = (
    <TouchableOpacity
      onPress={startRecording}
      style={styles.button}>
      <Text style={{ fontSize: 14 }}> 녹화 시작 </Text>
    </TouchableOpacity>
  );

  if (recording) {
    button = (
      <TouchableOpacity
        onPress={stopRecording}
        style={styles.button}>
        <Text style={{ fontSize: 14 }}> 중지 </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {!processing && selectedDevice && (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          cameraFlipType={'front'} // 전면 카메라
          autoFocus={'on'}
          isActive={true}
          device={device}
        />
      )}
      <View style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}>
        {button}
      </View>

      {videoPath && (
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
          <TouchableOpacity style={styles.button} onPress={resumeVideo}>
            <Text>확인</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default RecordScreen;
