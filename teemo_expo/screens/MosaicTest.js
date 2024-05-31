import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Video } from "expo-av"
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import Toast from "react-native-toast-message"
import CustomProgressBar from "./CustomProgressBar"

const MosaicTest = ({ route }) => {
    const { userList } = route.params;
    const [additionalMedia, setAdditionalMedia] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const currentStep = 3

    const [buttonText, setButtonText] = useState("사진 / 동영상 선택하기")

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

    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ['5.5%', '20%'], [])

    const handleUploadMedia = async () => {
        bottomSheetRef.current?.expand()
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

    const showToast = (mediaType) => {
        if (mediaType === "PHOTO") {
            Toast.show({
                type: "info",
                text1: "모자이크 사진 제작을 취소하였습니다.",
                visibilityTime: 2000,
                autoHide: true,
            })
        } else if (mediaType === "VIDEO") {
            Toast.show({
                type: "info",
                text1: "모자이크 영상 제작을 취소하였습니다.",
                visibilityTime: 2000,
                autoHide: true,
            })
        }
        console.log("제작 취소")
    }

    // 서버로 미디어 업로드
    const handleUploadToServer = async () => {
        if (!additionalMedia) {
            Alert.alert("그룹 이미지를 업로드하세요.");
            return;
        }

        const uploadToServer = async () => {
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
                const response = await fetch("http://192.168.219.105:8080/process_images", {
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
                // setResultImage(resultUrl);
                console.log(resultUrl)
                navigation.navigate("ResultMediaScreen", { mediaType, resultUrl });
            } catch (error) {
                console.error(`에러 발생: ${error.message}`);
                Alert.alert("에러 발생", error.message);
            }
        }

        Alert.alert(
            "모자이크 시작",
            "이전 페이지에서 선택한 인물들을 제외하고 모자이크 처리합니다.\n이 작업은 시간이 걸릴 수 있습니다.\n계속해서 진행하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                    onPress: () => showToast(mediaType)
                },
                {
                    text: "시작하기",
                    onPress: () => uploadToServer()
                }
            ]
        )
    };

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

        // setMedia({
        //     fileName: result.assets[0].fileName,
        //     height: result.assets[0].height,
        //     width: result.assets[0].width,
        //     mimeType: result.assets[0].mimeType,    // 미디어 유형/타입 (ex. video/mp4)
        //     type: result.assets[0].type,    // 미디어 타입 (ex. jpg)
        //     duration: result.assets[0].duration,    // 동영상 재생시간
        //     uri: result.assets[0].uri
        // })

        if (!result.canceled) {
            bottomSheetRef.current.close()
            setMediaType("PHOTO")
            setAdditionalMedia(result.assets[0].uri)
            setButtonText("다시 선택하기")
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
        // setMedia({
        //     fileName: result.assets[0].fileName,
        //     height: result.assets[0].height,
        //     width: result.assets[0].width,
        //     mimeType: result.assets[0].mimeType,    // 미디어 유형/타입 (ex. video/mp4)
        //     type: result.assets[0].type,    // 미디어 타입 (ex. jpg)
        //     duration: result.assets[0].duration,    // 동영상 재생시간 (사진의 경우 null)
        //     uri: result.assets[0].uri
        // })

        if (!result.canceled) {
            bottomSheetRef.current.close()
            setMediaType("VIDEO")
            setAdditionalMedia(result.assets[0].uri)
            setButtonText("다시 선택하기")
        }
    }

    useEffect(() => {
        setButtonText("사진 / 동영상 선택하기")
    }, [])

    return (
        <SafeAreaView style={styles.container}>

            <CustomProgressBar currentStep={currentStep} />

            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>제작하기</Text>
            </View>

            <View style={styles.exContainer}>
                {
                    additionalMedia ? (
                        // <Image source={{ uri: additionalMedia }} style={styles.image} />
                        mediaType === "PHOTO" ? (
                            additionalMedia != "" ? (
                                <Image
                                    source={{ uri: additionalMedia }}
                                    style={styles.media}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View />
                            )
                        ) : (
                            additionalMedia != "" ? (
                                <Video
                                    source={{ uri: additionalMedia }}
                                    style={styles.media}
                                    shouldPlay={true}
                                    useNativeControls={true}
                                />
                            ) : (
                                <View />
                            )
                        )
                    ) : (
                        <View />
                    )
                }
            </View>

            <View style={styles.uploadButtonContainer}>
                <TouchableOpacity onPress={handleUploadMedia} style={styles.uploadButton}>
                    <Text style={styles.uploadText}>{buttonText}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.guideText}>모자이크하고 싶은 사진이나 동영상을 선택해주세요.</Text>

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

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enableContentPanningGesture={true}
                enableHandlePanningGesture={true}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop {...props} pressBehavior="none" />
                )}
                style={{
                    shadowColor: "#000000", // 그림자 색상
                    shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
                    shadowOpacity: 0.3, // 그림자 투명도
                    shadowRadius: 7, // 그림자 반경
                    elevation: 5, // 그림자 높이 (Android용)
                }}
                backgroundStyle={{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20
                }}
            >
                <View style={styles.sheetContainer}>
                    <TouchableOpacity style={[styles.sheetButton, { marginTop: "1%" }]} onPress={pickPhoto}>
                        <Text style={styles.sheetText}>사진 선택하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sheetButton} onPress={pickVideo}>
                        <Text style={styles.sheetText}>동영상 선택하기</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
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
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: "3%",
        paddingBottom: "3%",
        backgroundColor: "#e5e5e5"
    },
    titleText: {
        fontSize: "30%",
        fontWeight: "900",
        color: "#66CDAA",
        marginLeft: "7%"
    },
    guideText: {
        fontSize: "17%",
        color: "#66CDAA"
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: "center"
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
        color: "#66CDAA",
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
        borderRadius: 10,
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
        backgroundColor: "#66CDAA",
        borderRadius: 10,
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
        color: "#66CDAA",
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
    sheetContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "4%",
        backgroundColor: '#FFFFFF',
        borderRadius: 100
    },
    sheetButton: {
        width: '90%',
        paddingVertical: "4%",
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: "3%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 5,
    },
    sheetText: {
        fontSize: "20%",
        color: '#66CDAA',
        fontWeight: 'bold',
    },
    sheetActions: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonClose: {
        backgroundColor: '#CCCCCC',
    }
})