import { SafeAreaView, View, Text, Image, TouchableOpacity, Alert, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"

const NavigationPage = () => {
    const navigation = useNavigation()

    const togoTakePicture = () => {
        navigation.navigate("TakePicturePage")
    }

    const togoRecord = () => {
        navigation.navigate("RecordPage")
    }

    const togoUserList = () => {
        navigation.navigate("UserListPage")
    }

    const togoCamera = () => {
        navigation.navigate("CameraPage")
    }

    const togoLogin = () => {
        navigation.navigate("LoginPage")
    }

    const togoFaceRecog = () => {
        navigation.navigate("FaceRecognitionPage")
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={containers.container}>
                <TouchableOpacity onPress={togoTakePicture} style={containers.buttonContainer}>
                    <Text style={contents.text}>사진촬영화면</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={togoRecord} style={containers.buttonContainer}>
                    <Text style={contents.text}>영상녹화화면</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={togoUserList} style={containers.buttonContainer}>
                    <Text style={contents.text}>사용자리스트화면</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={togoCamera} style={containers.buttonContainer}>
                    <Text style={contents.text}>카메라화면</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={togoLogin} style={containers.buttonContainer}>
                    <Text style={contents.text}>로그인화면</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={togoFaceRecog} style={containers.buttonContainer}>
                    <Text style={contents.text}>사용자인식화면</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default NavigationPage

const containers = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    },
    buttonContainer: {
        flex: 1,
        paddingTop: 100
    }
})

const contents = StyleSheet.create({
    text: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#333333"
    }
})