<<<<<<< HEAD
import { useEffect, useState } from "react"
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet, Image } from "react-native"
import { login, getProfile as getKakaoProfile } from "@react-native-seoul/kakao-login"
import { useNavigation, useIsFocused } from "@react-navigation/native"
=======
import { SafeAreaView, View, Text, Button } from "react-native"
import { useNavigation } from "@react-navigation/native";
>>>>>>> Suji

/**
 * 카카오 API를 이용한 로그인 화면입니다.
 */

const KakaoLoginScreen = () => {
<<<<<<< HEAD
  const [result, setResult] = useState("")
  const [auth, setAuth] = useState(false)
  const [profile, setProfile] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const navigation = useNavigation()

  /**
   * 카카오 계정으로 로그인을 시도하는 함수입니다.
   * 로그인 결과 토큰을 받아 JSON 형식으로 반환합니다.
   */
  const signInWithKakao = async () => {
    console.log("로그인 버튼 눌림")
    try {
      const token = await login()
      setResult(JSON.stringify(token))
      if (result != null) {
        console.log("로그인 토큰 :: ", result)
        setAuth(true)
        //navigation.navigate("")
        getProfile()
      }
    } catch (err) {
      console.error("로그인 오류", err)
    }
  }

  /**
   * 사용자의 카카오 계정 정보를 받아오는 함수입니다.
   * 프로필 토큰을 JSON 형식으로 변환 후 닉네임과 이메일을 추출합니다.
   */
  const getProfile = async () => {
    console.log("사용자 프로필 조회 시도")
    try {
      const profile = await getKakaoProfile()
      setProfile(JSON.stringify(profile))
      console.log("프로필 토큰 :: ", profile)
      setName(profile.nickname)
      setEmail(profile.email)
    } catch (err) {
      console.error("프로필 조회 오류", err)
    }
  }

  return (
    <SafeAreaView style={containers.container}>

      <View style={containers.top}>
        <Text>카카오 로그인 화면입니다.</Text>
        <Text>---로고 이미지 추가 예정---</Text>
      </View>

      <View style={containers.middle}>
        <TouchableOpacity onPress={signInWithKakao}>
          <Image source={require("../images/kakao_login_medium_wide.png")} />
        </TouchableOpacity>
      </View>

      <View style={containers.bottom}>
        {
          result ? (
            <View>
              <Text>닉네임</Text>
              <Text>{name}</Text>
              <Text>이메일</Text>
              <Text>{email}</Text>
=======
    const navigation = useNavigation();

    const goToRecord = () => {
        navigation.navigate("Record");
      };

    const goToSave = () => {
        navigation.navigate("Save");
      };

    return (
        <SafeAreaView>
            <View>
                <Text>카카오 로그인 화면입니다.</Text>
                <Button title="녹화" onPress={goToRecord} />
                <Button title="저장" onPress={goToSave} />
>>>>>>> Suji
            </View>
          ) : (
            <Text>로그인 정보가 없습니다.</Text>
          )
        }
        <TouchableOpacity onPress={() => navigation.navigate("설정화면")}>
          <Text>앱 설정화면으로 가기(뒤에 UI 다 만들어지면 거기로 옮길거야)</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

export default KakaoLoginScreen

const containers = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  top: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
  middle: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
  bottom: {
    flex: 1,
    alignItems: "center",
    padding: 10
  }
})