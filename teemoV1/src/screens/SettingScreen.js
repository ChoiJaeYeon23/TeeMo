import { useState } from "react"
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native"
import { logout } from "@react-native-seoul/kakao-login"
import { useNavigation } from "@react-navigation/native"

/**
 * 모든 페이지 navigation.navigate() 되는지 확인
 */
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
    const goUserList = () => {
        navigation.navigate("UserList");
      };

    const goToRecord = () => {
        navigation.navigate("Record")
    }

    const goToPicture = () => {
        navigation.navigate("Picture");
      };

    const goToPerm = () => {
        navigation.navigate("권한화면")
    }
    return (
        <SafeAreaView>
            <View>
                <Text>앱 설정화면입니다.</Text>
            </View>

            <View>
                <TouchableOpacity onPress={signOutWithKakao}>
                    <Text>로그아웃하기</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goUserList}>
                    <Text>사용자인식</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToRecord}>
                    <Text>영상 녹화</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToPicture}>
                    <Text>사진</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToPerm}>
                    <Text>접근 권한 허용</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default SettingScreen