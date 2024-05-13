import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const Photo = () => {
  const [photo, setPhoto] = useState(null);

  const handleUpload = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setPhoto(source);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleUpload} style={styles.uploadContainer}>
        {photo ? (
          <Image source={photo} style={styles.image} />
        ) : (
          <Text style={styles.uploadText}>사진 업로드</Text>
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
  image: {
    width: 300,
    height: 400,
    borderRadius: 20,
  },
  uploadText: {
    fontSize: 20,
    color: '#000',
  },
});

export default Photo;
