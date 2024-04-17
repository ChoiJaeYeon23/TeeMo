import React from 'react';
import { View } from 'react-native';
import { RNCamera } from 'react-native-camera';

const Userrecognition = () => (
  <View style={{ flex: 1 }}>
    <RNCamera
      style={{ flex: 1 }}
      type={RNCamera.Constants.Type.front}
    />
  </View>
);

export default Userrecognition;