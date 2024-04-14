import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

class Userrecognition extends Component {
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
          onFacesDetected={this.onFacesDetected}
          onFaceDetectionError={this.onFaceDetectionError}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
        />
      </View>
    );
  }

  onFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      console.log('Faces detected!', faces);
    }
  };

  onFaceDetectionError = (error) => {
    console.error('Face Detection Error:', error);
  };
}

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
});

export default Userrecognition;
