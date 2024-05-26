import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MosaicTest = ({ route }) => {
    const { userList } = route.params;
    const [additionalMedia, setAdditionalMedia] = useState([]);

    // 사용자가 미디어를 추가로 업로드하는 함수
    const handleUploadMedia = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                throw new Error('미디어 업로드 권한이 거부되었습니다.');
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.cancelled) {
                setAdditionalMedia((prevMedia) => [...prevMedia, result.uri]);
            }
        } catch (error) {
            console.error(`에러 발생: ${error.message}`);
            Alert.alert("에러 발생", error.message);
        }
    };

    // 서버로 미디어 업로드
    const handleUploadToServer = async () => {
        // 여기에 서버로 미디어 업로드 코드 추가
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>사용자 이미지 목록</Text>
            <View style={styles.imageContainer}>
                {userList.map(({ id, imageUrl }, index) => (
                    <View key={index} style={styles.userItem}>
                        <Text style={styles.userId}>{id}</Text>
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    </View>
                ))}
                {additionalMedia.map((mediaUri, index) => (
                    <View key={index} style={styles.userItem}>
                        <Image source={{ uri: mediaUri }} style={styles.image} />
                    </View>
                ))}
            </View>
            <TouchableOpacity onPress={handleUploadMedia} style={styles.uploadButton}>
                <Text style={styles.uploadText}>미디어 업로드</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUploadToServer} style={styles.uploadButton}>
                <Text style={styles.uploadText}>서버로 업로드</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MosaicTest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    userItem: {
        alignItems: 'center',
        margin: 10,
    },
    userId: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    image: {
        width: 100,
        height: 100,
    },
    uploadButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    uploadText: {
        color: '#FFF',
        fontSize: 16,
    },
});
