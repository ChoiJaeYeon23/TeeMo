import { useState } from "react"
import { SafeAreaView, View, Text, TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet, TextInput, Keyboard, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ubuntu_Server } from '@env'
import LoadingModal from "./LoadingModal"

/**
 * 로그인 화면 입니다.
 * 사용자가 입력할 로그인 정보 입력값은 {아이디}, {비밀번호} 입니다.
 */
const SignInScreen = () => {
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(false)
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
        setIsLoading(true)
        console.log("ㅅㅂ?", Ubuntu_Server)
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

            const loginNow = true;

            // 서버로 로그인 요청을 보내는 함수
            fetch(`${Ubuntu_Server}/api/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((data) => {
                            throw new Error(data.message || '로그인 실패');
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    // alert(data.message); // 로그인 성공 알림
                    setIsLoading(false);
                    console.log("로그인 성공(DB 서버)");
                    clearAll();
                    navigation.navigate("HomeScreen", { id }); // 미디어 선택 화면으로 이동
                })
                .catch((error) => {
                    setIsLoading(false);
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

                <View style={styles.signinContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={id}
                            onChangeText={setId}
                            placeholder="아이디"
                            style={styles.input}
                            placeholderTextColor="#AAAAAA"
                            returnKeyType="next"
                            onSubmitEditing={() => { passwordInput.focus() }}
                            onFocus={() => clearId()}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={(input) => { passwordInput = input }}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="비밀번호"
                            placeholderTextColor="#AAAAAA"
                            secureTextEntry={true}
                            style={styles.input}
                            returnKeyType="done"
                            onFocus={() => clearPassword()}
                        />
                    </View>

                    <TouchableOpacity onPress={signInButtonHandler} style={styles.signinButton} activeOpacity={0.9}>
                        <Text style={styles.signin}>로그인</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={signUpButtonHandler} style={styles.signupButton} activeOpacity={0.9}>
                        <Text style={styles.signup}>회원가입</Text>
                    </TouchableOpacity>

                </View>

                <LoadingModal visible={isLoading} />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default SignInScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around"
    },
    logoContainer: {
        width: "100%",
        height: "50%",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: "10%"
    },
    logo: {
        width: "40%",
        height: "40%"
    },
    signinContainer: {
        width: "100%",
        height: "50%",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    inputContainer: {
        width: "80%",
        marginBottom: "3%",
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.2, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    input: {
        fontSize: "18%",
        width: "100%",
        color: "#444444",
        paddingVertical: "3%",
        paddingHorizontal: "5%",
        borderRadius: 10,
        borderColor: "#AAAAAA",
        backgroundColor: "#fff"
    },
    signinButton: {
        backgroundColor: "#95ce67",
        padding: "4%",
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
        marginBottom: "1.5%",
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    signin: {
        fontSize: "20%",
        color: "#FFFFFF",
        fontWeight: "600"
    },
    signupButton: {
        padding: "1%"
    },
    signup: {
        fontSize: "17%",
        color: "#95ce67",
        fontWeight: "500"
    }
})