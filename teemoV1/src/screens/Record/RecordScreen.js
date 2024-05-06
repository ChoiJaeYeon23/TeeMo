import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';
// import CameraRoll from "@react-native-community/cameraroll";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

//영상 녹화 화면 코드
const RecordScreen = () => {
  const [recording, setRecording] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const cameraRef = useRef(null);
  const devices = useCameraDevices('back');
  const { hasPermission } = useCameraPermission();

  const navigation = useNavigation();

  useEffect(() => {
    // 카메라 초기화 확인
    const checkCameraInitialization = () => {
      if (cameraRef.current) {
        setIsCameraInitialized(true);
      }
    };

    checkCameraInitialization();
  }, []);

  useEffect(() => {
    // 카메라가 초기화되고 녹화가 시작되지 않았다면 녹화 시작
    if (isCameraInitialized && devices && !recording) {
      startRecording();
    }
  }, [isCameraInitialized, devices, recording]);

  //녹화 시작 or 중지
  const toggleRecording = async () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // 녹화 시작
  const startRecording = async () => {
    if (cameraRef.current && isCameraInitialized && devices && !isRecording) {
      try {
        setIsRecording(true);
        setRecording(true);
        await cameraRef.current.startRecording({
          onRecordingError: (error) => {
            console.error('녹화 오류 :', error);
            setIsRecording(false);
            setRecording(false);
          },
          onRecordingFinished: (video) => {
            setIsRecording(false);
            setRecording(false);
          },
        });
      } catch (error) {
        console.error('녹화 시작 오류 :', error);
        setIsRecording(false);
        setRecording(false);
      }
    } else {
      console.error('카메라가 준비되지 않았거나 이미 녹화 중입니다.');
    }
  };

  // 녹화 중지
  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
        setRecording(false);
      } catch (error) {
        console.error('녹화 중지 오류 :', error);
      }
    }
  };

  // 비디오를 카메라 롤에 저장
  // const saveVideoToCameraRoll = async (videoUri) => {
  //   try {
  //     const saveResult = await CameraRoll.save(videoUri, { type: 'video' });
  //     console.log('비디오 저장 결과:', saveResult);
  //   } catch (error) {
  //     console.error('비디오 저장 오류 :', error);
  //   }
  // };

  //권한, 카메라 장치가 없으면 indicator 표시
  if (!hasPermission || devices == null) {
    return <ActivityIndicator size={20} color={'red'} />;
  }

  if (!hasPermission) {
    navigation.navigate('권한화면');
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        ref={cameraRef}
        device={devices.find(device => device.position === 'back')}
        autoFocus="on"
        video={true}
        audio={true}
        flash='on'
        onInitialized={() => setIsCameraInitialized(true)}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity onPress={toggleRecording} style={{ padding: 20, backgroundColor: recording ? 'red' : 'transparent', borderRadius: 50 }}>
          <Text style={{ color: recording ? 'white' : 'red', fontSize: 24 }}>{recording ? '■' : '●'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RecordScreen;