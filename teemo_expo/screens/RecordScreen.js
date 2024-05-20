import { useState, useRef, useEffect } from "react"
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native"
import { Camera, CameraView } from "expo-camera"
import * as MediaLibrary from "expo-media-library"
import { useNavigation } from "@react-navigation/native"
import { Ionicons, FontAwesome6 } from "@expo/vector-icons"

/**
 * 동영상 녹화 페이지입니다.
 * 사진 모드로 전환 시 TakePictureScreen 화면을 반환합니다.
 */
const RecordScreen = () => {
    const navigation = useNavigation()

    const cameraRef = useRef(null)
    const [cameraType, setCameraType] = useState("front")
    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [hasMicrophonePermission, setHasMicrophonePermission] = useState(null)
    const [isRecording, setIsRecording] = useState(false)
    const [video, setVideo] = useState(null)
    const cameraMode = "video"
    // 페이지 로드 시 카메라, 녹음, 갤러리 접근 권한 허용 여부 확인
    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync()
            const cameraStatus = await Camera.requestCameraPermissionsAsync()
            const microphoneStatus = await Camera.requestMicrophonePermissionsAsync()

            setHasCameraPermission(cameraStatus.status === "granted")
            setHasMicrophonePermission(microphoneStatus.status === "granted")
        })()
    }, [])

    // 카메라 타입(전면, 후면) 전환 함수
    const toggleCameraType = () => {
        setCameraType(current => (
            current === "front" ? "back" : "front"
        ))
    }

    const closeCamera = () => {
        navigation.goBack()
    }

    // 녹화 시작 함수
    const recordVideo = async () => {
        if (cameraRef) {
            console.log(cameraRef)
            try {
                setIsRecording(true)
                const data = await cameraRef.current.recordAsync()
                console.log(data)
                setVideo(data.uri)
                setIsRecording(false)
                try {
                    await MediaLibrary.createAssetAsync(data.uri)
                    Alert.alert("영상이 저장되었습니다")
                    setVideo(null)
                } catch (e) {
                    console.log("영상 저장 오류", e)
                }
            } catch (e) {
                console.log("영상 녹화 오류", e)
            }
        }
    }

    // 녹화 종료 함수
    const stopRecording = () => {
        setIsRecording(false)
        cameraRef.current.stopRecording()
    }

    return (
        <View style={styles.cameraContainer}>
            <CameraView
                ref={cameraRef}
                facing={cameraType}
                style={styles.camera}
                mode={cameraMode}
            >

                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={() => closeCamera()} hitSlop={30}>
                            <Ionicons name="close" size={35} color="#FFFFFF90" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity onPress={() => toggleCameraType()} hitSlop={30}>
                            <Ionicons name="camera-reverse-outline" size={35} color="#FFFFFF90" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.record}>
                    {
                        isRecording ? (
                            <TouchableOpacity style={styles.recordButton} onPress={()=>stopRecording()}>
                                <FontAwesome6 name="stop-circle" size={55} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.recordButton} onPress={()=>recordVideo()}>
                                <FontAwesome6 name="circle-dot" size={55} color="white" />
                            </TouchableOpacity>
                        )
                    }
                </View>
            </CameraView>
        </View>
    )
}

export default RecordScreen

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1
    },
    camera: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "13%"
    },
    button: {
        marginHorizontal: "37%"
    },
    record: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: "15%"
    },
    recordButton: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center"
    }
})