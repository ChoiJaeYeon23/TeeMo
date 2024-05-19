import { useEffect, useRef, useState } from "react"
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native"
import { Camera, CameraView } from "expo-camera"
import * as MediaLibrary from "expo-media-library"
import { useNavigation } from "@react-navigation/native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

/**
 * 사진 촬영 페이지입니다.
 * 동영상 모드로 전환 시 RecordScreen 화면을 반환합니다.
 */
const TakePictureScreen = () => {
    const navigation = useNavigation()
    const [cameraType, setCameraType] = useState("front")
    const [image, setImage] = useState(null)
    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const cameraRef = useRef(null)

    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync()
            const cameraStatus = await Camera.requestCameraPermissionsAsync()
            setHasCameraPermission(cameraStatus.status === "granted")
        })()
    }, [])

    // 카메라 타입(전면, 후면) 전환 함수
    const toggleCameraType = () => {
        setCameraType(current => (
            current === "front" ? "back" : "front"
        ))
    }

    const takePictureHandler = async () => {
        if (cameraRef) {
            try {
                const data = await cameraRef.current.takePictureAsync()
                console.log(data)
                setImage(data.uri)

                try {
                    await MediaLibrary.createAssetAsync(data.uri)
                    Alert.alert("사진이 저장되었습니다.")
                    setImage(null)
                } catch (e) {
                    console.log("사진 저장 오류", e)
                }
            } catch (e) {
                console.log("사진 찍기 오류", e)
            }
        }
    }

    const closeCamera = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.cameraContainer}>
            <CameraView
                ref={cameraRef}
                facing={cameraType}
                style={styles.camera}
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

                <TouchableOpacity style={{ marginBottom: "10%" }} onPress={() => takePictureHandler()}>
                    <MaterialCommunityIcons name="camera-iris" size={90} color="#FFFFFF90" />
                </TouchableOpacity>
            </CameraView>
        </View>
    )
}

export default TakePictureScreen

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
    }
})