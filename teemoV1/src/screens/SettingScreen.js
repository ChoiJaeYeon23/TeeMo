import { useState } from "react"
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native"
import { logout } from "@react-native-seoul/kakao-login"
import { useNavigation } from "@react-navigation/native"

const SettingScreen = () => {
    const [isLogout, setIsLogout] = useState("")
    const [isLogin, setIsLogin] = useState(true)

    const navigation = useNavigation()

    /**
     * 계정 로그아웃을 시도하는 함수입니다.
     * 
     */
    const signOutWithKakao = async () => {
        console.log("로그아웃 버튼 눌림")
        try {
            const message = await logout()
            setIsLogout(message)
            setIsLogin(false)
            if (isLogout == "Successfully logged out") console.log("로그아웃 성공")
            navigation.navigate("로그인화면")
        } catch (err) {
            console.error("로그아웃 오류", err)
        }
    }

    const goToRecord = () => {
        navigation.navigate("Record");
      };

    const goToPicture = () => {
        navigation.navigate("Picture");
      };

    return (
        <SafeAreaView>
            <View>
                <Text>앱 설정화면입니다.</Text>
            </View>

            <View>
                <TouchableOpacity onPress={signOutWithKakao}>
                    <Text>로그아웃하기</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToRecord}>
                    <Text>영상 녹화</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToPicture}>
                    <Text>사진</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default SettingScreen