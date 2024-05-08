import { useState, useRef, useEffect } from "react"
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native"
import { Camera, CameraType } from "expo-camera"
import * as MediaLibrary from "expo-media-library"
import { Ionicons, FontAwesome6 } from "@expo/vector-icons"

/**
 * 동영상 녹화 페이지입니다.
 * 사진 모드로 전환 시 TakePictureScreen 화면을 반환합니다.
 */
const RecordScreen = () => {
    const cameraRef = useRef(null)
    const [cameraType, setCameraType] = useState(CameraType.front)
    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [hasMicrophonePermission, setHasMicrophonePermission] = useState(null)
    const [isRecording, setIsRecording] = useState(false)
    const [video, setVideo] = useState(null)

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
            current === CameraType.front ?
                CameraType.back : CameraType.front
        ))
    }

    // 녹화 시작 함수
    const recordVideo = async () => {
        if (cameraRef) {
            try {
                setIsRecording(true)
                const data = await cameraRef.current.recordAsync()
                console.log(data)
                setVideo(data.uri)
                setIsRecording(false)
                // saveVideo()
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

    /*
    const saveVideo = async () => {
        if (video) {
            try {
                await MediaLibrary.createAssetAsync(video)
                Alert.alert("영상이 저장되었습니다")
                setVideo(null)
            } catch (e) {
                console.log("영상 저장 오류", e)
            }
        }
    }
    */

    return (
        <View style={containers.container}>
            <Camera
                ref={cameraRef}
                type={cameraType}
                style={containers.camera}
            >

                <View style={containers.cameraType}>
                    <TouchableOpacity style={contents.button} onPress={toggleCameraType} hitSlop={30}>
                        <Ionicons name="camera-reverse-outline" size={32} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <View style={containers.buttonContainer}>
                    {
                        isRecording ? (
                            <TouchableOpacity style={contents.button} onPress={stopRecording}>
                                <FontAwesome6 name="stop-circle" size={55} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={contents.button} onPress={recordVideo}>
                                <FontAwesome6 name="circle-dot" size={55} color="white" />
                            </TouchableOpacity>
                        )
                    }

                </View>
            </Camera>
        </View>
    )
}

export default RecordScreen

const containers = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    camera: {
        flex: 1
    },
    cameraType: {
        position: "absolute",
        top: 60,
        right: 20
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64
    }
})

const contents = StyleSheet.create({
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center"
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF"
    }
})