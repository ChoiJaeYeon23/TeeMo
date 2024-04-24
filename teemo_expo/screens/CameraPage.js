import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Camera } from "expo-camera"

import TakePicturePage from "./TakePicturePage"
import RecordPage from "./RecordPage"

const CameraPage = () => {
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.front)
    const [isRecording, setIsRecording] = useState(false)
    const cameraRef = useRef(null)
    const [cameraMode, setCameraMode] = useState("CAMERA")

    /*
    const toggleCameraType = () => {
        setCameraType(
            cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        )
    };

    const toggleRecording = async () => {
        if (isRecording) {
            await cameraRef.current.stopRecording()
        } else {
            const { uri } = await cameraRef.current.recordAsync()
            console.log("녹화 시작", uri)
        }
        setIsRecording(prevState => !prevState)
    }
    */

    return cameraMode === "CAMERA" ? <TakePicturePage /> : <RecordPage />
    /*
    return (
        <View style={containers.container}>
            <Camera
                ref={cameraRef}
                type={cameraType}
                style={styles.camera}
            >
                <View style={containers.cameraType}>
                    <TouchableOpacity onPress={toggleCameraType} style={styles.topButton}>
                        <Ionicons name="camera-reverse" size={32} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomBar}>
                    <View style={styles.modeContainer}>
                        <TouchableOpacity style={styles.modeButton}>
                            <Text style={styles.modeText}>사진</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modeButton}>
                            <Text style={styles.modeText}>비디오</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.actionContainer}>
                        {isRecording ? (
                            <TouchableOpacity onPress={toggleRecording} style={styles.recordButton}>
                                <Ionicons name="videocam-off" size={64} color="red" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={toggleRecording} style={styles.recordButton}>
                                <Ionicons name="videocam" size={64} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Camera>
        </View>
    ) */
}

export default CameraPage

const containers = StyleSheet.create({
    container: {
        flex: 1
    },
    camera: {
        flex: 1
    },
    cameraType: {
        position: "absolute",
        top: 45,
        right: 15
    },

})

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    camera: {
        flex: 1
    },
    topBar: {
        position: "absolute",
        top: 20,
        left: 20
    },
    topButton: {
        padding: 10
    },
    bottomBar: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    modeContainer: {
        flexDirection: "row"
    },
    modeButton: {
        padding: 10
    },
    modeText: {
        fontSize: 18,
        color: "white"
    },
    actionContainer: {},
    recordButton: {
        padding: 10
    }
})
