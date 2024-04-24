import { useEffect, useRef, useState } from "react"
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { Camera, CameraType } from "expo-camera"
import * as MediaLibrary from "expo-media-library"
import { Ionicons, Foundation, Entypo } from "@expo/vector-icons"
import RecordPage from "./RecordPage"

const TakePicturePage = () => {
    const [cameraType, setCameraType] = useState(CameraType.front)
    const [image, setImage] = useState(null)
    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const cameraRef = useRef(null)
    const [cameraMode, setCameraMode] = useState("CAMERA")


    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync()
            const cameraStatus = await Camera.requestCameraPermissionsAsync()
            setHasCameraPermission(cameraStatus.status === "granted")
        })()
    }, [])

    const toggleCameraType = () => {
        setCameraType(current => (
            current === CameraType.front ?
                CameraType.back : CameraType.front
        ))
    }

    const takePictureHandler = async () => {
        if (cameraRef) {
            try {
                const data = await cameraRef.current.takePictureAsync()
                console.log(data)
                setImage(data.uri)
                // savePicture()
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

    const savePicture = async () => {
        if (image) {
            try {
                await MediaLibrary.createAssetAsync(image)
                Alert.alert("사진이 저장되었습니다")
                setImage(null)
            } catch (e) {
                console.log("사진 저장 오류", e)
            }
        }
    }

    return cameraMode === "CAMERA" ? (
        <SafeAreaView style={containers.container}>
            <View style={containers.cameraContainer}>
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

                </Camera>
            </View>

            <View style={containers.bottom}>
                <View style={contents.horizontalLine} />

                <View style={contents.dot}>
                    <Entypo name="dot-single" size={27} color="#FFFFFF" />
                </View>

                <View style={containers.modeContainer}>
                    <View style={containers.cameraModeBtn}>
                        <TouchableOpacity onPress={() => setCameraMode("CAMERA")}>
                            <Text style={contents.text}>사진</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={containers.videoModeBtn}>
                        <TouchableOpacity onPress={() => setCameraMode("VIDEO")}>
                            <Text style={contents.text}>비디오</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={containers.buttonContainer}>
                    <TouchableOpacity style={contents.button} onPress={takePictureHandler}>
                        <Foundation name="record" size={110} color="#FFFFFF99" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    ) : <RecordPage />
}

export default TakePicturePage

const containers = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222222",
        alignItems: "center",
        width: "100%"
    },
    cameraContainer: {
        width: "100%",
        height: "80%"
    },
    camera: {
        flex: 1
    },
    cameraType: {
        position: "absolute",
        top: 20,
        right: 20
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        // backgroundColor: "transparent",
        // margin: 50
    },
    modeContainer: {
        flexDirection: "row",
        alignContent: "center",
        paddingTop: 25,
        justifyContent: "center"
    },
    cameraModeBtn: {
        alignSelf: "center",
        justifyContent: "center",
        marginRight: 20
    },
    videoModeBtn: {

    },
    bottom: {
        backgroundColor: "#222222",
        width: "100%",
        height: "20%"
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
    },
    horizontalLine: {
        height: 1,
        width: "96%",
        backgroundColor: "#FFFFFF",
        position: "absolute",
        bottom: 168,
        left: 9
    },
    dot: {
        position: "absolute",
        bottom: 145,
        left: 200
    }
})