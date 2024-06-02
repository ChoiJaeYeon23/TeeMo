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
import * as FileSystem from 'expo-file-system';

/**
 * 모자이크 처리된 결과물(사진 혹은 동영상)을 화면에 출력하고 저장할 수 있는 화면입니다.
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
        
        // 서버로부터 받은 미디어 데이터를 가져와 로컬 파일로 저장합니다.
        const response = await fetch(route.params.resultUrl);
        const blob = await response.blob();

        // 파일의 확장자를 결정합니다.
        const fileExtension = route.params.mediaType === "PHOTO" ? ".jpg" : ".mp4";

        // 파일 URI를 지정합니다.
        const fileUri = FileSystem.documentDirectory + `downloaded_media${fileExtension}`;

        // Blob 데이터를 파일로 변환하여 저장합니다.
        await FileSystem.writeAsStringAsync(fileUri, await blobToBase64(blob), { encoding: FileSystem.EncodingType.Base64 });

        setMediaUri(fileUri);
    }

    useEffect(() => {
        requestPermission()
        loadMedia()
    }, [route.params])

    // 사진 및 동영상 저장
    const saveButtonHandler = async () => {
        if (mediaUri) {
            try {
                setSaving(true)

                // MediaLibrary를 사용하여 파일을 저장합니다.
                const asset = await MediaLibrary.createAssetAsync(mediaUri);
                await MediaLibrary.createAlbumAsync('Expo', asset, false);

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

    // Blob 데이터를 Base64 문자열로 변환하는 함수
    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

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
                                    shouldPlay
                                    useNativeControls
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
        color: "#95ce67",
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
        color: "#95ce67",
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