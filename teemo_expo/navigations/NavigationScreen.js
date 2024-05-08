import { SafeAreaView, View, Text, Image, TouchableOpacity, Alert, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"

/**
 * 앱 전체 페이지로 이동할 수 있는 화면입니다.
 * 구현이 완료되면 삭제할 예정입니다.
 */
const NavigationScreen = () => {
    const navigation = useNavigation()

    const togoTakePicture = () => {
        navigation.navigate("TakePictureScreen")
    }

    const togoRecord = () => {
        navigation.navigate("RecordScreen")
    }

    const togoUserList = () => {
        navigation.navigate("UserListScreen")
    }

    const togoCamera = () => {
        navigation.navigate("CameraScreen")
    }

    const togoLogin = () => {
        navigation.navigate("KakaoLoginScreen")
    }

    const togoFaceRecog = () => {
        navigation.navigate("FaceRecognitionScreen")
    }

    const togoSignin = () => {
        navigation.navigate("SignInScreen")
    }

    const togoSignup = () => {
        navigation.navigate("SignUpScreen")
    }

    const togoUpload = () => {
        navigation.navigate("MediaUploadScreen")
    }

    const togoResult = () => {
        navigation.navigate("ResultMediaScreen")
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                    <Text style={contents.text}>카카오로그인화면</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={togoFaceRecog} style={containers.buttonContainer}>
                    <Text style={contents.text}>사용자인식화면</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={togoSignin} style={containers.buttonContainer}>
                    <Text style={contents.text}>로그인화면</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={togoSignup} style={containers.buttonContainer}>
                    <Text style={contents.text}>회원가입화면</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={togoUpload} style={containers.buttonContainer}>
                    <Text style={contents.text}>사진/동영상업로드화면</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={togoResult} style={containers.buttonContainer}>
                    <Text style={contents.text}>사진/동영상결과물화면</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default NavigationScreen

const containers = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    },
    buttonContainer: {
        flex: 1,
        paddingTop: 60
    }
})

const contents = StyleSheet.create({
    text: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#333333"
    }
})