import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Video } from "expo-av"

const MosaicTest = ({ route }) => {
    const { userList } = route.params;
    const [additionalMedia, setAdditionalMedia] = useState(null);
    const [resultImage, setResultImage] = useState(null);

    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false)

    const [mediaType, setMediaType] = useState("PHOTO")
    const [media, setMedia] = useState({
        fileName: "",
        height: "",
        width: "",
        mimeType: "",
        type: "",
        duration: "",
        uri: ""
    })
    const [mediaUri, setMediaUri] = useState("")

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

    const openModal = () => {
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
    }

    // 갤러리에서 사진을 선택합니다
    const pickPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,   // 선택 시 편집 여부
            allowsMultipleSelection: false, // 선택 여러 개 여부
            selectionLimit: 1,  // 선택 개수 제한(숫자 형식, 지금은 1개)
            quality: 1, // 품질 (0~1까지의 값)
            exif: false,    // 메타데이터 포함 여부
        })

        console.log(result)

        setMedia({
            fileName: result.assets[0].fileName,
            height: result.assets[0].height,
            width: result.assets[0].width,
            mimeType: result.assets[0].mimeType,    // 미디어 유형/타입 (ex. video/mp4)
            type: result.assets[0].type,    // 미디어 타입 (ex. jpg)
            duration: result.assets[0].duration,    // 동영상 재생시간
            uri: result.assets[0].uri
        })

        if (!result.canceled) {
            setMediaType("PHOTO")
            setMediaUri(result.assets[0].uri)
            setModalVisible(false)
        } else {
            Alert.alert("사진 선택이 취소되었습니다.")
        }
    }

    // 갤러리에서 동영상을 선택합니다
    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,   // 선택 시 편집 여부
            allowsMultipleSelection: false, // 선택 여러 개 여부
            selectionLimit: 1,  // 선택 개수 제한(숫자 형식, 지금은 1개)
            quality: 1, // 품질 (0~1까지의 값)
            exif: false,    // 메타데이터 포함 여부
        })

        console.log(result)

        // 선택한 미디어(사진, 동영상)의 정보를 저장
        setMedia({
            fileName: result.assets[0].fileName,
            height: result.assets[0].height,
            width: result.assets[0].width,
            mimeType: result.assets[0].mimeType,    // 미디어 유형/타입 (ex. video/mp4)
            type: result.assets[0].type,    // 미디어 타입 (ex. jpg)
            duration: result.assets[0].duration,    // 동영상 재생시간 (사진의 경우 null)
            uri: result.assets[0].uri
        })

        if (!result.canceled) {
            setMediaType("VIDEO")
            setMediaUri(result.assets[0].uri)
            setModalVisible(false)
        } else {
            Alert.alert("동영상 선택이 취소되었습니다.")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>제작하기</Text>
            </View>

            <View style={styles.exContainer}>
                {
                    mediaUri ? (
                        // <Image source={{ uri: additionalMedia }} style={styles.image} />
                        mediaType === "PHOTO" ? (
                            mediaUri != "" ? (
                                <Image
                                    source={{ uri: mediaUri }}
                                    style={styles.media}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Text>아나</Text>
                            )
                        ) : (
                            mediaUri != "" ? (
                                <Video
                                    source={{ uri: mediaUri }}
                                    style={styles.media}
                                    shouldPlay={true}
                                    useNativeControls={true}
                                />
                            ) : (
                                <View></View>
                            )
                        )
                    ) : (
                        <Text>이미지를</Text>
                    )
                }
            </View>

            <View style={styles.uploadButtonContainer}>
                <TouchableOpacity onPress={handleUploadMedia} style={styles.uploadButton}>
                    <Text style={styles.uploadText}>사진 / 동영상 선택하기</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.guideText}>모자이크하고 싶은 사진/동영상을 선택해주세요.</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.back}>이전 단계</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleUploadToServer} style={styles.nextButton}>
                    <Text style={styles.next}>다음 단계</Text>
                </TouchableOpacity>
            </View>

            {/* {
                resultImage &&
                (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultTitle}>처리된 이미지</Text>
                        <Image source={{ uri: resultImage }} style={styles.resultImage} />
                    </View>
                )
            } */}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback onPress={closeModal}>

                    <View style={styles.modalView}>
                        <View style={styles.modalContentContainer}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={pickPhoto}
                            >
                                <Text style={styles.modalText}>사진 선택하기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={pickVideo}
                            >
                                <Text style={styles.modalText}>동영상 선택하기</Text>
                            </TouchableOpacity>
                            <View style={styles.modalActions}>

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.modalText}>닫기</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
        height: "20%",
        justifyContent: "center"
    },
    exContainer: {
        width: "100%",
        height: "40%",
        paddingHorizontal: "3%",
        paddingBottom: "3%",
        backgroundColor: "#e5e5e5"
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
    uploadButtonContainer: {
        width: "90%",
        height: "10%",
        alignItems: "center",
        justifyContent: "center"
    },
    uploadButton: {
        width: "90%",
        height: "55%",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 1 }, // 그림자 오프셋
        shadowOpacity: 0.2, // 그림자 투명도
        shadowRadius: 1, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
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
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    nextButton: {
        width: "46%",
        height: "40%",
        backgroundColor: "#A0C49D",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
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
    media: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
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
        backgroundColor: "#00000030",
    },
    modalContentContainer: {
        width: "70%",
        height: "20%",
        backgroundColor: "#FFFFFF"
    },
    modalButton: {
        backgroundColor: "#F7FFE5",
        padding: "3%",
        marginVertical: 10,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    modalText: {
        fontSize: "20%",
        color: "#A0C49D",
        fontWeight: "bold"
    },
    modalButtonContainer: {
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
