import { useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert
} from "react-native"
import * as MediaLibrary from "expo-media-library"
import MediaDisplay from "./MediaDisplay"

const { width } = Dimensions.get("window")

/**
 * 모자이크 처리된 결과물(사진 혹은 동영상)을 화면에 출력하고 저장할 수 있는 화면입니다.
 */
const ResultMediaScreen = () => {
    const [mediaType, setMediaType] = useState("PHOTO")  // 미디어 타입 PHOTO(사진) 또는 VIDEO(동영상), 기본 값은 PHOTO로 초기화
    const [mediaUri, setMediaUri] = useState("")    // 결과물 미디어(사진 or 동영상)의 URI

    // 서버로부터 전달된 미디어(사진 or 동영상) uri를 초기화합니다.
    const prepareMedia = () => {
        // setMediaType()
    }

    // 사진 및 동영상 저장
    const saveButtonHandler = async () => {
        if (mediaUri) {
            try {
                await MediaLibrary.createAssetAsync(mediaUri)
                Alert.alert("사진 또는 동영상 저장이 완료되었습니다.")
            } catch (error) {
                console.log("미디어 저장 오류", error)
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
                <MediaDisplay mediaType={mediaType} mediaUri={mediaUri} />
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={() => saveButtonHandler()} style={styles.saveButton} >
                    <Text style={styles.saveText}>저장하기</Text>
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
    titleContainer: {
        marginTop: 15
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 20
    },
    resultContainer: {
        width: width - 40,
        height: 600,
        borderWidth: 1,
        borderColor: "#333333",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 5
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderRadius: 5,
        marginVertical: 20,
        paddingHorizontal: 20
    },
    saveButton: {
        backgroundColor: "#87CEFA",
        paddingVertical: 20,
        paddingHorizontal: 30,
        marginHorizontal: 25,
        borderRadius: 25
    },
    saveText: {
        color: "#333333",
        fontWeight: "bold",
        fontSize: 18
    }
})