import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs'; // 파일 저장 라이브러리

//사진 촬영 화면 코드
const PictureScreen = () => {
  const [showTakePictureButton, setShowTakePictureButton] = useState(true);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const takePicture = async () => { //사진 촬영
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: true };
        const { uri } = await cameraRef.current.takePictureAsync(options);
        if (uri) {
          await cameraRef.current.pausePreview();
          console.log("picture source : ", uri);
          setCapturedImage(uri);
          setShowTakePictureButton(false);
          setShowConfirmButtons(true);
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('사진 찍기 실패', '사진을 찍는 동안 문제가 발생했습니다.');
      }
    }
  };
    
  const resumePreview = async () => { //찍은 사진 확인
    if (cameraRef.current) {
      await cameraRef.current.resumePreview();
      setCapturedImage(null);
      setShowTakePictureButton(true);
      setShowConfirmButtons(false);
    }
  };

  const savePicture = async () => { //사진 저장
    try {
      const fileName = capturedImage.split('/').pop();
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.copyFile(capturedImage, destPath);
      Alert.alert('사진 저장 완료', '사진이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save picture:', error);
      Alert.alert('사진 저장 실패', '사진을 저장하는 동안 문제가 발생했습니다.');
    }
  };  

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: '카메라 사용 권한',
          message: '귀하의 카메라를 사용하려면 권한이 필요합니다',
          buttonPositive: '확인',
          buttonNegative: '취소',
        }}
        androidRecordAudioPermissionOptions={{
          title: '오디오 녹음 사용 권한',
          message: '귀하의 오디오를 사용하려면 권한이 필요합니다',
          buttonPositive: '확인',
          buttonNegative: '취소',
        }}
      >
        {({ camera, status }) => {
          if (status !== 'READY') return null;
          return (
            <View>
              {showTakePictureButton && (
                <TouchableOpacity onPress={takePicture} style={styles.button}>
                  <Text style={{ fontSize: 14 }}> 촬영 </Text>
                </TouchableOpacity>
              )}
              {showConfirmButtons && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={savePicture} style={[styles.button, { marginRight: 10 }]}>
                    <Text style={{ fontSize: 14 }}> 저장 </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={resumePreview} style={styles.button}>
                    <Text style={{ fontSize: 14 }}> 확인 </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      </RNCamera>
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
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
});

export default PictureScreen;
