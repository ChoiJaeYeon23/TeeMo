import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Camera, VideoCodec, useCameraDevices, NoCameraDeviceError } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

import { Color, FontFamily, FontSize, Border } from './GlobalStyles';

const Record = () => {
  const navigation = useNavigation();
  const devices = useCameraDevices();
  const [recording, setRecording] = useState(false);

  const device = devices.back;

  const goToSettingsScreen = () => {
    navigation.navigate('SettingsScreen');
  };

  const goToSaveScreen = () => {
    navigation.navigate('SaveScreen');
  };

  const goToAddPerson = () => {
    navigation.navigate('AddPerson');
  };

  const onRecordingStart = () => {
    console.log('Recording started');
    setRecording(true);
  };

  const onRecordingEnd = (videoUrl) => {
    console.log('Recording ended. Video URL:', videoUrl);
    setRecording(false);
  };

  if (!device) return <NoCameraDeviceError />;

  return (
    <View style={styles.container}>
      <View style={styles.containerChild} />
      <View style={[styles.item, styles.layout]} />
      <TouchableOpacity onPress={goToSettingsScreen}>
        <Text style={[styles.title, styles.typography]}>설정</Text>
      </TouchableOpacity>
      <View style={[styles.innerContainer, styles.layout]} />
      <TouchableOpacity onPress={goToSaveScreen}>
        <Text style={[styles.subtitle, styles.typography]}>저장</Text>
      </TouchableOpacity>
      <View style={[styles.rectangleView, styles.subtitlePosition]} />
      <TouchableOpacity onPress={goToAddPerson}>
        <Text style={[styles.subtitle2, styles.subtitlePosition]}>인물 추가하기</Text>
      </TouchableOpacity>
      <Image style={styles.icon} resizeMode="cover" source={require('./rotate.png')} />
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        video={{
          codec: VideoCodec.H264,
          flash: Camera.Constants.FlashMode.off,
          preset: Camera.Constants.Preset.low,
          onRecordingStart,
          onRecordingEnd,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    height: 51,
    backgroundColor: Color.colorDarkgray,
  },
  typography: {
    width: 101,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    textAlign: 'center',
    color: Color.colorWhite,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    fontSize: FontSize.size_5xl,
    position: 'absolute',
  },
  subtitlePosition: {
    width: 192,
    left: 189,
    position: 'absolute',
  },
  containerChild: {
    top: 69,
    left: 0,
    backgroundColor: Color.colorBlack,
    width: 393,
    height: 550,
    position: 'absolute',
  },
  item: {
    left: 11,
    width: 80,
    top: 10,
    backgroundColor: Color.colorDarkgray,
    position: 'absolute',
  },
  title: {
    top: 18,
    width: 101,
  },
  innerContainer: {
    marginTop: 280,
    top: '50%',
    left: 118,
    borderRadius: Border.br_6xl,
    width: 154,
    position: 'absolute',
  },
  subtitle: {
    top: 640,
    left: 144,
  },
  rectangleView: {
    height: 51,
    backgroundColor: Color.colorDarkgray,
    top: 10,
  },
  subtitle2: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    textAlign: 'center',
    color: Color.colorWhite,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    fontSize: FontSize.size_5xl,
    left: 189,
    top: 18,
  },
  icon: {
    height: '4.27%',
    width: '8%',
    top: '12.31%',
    right: '4.62%',
    bottom: '85.43%',
    left: '87.64%',
    maxWidth: '100%',
    maxHeight: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  container: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: '100%',
    height: 844,
    overflow: 'hidden',
  },
});

export default Record;
