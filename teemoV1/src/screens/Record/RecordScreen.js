import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Video from 'react-native-video';

const RecordScreen = () => {
  const [recording, setRecording] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [processing, setProcessing] = useState(false);
  const cameraRef = useRef(null);
  const playerRef = useRef(null);

  const startRecording = async () => {
    setRecording(true);
    const options = { quality: RNCamera.Constants.VideoQuality["720p"] };
    const { uri, codec = 'mp4' } = await cameraRef.current.recordAsync(options);
    if (uri) {
      console.log(uri);
      setRecording(false);
      setVideoPath(uri);
      setProcessing(true);
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
      style={styles.button}
    >
      <Text style={{ fontSize: 14 }}> 녹화시작 </Text>
    </TouchableOpacity>
  );

  if (recording) {
    button = (
      <TouchableOpacity
        onPress={stopRecording}
        style={styles.button}
      >
        <Text style={{ fontSize: 14 }}> STOP </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {!processing ?
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
          android
        />
        :
        null
      }
      <View
        style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}
      >
        {button}
      </View>

      {videoPath ?
        // Reproduce el video en un pequeño espacio en la parte inferior
        <View
          style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
          <Video source={{ uri: videoPath }}   // Can be a URL or a local file.
            ref={playerRef}
            onBuffer={() => { }}                // Callback when remote video is buffering
            onError={() => { }}               // Callback when video cannot be loaded
            style={styles.backgroundVideo} />
          <TouchableOpacity style={styles.button}
            onPress={resumeVideo}>
            <Text>Aceptar</Text>
          </TouchableOpacity>
        </View>
        : null
      }
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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default RecordScreen;
