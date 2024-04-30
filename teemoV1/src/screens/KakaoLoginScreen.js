import React, { useState, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Keyboard, Alert, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { login, getProfile as getKakaoProfile } from "@react-native-seoul/kakao-login";

const KakaoLoginScreen = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [auth, setAuth] = useState(false);
  const [profile, setProfile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const passwordInputRef = useRef(null);
  const navigation = useNavigation();

  const keyboardOff = () => {
    Keyboard.dismiss();
  };

  const clearId = () => {
    setId("");
  };

  const clearPassword = () => {
    setPassword("");
  };

  const signInButtonHandler = () => {
    if (id === "") {
      Alert.alert("아이디를 입력하세요.");
    } else if (password === "") {
      Alert.alert("비밀번호를 입력하세요.");
    } else {
      console.log("로그인 입력 정보 ::: 아이디:", id, "비밀번호:", password);
      navigation.navigate("NavigationScreen");
      // 실제 로그인 로직 추가
    }
  };

  const signInWithKakao = async () => {
    console.log("카카오 로그인 버튼 눌림");
    try {
      const token = await login();
      setResult(JSON.stringify(token));
      if (result != null) {
        console.log("로그인 토큰 :: ", result);
        setAuth(true);
        navigation.navigate("권한화면");
        getProfile();
      }
    } catch (err) {
      console.error("카카오 로그인 오류", err);
    }
  };

  const getProfile = async () => {
    console.log("사용자 프로필 조회 시도");
    try {
      const profile = await getKakaoProfile();
      setProfile(JSON.stringify(profile));
      console.log("프로필 토큰 :: ", profile);
      setName(profile.nickname);
      setEmail(profile.email);
    } catch (err) {
      console.error("프로필 조회 오류", err);
    }
  };

  const goToSignUpScreen = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={keyboardOff}>
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Image source={require("../images/app_logo.png")} style={styles.logo} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={id}
              onChangeText={setId}
              placeholder="  아이디"
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current.focus()}
              onFocus={() => clearId()}
            />
            <TextInput
              ref={passwordInputRef}
              value={password}
              onChangeText={setPassword}
              placeholder="  비밀번호"
              secureTextEntry={true}
              style={styles.input}
              returnKeyType="done"
              onFocus={() => clearPassword()}
            />

            <TouchableOpacity onPress={signInButtonHandler} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToSignUpScreen} style={styles.signupContainer}>
              <Text style={styles.signupText}>회원가입</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signInWithKakao} style={styles.kakaoButtonContainer}>
              <Image source={require("../images/kakao_login_medium_wid.png")} style={styles.kakaoButton} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    width: "80%",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 250,
    height: 250,
  },
  inputContainer: {
    alignItems: "center",
  },
  input: {
    fontSize: 20,
    color: "#444444",
    width: "100%",
    borderWidth: 1,
    borderColor: "#33333340",
    padding: 10,
    marginBottom: 20,
    borderRadius: 20,
  },
  buttonContainer: {
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  kakaoButtonContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  kakaoButton: {
    width: 50,
    height: 50, 
  },
  signupContainer: {
    padding: 5,
  },
  signupText: {
    fontSize: 16,
    color: "#444444",
    marginBottom: 20,
  },
});

export default KakaoLoginScreen;
