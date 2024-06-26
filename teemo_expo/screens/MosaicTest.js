import React, { useState, useRef, useMemo, useEffect, isValidElement } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Animated
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Video } from "expo-av"
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import Toast from "react-native-toast-message"
import CustomProgressBar from "./CustomProgressBar"
import { Ubuntu_server, Local_Server } from '@env'
import ImageLoadingModal from './ImageLoadingModal'

const MosaicTest = ({ route }) => {
    const { userList } = route.params;
    const [additionalMedia, setAdditionalMedia] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const currentStep = 3
    const [buttonText, setButtonText] = useState("사진 / 동영상 선택하기")
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false)
    const scaleValue = useRef(new Animated.Value(1)).current
    const backScaleValue = useRef(new Animated.Value(1)).current
    const nextScaleValue = useRef(new Animated.Value(1)).current
    const [mediaType, setMediaType] = useState("PHOTO")

    const startPressAnimation = () => {
        Animated.timing(scaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endPressAnimation = () => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const startBackPressAnimation = () => {
        Animated.timing(backScaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endBackPressAnimation = () => {
        Animated.timing(backScaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const startNextPressAnimation = () => {
        Animated.timing(nextScaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endNextPressAnimation = () => {
        Animated.timing(nextScaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ['4%', '23%'], [])

    const handleUploadMedia = async () => {
        bottomSheetRef.current?.expand()
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

        if (mediaType === "PHOTO") {        // 사진 처리
            const uploadToServer = async () => {
                setIsLoading(true);
                const formData = new FormData();

                // 기준 이미지 추가
                userList.forEach((user, userIndex) => {
                    Object.keys(user.images).forEach((imageKey, imageIndex) => {
                        const imageName = `reference_image_${userIndex}_${imageIndex}.jpeg`;
                        formData.append('reference_images', {
                            uri: user.images[imageKey],
                            name: imageName
                        });
                    });
                });
                
                // 그룹 이미지 추가
                formData.append('group_image', {
                    uri: additionalMedia,
                    name: 'group_image.jpeg'
                });

                try {
                    const response = await fetch(`${Local_Server}/process_media`, {
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
                    // console.log(resultUrl);
                    setIsLoading(false);
                    navigation.navigate("ResultMediaScreen", { mediaType, resultUrl });
                } catch (error) {
                    setIsLoading(false);
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
        } else if (mediaType === "VIDEO") {         // 동영상 처리
            const uploadToServer = async () => {
                setIsLoading(true);
                const formData = new FormData();

                // 기준 이미지 추가
                userList.forEach((user, userIndex) => {
                    Object.keys(user.images).forEach((imageKey, imageIndex) => {
                        const imageName = `reference_image_${userIndex}_${imageIndex}.jpeg`;
                        formData.append('reference_images', {
                            uri: user.images[imageKey],
                            name: imageName
                        });
                    });
                });
                // 그룹 동영상 추가
                formData.append('group_video', {
                    uri: additionalMedia,
                    name: 'group_video.mp4'
                });
                try {
                    const response = await fetch(`${Local_Server}/process_media`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (!response.ok) {
                        throw new Error('동영상 처리에 실패했습니다.');
                    }

                    const resultBlob = await response.blob();
                    const resultUrl = URL.createObjectURL(resultBlob);
                    // setResultImage(resultUrl);
                    // console.log(resultUrl)
                    setIsLoading(false);
                    navigation.navigate("ResultMediaScreen", { mediaType, resultUrl });
                } catch (error) {
                    setIsLoading(false);
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
        }
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
        <>
            <SafeAreaView style={styles.container}>

                <View style={styles.progressbarWrapper}>
                    <CustomProgressBar currentStep={currentStep} />
                </View>

                <View style={styles.headerContainer}>
                    <Text style={styles.titleText}>비실시간 제작하기</Text>
                </View>

                <View style={styles.exContainer}>
                    {
                        additionalMedia ? (
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

                <Animated.View style={[styles.uploadButtonContainer, { transform: [{ scale: scaleValue }] }]}>
                    <TouchableOpacity
                        onPressIn={() => startPressAnimation()}
                        onPressOut={() => endPressAnimation()}
                        onPress={handleUploadMedia}
                        activeOpacity={1}
                        style={styles.uploadButton}>
                        <Text style={styles.uploadText}>{buttonText}</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Text style={styles.guideText}>모자이크하고 싶은 사진이나 동영상을 선택해주세요.</Text>

                <View style={styles.buttonContainer}>
                    <Animated.View style={{ width: "46%", transform: [{ scale: backScaleValue }] }}>
                        <TouchableOpacity
                            onPressIn={() => startBackPressAnimation()}
                            onPressOut={() => endBackPressAnimation()}
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={1}
                        >
                            <Text style={styles.back}>이전 단계</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{ width: "46%", transform: [{ scale: nextScaleValue }] }}>
                        <TouchableOpacity
                            onPressIn={() => startNextPressAnimation()}
                            onPressOut={() => endNextPressAnimation()}
                            onPress={handleUploadToServer}
                            style={styles.nextButton}
                            activeOpacity={1}
                        >
                            <Text style={styles.next}>다음 단계</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

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
                        <TouchableOpacity
                            style={[styles.sheetButton, { marginTop: "1%" }]}
                            onPress={pickPhoto}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.sheetText}>사진 선택하기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.sheetButton}
                            onPress={pickVideo}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.sheetText}>동영상 선택하기</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheet>
                <ImageLoadingModal visible={isLoading} />
            </SafeAreaView>
            <Toast />
        </>
    );
};

export default MosaicTest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    progressbarWrapper: {
        width: "100%",
        height: "8%",
        alignItems: "center",
        justifyContent: "center",
    },
    headerContainer: {
        width: "100%",
        height: "7%",
        justifyContent: "center"
    },
    exContainer: {
        width: "95%",
        height: "60%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "3%",
        padding: "1%",
        backgroundColor: "#e5e5e5"
    },
    titleText: {
        fontSize: "30%",
        fontWeight: "900",
        color: "#95ce67",
        marginLeft: "7%"
    },
    guideText: {
        fontSize: "17%",
        color: "#95ce67"
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
        color: "#95ce67",
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
        width: "100%",
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
        width: "100%",
        height: "40%",
        backgroundColor: "#95ce67",
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
        color: "#95ce67",
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
        color: '#95ce67',
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