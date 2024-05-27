import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const MosaicTest = ({ route }) => {
    const { userList } = route.params;
    const [additionalMedia, setAdditionalMedia] = useState(null);
    const [resultImage, setResultImage] = useState(null);

    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false)
    const [isPhoto, setIsPhoto] = useState(true)

    // 사용자가 미디어를 추가로 업로드하는 함수
    const handleUploadMedia = async () => {
        setModalVisible(true)
    }

    const handlePhotoPick = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!permission.granted) {
            Alert.alert("권한 필요", "갤러리에 접근하기 위한 권한이 필요합니다.")
            return
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 1,
            exif: false
        })

        if (!result.canceled && result.assets) {
            setAdditionalMedia(result.assets[0].uri)
            console.log(result.assets[0].uri)
            console.log("유저리스트", userList)
        }
    }

    const handleVideoPick = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permission.granted) {
            Alert.alert("권한 필요", "갤러리에 접근하기 위한 권한이 필요합니다.")
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsMultipleSelection: false,
        })

        if (!result.canceled && result.assets) {
            setAdditionalMedia(result.assets[0].uri)
            console.log(result.assets[0].uri)
            console.log("유저리스트", userList)
        }
    }

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
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>제작하기</Text>
                <Text style={styles.guideText}>모자이크하고 싶은 사진/동영상을 선택해주세요.</Text>
            </View>

            {/* <View style={styles.exContainer}>
                <View style={styles.imageContainer}>
                    {
                        userList.map(({ id, imageUrl }, index) => (
                            <View key={index} style={styles.userItem}>
                                <Text style={styles.userId}>{id}</Text>
                                <Image source={{ uri: imageUrl }} style={styles.image} />
                            </View>
                        ))
                    }
                </View>
            </View> */}

            <View style={styles.exContainer}>
                {
                    additionalMedia ? (
                        <Image source={{ uri: additionalMedia }} style={styles.image} />
                    ) : (
                        <Text>이미지를</Text>
                    )
                }
            </View>

            <TouchableOpacity onPress={handleUploadMedia} style={styles.uploadButton}>
                <Text style={styles.uploadText}>사진 / 동영상 선택하기</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.back}>이전 단계</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleUploadToServer} style={styles.nextButton}>
                    <Text style={styles.next}>다음 단계</Text>
                </TouchableOpacity>
            </View>

            {
                resultImage &&
                (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultTitle}>처리된 이미지</Text>
                        <Image source={{ uri: resultImage }} style={styles.resultImage} />
                    </View>
                )
            }

<Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setIsPhoto(true)}
                    >
                        <Text style={styles.textStyle}>사진 선택하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setIsPhoto(false)}
                    >
                        <Text style={styles.textStyle}>동영상 선택하기</Text>
                    </TouchableOpacity>
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                isPhoto ? imagePick() : videoPick();
                            }}
                        >
                            <Text style={styles.textStyle}>확인</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>취소</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default MosaicTest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    headerContainer: {
        width: "100%",
        height: "13%",
        justifyContent: "center"
    },
    exContainer: {
        width: "100%",
        height: "60%",
        paddingHorizontal: "3%",
        paddingBottom: "3%",
        backgroundColor: "#E1ECC8"
    },
    titleText: {
        fontSize: "30%",
        fontWeight: "900",
        color: "#A0C49D",
        marginLeft: "7%"
    },
    guideText: {
        fontSize: "17%",
        marginLeft: "7%",
        marginTop: "3%",
        color: "#A0C49D"
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
        width: "80%",
        borderRadius: 15,
        height: "8%",
        backgroundColor: "#F7FFE5",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "4%"
    },
    uploadText: {
        fontSize: "20%",
        color: "#A0C49D",
        fontWeight: "bold"
    },
    buttonContainer: {
        width: "90%",
        height: "16%",
        flexDirection: "row",
        paddingHorizontal: "1%",
        marginTop: "8%",
        justifyContent: "space-around"
    },
    backButton: {
        width: "46%",
        height: "40%",
        borderWidth: 1,
        borderColor: "#A0C49D",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    nextButton: {
        width: "46%",
        height: "40%",
        backgroundColor: "#A0C49D",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    back: {
        fontSize: "18%",
        color: "#A0C49D",
        fontWeight: "bold"
    },
    next: {
        fontSize: "18%",
        color: "#FFFFFF",
        fontWeight: "bold"
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
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalButton: {
        backgroundColor: "#F7FFE5",
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    modalText: {
        fontSize: 20,
        color: "#A0C49D",
        fontWeight: "bold"
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 20,
    },
    modalCancelButton: {
        backgroundColor: "#FFCCCC",
        padding: 10,
        borderRadius: 10,
        width: "40%",
        alignItems: "center",
    },
    modalCancelText: {
        fontSize: 18,
        color: "#FF0000",
        fontWeight: "bold"
    },
    modalConfirmButton: {
        backgroundColor: "#CCE5FF",
        padding: 10,
        borderRadius: 10,
        width: "40%",
        alignItems: "center",
    },
    modalConfirmText: {
        fontSize: 18,
        color: "#007BFF",
        fontWeight: "bold"
    }
});
