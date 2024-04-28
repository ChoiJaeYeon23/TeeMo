import { SafeAreaView, View, Text, Image, TouchableOpacity, Alert, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"

/**
 * 카카오 로그인 화면입니다.
 */
const KakaoLoginScreen = () => {
    const navigation = useNavigation()

    const loginHandler = () => {
        navigation.navigate("WebViewScreen")
    }

    return (
        <SafeAreaView style={containers.container}>
            <View style={containers.appLogo}>
                <Image
                    source={require("../images/app_logo.png")}
                    style={contents.appLogo}
                />
            </View>

            <View style={containers.loginBtn}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={loginHandler}
                    >
                    <Image
                        source={require("../images/kakao_login.png")}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default KakaoLoginScreen

const containers = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    appLogo: {
        width: "100%",
        height: "60%",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 300
    },
    loginBtn: {
        width: "100%",
        height: "40%",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100
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
    },
    appLogo: {
        width: 250,
        height: 250
    }
})