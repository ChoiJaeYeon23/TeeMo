import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MosaicTest = ({ route }) => {
    const { userList } = route.params;
    const [additionalMedia, setAdditionalMedia] = useState(null);
    const [resultImage, setResultImage] = useState(null);

    // 사용자가 미디어를 추가로 업로드하는 함수
    const handleUploadMedia = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("권한 필요", "갤러리에 접근하기 위한 권한이 필요합니다.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled && result.assets) {
            setAdditionalMedia(result.assets[0].uri); // 배열 대신 단일 URI 설정
            console.log(result.assets[0].uri);
            console.log("유저리스트", userList)
        }
    };

    // 서버로 미디어 업로드
    const handleUploadToServer = async () => {
        if (!additionalMedia) {
            Alert.alert("그룹 이미지를 업로드하세요.");
            return;
        }

        const formData = new FormData();

        // 기준 이미지 추가
        userList.forEach((user, index) => {
            formData.append('reference_images', {
                uri: user.imageUrl,
                name: `reference_image_${index}.jpg`,
                type: 'image/jpeg'
            });
        });

        // 그룹 이미지 추가
        formData.append('group_image', {
            uri: additionalMedia,
            name: 'group_image.jpg',
            type: 'image/jpeg'
        });

        try {
            const response = await fetch("http://localhost:5001/process_images", {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error('이미지 처리에 실패했습니다.');
            }

            const resultBlob = await response.blob();
            const resultUrl = URL.createObjectURL(resultBlob);
            setResultImage(resultUrl);
        } catch (error) {
            console.error(`에러 발생: ${error.message}`);
            Alert.alert("에러 발생", error.message);
        }
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
                <View>
                    {
                        additionalMedia ? (
                            <Image source={{ uri: additionalMedia }} style={styles.image} />
                        ) : (
                            <TouchableOpacity onPress={handleUploadMedia} style={styles.uploadButton}>
                                <Text style={styles.uploadText}>미디어 업로드</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
            <TouchableOpacity onPress={handleUploadToServer} style={styles.uploadButton}>
                <Text style={styles.uploadText}>서버로 업로드</Text>
            </TouchableOpacity>
            {resultImage && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>처리된 이미지</Text>
                    <Image source={{ uri: resultImage }} style={styles.resultImage} />
                </View>
            )}
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
    resultContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    resultImage: {
        width: 300,
        height: 300,
    }

});
