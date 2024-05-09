import { useState } from "react"
import { SafeAreaView, View, Text, TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet, TextInput, Keyboard, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"

/**
 * 로그인 화면 입니다.
 * 사용자가 입력할 로그인 정보 입력값은 {아이디}, {비밀번호} 입니다.
 */
const SignInScreen = () => {
    const navigation = useNavigation()

    const [id, setId] = useState("")
    const [password, setPassword] = useState("")

    // 키보드를 종료합니다.
    const keyboardOff = () => {
        Keyboard.dismiss()
    }

    // 입력한 아이디를 초기화합니다.
    const clearId = () => {
        setId("")
    }

    // 입력한 비밀번호를 초기화합니다.
    const clearPassword = () => {
        setPassword("")
    }

    // 화면 전환 시 모든 입력값을 초기화합니다.
    const clearAll = () => {
        setId("")
        setPassword("")
    }

    /**
     * 로그인 로직입니다.
     */
    const signInButtonHandler = () => {
        if (id === "") {
            Alert.alert("아이디를 입력하세요.")
            return
        } else if (password === "") {
            Alert.alert("비밀번호를 입력하세요.")
            return
        } else {
            console.log(
                "로그인 입력 정보 :::",
                "아이디:", id,
                "비밀번호:", password
            )

            const userData = {
                id: id,
                pw: password
            }

            // 서버로 로그인 요청을 보내는 함수
            fetch("http://13.209.77.184/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then((response) => response.json())
                .then((data) => {
                    alert("로그인 완료!"); // 로그인 성공 알림
                    console.log("로그인성공함(DB서버)");
                    clearAll();
                    navigation.navigate("UserListScreen"); // 사용자 리스트 화면으로 이동
                })
                .catch((error) => {
                    alert("로그인 실패: " + error.message);
                });
        }
    }

    // 회원가입 화면으로 전환합니다.
    const signUpButtonHandler = () => {
        navigation.navigate("SignUpScreen")
    }

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <SafeAreaView style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../images/app_logo.png")}
                        style={styles.logo}
                    />
                </View>

                <View style={styles.inputContainer}>

                    <TextInput
                        value={id}
                        onChangeText={setId}
                        placeholder="  아이디"
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() => { passwordInput.focus() }}
                        onFocus={() => clearId()}
                    />

                    <TextInput
                        ref={(input) => { passwordInput = input }}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="  비밀번호"
                        secureTextEntry={true}
                        style={styles.input}
                        returnKeyType="done"
                        onFocus={() => clearPassword()}
                    />

                    <TouchableOpacity onPress={signInButtonHandler} style={styles.signinContainer} activeOpacity={0.9}>
                        <Text style={styles.signin}>로그인</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={signUpButtonHandler} style={styles.signupContainer} activeOpacity={0.9}>
                        <Text style={styles.signup}>회원가입</Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default SignInScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    logoContainer: {
        width: "100%",
        height: "30%",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 50
    },
    logo: {
        width: 250,
        height: 250
    },
    inputContainer: {
        width: "100%",
        height: "20%",
        alignItems: "center"
    },
    input: {
        fontSize: 18,
        color: "#444444",
        width: "50%",
        borderWidth: 1,
        borderColor: "#33333340",
        padding: 8,
        marginBottom: 10,
        borderRadius: 100
    },
    signinContainer: {
        backgroundColor: "#33333340",
        padding: 10,
        borderRadius: 100,
        width: "50%",
        alignItems: "center",
        marginBottom: 5
    },
    signin: {
        fontSize: 18,
        color: "#FFF",
        fontWeight: "600"
    },
    signupContainer: {
        padding: 5
    },
    signup: {
        fontSize: 15,
        color: "#444444"
    }
})