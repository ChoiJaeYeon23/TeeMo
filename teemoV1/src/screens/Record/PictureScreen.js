import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';

const PictureScreen = () => {
  const [pausePreview, setPausePreview] = useState(false);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    const options = { quality: 0.5, base64: true };
    const { uri } = await cameraRef.current.takePictureAsync(options);
    if (uri) {
      await cameraRef.current.pausePreview();
      console.log("picture source", uri);
      setPausePreview(true);
    }
  };
    
  const resumePicture = async () => {
    await cameraRef.current.resumePreview();
    setPausePreview(false);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        {({ camera, status }) => {
          if (status !== 'READY') return null;
          return (
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
              {pausePreview &&
                <TouchableOpacity style={styles.button} onPress={resumePicture}>
                  <Text>Aceptar</Text>
                </TouchableOpacity>
              }
              <TouchableOpacity onPress={takePicture} style={styles.button}>
                <Text style={{ fontSize: 14 }}> SNAP </Text>
              </TouchableOpacity>
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

export default PictureScreen;
