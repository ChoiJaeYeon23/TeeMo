import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Camera } from "expo-camera"

import TakePictureScreen from "./TakePictureScreen"
import RecordScreen from "./RecordScreen"

const CameraScreen = () => {
    const [cameraMode, setCameraMode] = useState("CAMERA")

    return cameraMode === "CAMERA" ?
        <TakePictureScreen /> : <RecordScreen />
}

export default CameraScreen