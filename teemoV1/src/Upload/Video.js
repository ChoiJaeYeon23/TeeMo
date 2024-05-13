import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';

const VideoUploadScreen = () => {
  const [videoUri, setVideoUri] = useState(null);

  const handleUpload = () => {
    const options = {
      mediaType: 'video',
      storageOptions: {
        skipBackup: true,
        path: 'videos',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        console.log('VideoPicker Error: ', response.error);
      } else {
        setVideoUri(response.uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleUpload} style={styles.uploadContainer}>
        {videoUri ? (
          <Video 
            source={{ uri: videoUri }}   // Can be a URL or a local file.
            style={styles.video} 
            controls={true}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.uploadText}>동영상 업로드</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  uploadContainer: {
    width: 300,
    height: 400,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  uploadText: {
    fontSize: 20,
    color: '#000',
  },
});

export default VideoUploadScreen;
