import { useEffect, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    ActivityIndicator
} from "react-native"
import * as MediaLibrary from "expo-media-library"
import { Feather } from "@expo/vector-icons"
import MediaDisplay from "./MediaDisplay"

const { width } = Dimensions.get("window")

/**
 * 모자이크 처리된 결과물(사진 혹은 동영상)을 화면에 출력하고 저장할 수 있는 화면입니다.
 */
const ResultMediaScreen = () => {
    const [mediaType, setMediaType] = useState("PHOTO")  // 미디어 타입 PHOTO(사진) 또는 VIDEO(동영상), 기본 값은 PHOTO로 초기화
    const [mediaUri, setMediaUri] = useState("")    // 결과물 미디어(사진 or 동영상)의 URI
    const [loading, setLoading] = useState(true)    // 로딩 중인지 아닌지 여부
    const [saving, setSaving] = useState(false)     //저장 중인지 아닌지 여부

    /**
     * 서버로부터 전달된 미디어(사진 or 동영상) uri를 초기화합니다.
     * 미디어의 type과 uri를 전달받아야 합니다.
     */
    const loadMedia = async () => {
        try {
            const response = await fetch("http://13.209.77.184/api/load_media");
            const data = await response.json();
            setMediaType(data.type);
            setMediaUri(data.uri);
            setLoading(false);
        } catch (error) {
            console.error("미디어 불러오기 실패:", error);
        }
    }

    useEffect(() => {
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
            <View style={styles.titleContainer}>
                <Text style={styles.title}>사진/동영상 결과물 화면</Text>
            </View>

            <View style={styles.resultContainer}>
                <MediaDisplay loading={loading} mediaType={mediaType} mediaUri={mediaUri} />
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={() => saveButtonHandler()} style={styles.saveButton} >
                    <Feather name="download" size={30} color="#333333" />
                </TouchableOpacity>
                {
                    saving &&
                    <ActivityIndicator
                        size={Platform.OS === "ios" ? "small" : 20}
                        color="#005AC1"
                    />
                }
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
    titleContainer: {
        marginTop: 30
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 20
    },
    resultContainer: {
        width: width - 40,
        height: "65%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderRadius: 5,
        marginVertical: 20,
        paddingHorizontal: 20
    },
    saveButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginTop: 10,
        marginHorizontal: 25,
        borderRadius: 100
    },
    saveText: {
        color: "#333333",
        fontWeight: "bold",
        fontSize: 18
    }
})