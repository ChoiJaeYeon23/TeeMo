import { useEffect, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    Linking
} from "react-native"
import * as MediaLibrary from "expo-media-library"
import { Video } from "expo-av"
import { Feather } from "@expo/vector-icons"
import CustomProgressBar from "./CustomProgressBar"
import { useNavigation } from "@react-navigation/native"

/**
 * 모자이크 처리된 결과물(사진 혹은 동영상)을 화면에 출력하고 저장할 수 있는 화면입니다.
 * blob 형태라 저장 안됨 ;;;;;; 도움 plz
 */
const ResultMediaScreen = ({ route }) => {
    const [mediaType, setMediaType] = useState("PHOTO")  // 미디어 타입 PHOTO(사진) 또는 VIDEO(동영상), 기본 값은 PHOTO로 초기화
    const [mediaUri, setMediaUri] = useState("")    // 결과물 미디어(사진 or 동영상)의 URI
    const [loading, setLoading] = useState(true)    // 로딩 중인지 아닌지 여부
    const [saving, setSaving] = useState(false)     //저장 중인지 아닌지 여부
    const currentStep = 4
    const navigation = useNavigation()
    const [permissionResponse, setPermissionResponse] = MediaLibrary.usePermissions()

    const requestPermission = async () => {
        if (permissionResponse?.status !== 'granted') {
            const response = await setPermissionResponse();
            if (response.status !== 'granted') {
                Alert.alert(
                    "접근 권한을 허용해주세요",
                    "미디어 라이브러리 접근 권한을 허용하지 않으면 사진 혹은 동영상을 저장할 수 없습니다.",
                    [
                        {
                            text: "허용안함",
                            style: "cancel"
                        },
                        {
                            text: "허용하기",
                            style: "default",
                            onPress: () => Linking.openSettings()
                        }
                    ]
                )
                return;
            }
        }
    }
    
    /**
     * 서버로부터 전달된 미디어(사진 or 동영상) uri를 초기화합니다.
     * 미디어의 type과 uri를 전달받아야 합니다.
     */
    const loadMedia = async () => {
        setMediaType(route.params.mediaType)
        setMediaUri(route.params.resultUrl)
    }

    useEffect(() => {
        requestPermission()
        loadMedia()
    }, [mediaType], [mediaUri])

    // 사진 및 동영상 저장
    const saveButtonHandler = async () => {
        if (mediaUri) {
            try {
                setSaving(true)
                await MediaLibrary.createAssetAsync(mediaUri)
                Alert.alert("사진 또는 동영상 저장이 완료되었습니다.")
            } catch (error) {
                console.log("미디어 저장 오류", error)
            } finally {
                setSaving(false)
            }
        } else {
            console.log("저장할 미디어가 없습니다.")
            Alert.alert("저장할 사진 또는 동영상이 없습니다.")
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.progressbarWrapper}>
                <CustomProgressBar currentStep={currentStep} />
            </View>

            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>결과보기</Text>
            </View>

            <View style={styles.exContainer}>
                {
                    mediaUri ? (
                        mediaType === "PHOTO" ? (
                            mediaUri != "" ? (
                                <Image
                                    source={{ uri: mediaUri }}
                                    style={styles.media}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View />
                            )
                        ) : (
                            mediaUri != "" ? (
                                <Video
                                    source={{ uri: mediaUri }}
                                    style={styles.media}
                                    shouldPlay={true}
                                    useNativeControls={true}
                                    resizeMode="contain"
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

            <View style={styles.downloadButtonContainer}>
                <TouchableOpacity onPress={saveButtonHandler} style={styles.downloadButton}>
                    <Text style={styles.downloadText}>다운로드</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("ChoiceMedia")}>
                    <Text style={styles.homeText}>홈으로</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ResultMediaScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    progressbarWrapper: {
        width: "100%",
        height: "8%",
        alignItems: "center",
        justifyContent: "center",
    },
    headerContainer: {
        width: "100%",
        height: "15%",
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
        color: "#66CDAA",
        marginLeft: "7%"
    },
    downloadButtonContainer: {
        width: "90%",
        height: "10%",
        alignItems: "center",
        justifyContent: "center"
    },
    downloadButton: {
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
    downloadText: {
        fontSize: "20%",
        color: "#66CDAA",
        fontWeight: "bold"
    },
    bottomContainer: {
        width: "90%",
        height: "5.5%",
        flexDirection: "row",
        paddingHorizontal: "1%",
        justifyContent: "space-around"
    },
    homeText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#555555"
    },
    media: {
        width: "100%",
        height: "100%"
    }
})