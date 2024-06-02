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
import CustomProgressBar from "./CustomProgressBar"
import { useNavigation } from "@react-navigation/native"

const ResultMediaScreen = ({ route }) => {
    const [mediaType, setMediaType] = useState("PHOTO")
    const [saving, setSaving] = useState(false)
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
                        { text: "허용안함", style: "cancel" },
                        { text: "허용하기", style: "default", onPress: () => Linking.openSettings() }
                    ]
                )
                return;
            }
        }
    }

    const saveButtonHandler = async () => {
        const resultUrl = route.params.resultUrl;

        if (resultUrl) {
            try {
                setSaving(true);
                const destinationUri = `${FileSystem.documentDirectory}${mediaType === "PHOTO" ? "result.jpg" : "processed_video.mp4"}`;
                await FileSystem.moveAsync({ from: resultUrl, to: destinationUri });
                Alert.alert("사진 또는 동영상 저장이 완료되었습니다.");
            } catch (error) {
                console.log("미디어 저장 오류", error);
            } finally {
                setSaving(false);
            }
        } else {
            console.log("저장할 미디어가 없습니다.");
            Alert.alert("저장할 사진 또는 동영상이 없습니다.");
        }
    };

    useEffect(() => {
        requestPermission()
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressbarWrapper}>
                <CustomProgressBar currentStep={4} />
            </View>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>결과보기</Text>
            </View>
            <View style={styles.exContainer}>
                {mediaType === "PHOTO" ? (
                    <Image source={{ uri: route.params.resultUrl }} style={styles.media} resizeMode="contain" />
                ) : mediaType === "VIDEO" ? (
                    <Video source={{ uri: route.params.resultUrl }} style={styles.media} shouldPlay={true} useNativeControls={true} />
                ) : null}
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
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
    progressbarWrapper: { width: "100%", height: "8%", alignItems: "center", justifyContent: "center" },
    headerContainer: { width: "100%", height: "15%", justifyContent: "center" },
    exContainer: { width: "95%", height: "60%", alignItems: "center", justifyContent: "center", marginTop: "3%", padding: "1%", backgroundColor: "#e5e5e5" },
    titleText: { fontSize: "30%", fontWeight: "900", color: "#66CDAA", marginLeft: "7%" },
    downloadButtonContainer: { width: "90%", height: "10%", alignItems: "center", justifyContent: "center" },
    downloadButton: { width: "90%", height: "55%", backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1, elevation: 5 },
    downloadText: { fontSize: "20%", color: "#66CDAA", fontWeight: "bold" },
    bottomContainer: { width: "90%", height: "5.5%", flexDirection: "row", paddingHorizontal: "1%", justifyContent: "space-around" },
    homeText: { fontSize: 16, fontWeight: "500", color: "#555555" },
    media: { width: "100%", height: "100%" }
})