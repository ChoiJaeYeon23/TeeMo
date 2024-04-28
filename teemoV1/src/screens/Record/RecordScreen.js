import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';
import { CameraRoll } from "react-native";
import { useNavigation } from '@react-navigation/native';

//영상 녹화 화면 코드
const RecordScreen = () => {
  const [recording, setRecording] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const cameraRef = useRef(null);
  const devices = useCameraDevices('back');
  const { hasPermission } = useCameraPermission();

  const navigation = useNavigation();

  useEffect(() => {
    if (devices && !recording) {
      startRecording(); // devices가 설정되고 녹화 중이 아닐 때 녹화를 시작합니다.
    }
  }, [devices, recording]);

  //녹화 시작 or 중지
  const toggleRecording = async () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

//녹화 시작
const startRecording = async () => {
    if (cameraRef.current) {
      try {
        const video = await cameraRef.current();
        setRecording(true);
        setVideoPath(video.uri);
      } catch (error) {
        console.error('녹화 오류 :', error);
        setRecording(false);
      }
    } else {
      console.error('카메라가 준비 되지 않았습니다.');
    }
  };

  //녹화 중지
  const stopRecording = async () => {
    if (cameraRef.current && recording) {
      try {
        const video = await cameraRef.current.stopRecording();
        setRecording(false);
        saveVideoToCameraRoll(video.uri);
      } catch (error) {
        console.error('녹화 중지 오류 :', error);
      }
    }
  };

  // 비디오를 카메라 롤에 저장
  const saveVideoToCameraRoll = async (videoUri) => {
    try {
      const saveResult = await CameraRoll.save(videoUri, { type: 'video' });
      console.log('비디오 저장 결과:', saveResult);
    } catch (error) {
      console.error('비디오 저장 오류 :', error);
    }
  };

  //권한, 카메라 장치가 없으면 indicator 표시
  if (!hasPermission || devices == null) {
    return <ActivityIndicator size={20} color={'red'} />;
  }

  if (!hasPermission) {
    navigation.navigate('권한화면');
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        ref={cameraRef}
        device={devices[0]}
        autoFocus="on"
        video={true}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity onPress={toggleRecording} style={{ padding: 20, backgroundColor: recording ? 'red' : 'transparent', borderRadius: 50 }}>
          <Text style={{ color: recording ? 'white' : 'red', fontSize: 24 }}>{recording ? '■' : '●'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecordScreen;
