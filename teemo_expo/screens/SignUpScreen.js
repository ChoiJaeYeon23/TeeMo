import { useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    Dimensions
} from "react-native"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

/**
 * 회원가입 화면입니다.
 * 사용자가 입력할 회원가입 정보 입력값은 {이름}, {아이디}, {비밀번호}, {비밀번호 확인}, {전화번호} 입니다.
 */
const SignUpScreen = () => {
    const navigation = useNavigation()

    const [name, setName] = useState("")
    const [id, setId] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

    const [availableID_text, setAvailableID_text] = useState("아이디 중복 여부를 확인해주세요.")
    const [availableID_color, setAvailableID_color] = useState("#555555")

    // 키보드를 종료합니다.
    const keyboardOff = () => {
        Keyboard.dismiss()
    }

    /**
     * 입력 값을 초기화합니다.
     * @param {string} inputType
     * 초기화할 입력 유형: name, id, password, confirmPassword, phoneNumber
     */
    const clearInput = (inputType) => {
        switch (inputType) {
            case "name":
                setName("")
                break
            case "id":
                setId("")
                break
            case "password":
                setPassword("")
                break
            case "confirmPassword":
                setConfirmPassword("")
                break
            case "phoneNumber":
                setPhoneNumber("")
                break
        }
    }

    // 화면 전환 시 모든 입력값을 초기화합니다.
    const clearAll = () => {
        setName("")
        setId("")
        setPassword("")
        setConfirmPassword("")
        setPhoneNumber("")
    }

    /**
     * 이름(name)이 한글 또는 영어로만 이루어져 있는지 확인합니다.
     * @returns {boolean}
     */
    const validateName = (text) => {
        const regex = /^[가-힣a-zA-Z]+$/
        return regex.test(text)
    }

    /**
     * 아이디(id)가 영어 또는 숫자로만 이루어져 있는지 확인합니다.
     * @returns {boolean}
     */
    const validateId = (text) => {
        const regex = /^[a-zA-Z0-9]+$/
        return regex.test(text)
    }

    /**
     * 비밀번호(password)가 영어, 숫자, 특수문자(~!@#$%^&*)로만 이루어져 있는지 확인합니다.
     * @returns {boolean}
     */
    const validatePassword = (text) => {
        const regex = /^[a-zA-Z0-9~!@#$%^&*]+$/
        return regex.test(text)
    }

    /**
     * 전화번호(phoneNumber)가 11자리로 이루어져 있는지 확인합니다.
     * @returns {boolean}
     */
    const validatePhoneNumber = (text) => {
        return text.length === 11
    }

    /**
     * 아이디(id) 중복 여부를 확인합니다.
     * @returns {boolean}
     */
    const checkID = () => {
        if (id === "") {
            Alert.alert("아이디를 먼저 입력해주세요.")
            return
        }

        return new Promise((resolve, reject) => {
            fetch("http://13.209.77.184/api/check-id", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.isDuplicate) {
                        // alert("이미 사용 중인 아이디입니다.");
                        setAvailableID_text("이미 사용 중인 아이디입니다.");
                        setAvailableID_color("#DB0000");
                        reject(new Error("이미 사용 중인 아이디 입니다."));
                    } else {
                        // alert("사용 가능한 아이디입니다.");
                        setAvailableID_text("사용 가능한 아이디입니다.");
                        setAvailableID_color("#000AC9");
                        resolve();
                    }
                })
                .catch((error) => {
                    alert("아이디 중복 확인 중 오류가 발생했습니다.");
                    reject(new Error("아이디 중복 확인 중 오류가 발생했습니다"));
                });
        });
    };

    /**
     * 회원가입 로직입니다.
     * 회원가입 정보의 유효성을 검사합니다.
     */
    const signupButtonHandler = () => {
        if (name === "") {
            Alert.alert("이름을 입력하세요.")
        } else if (id === "") {
            Alert.alert("아이디를 입력하세요.")
        } else if (password === "") {
            Alert.alert("비밀번호를 입력하세요.")
        } else if (!validateName(name)) {
            Alert.alert("이름을 한글 또는 영어로만 입력하세요.")
        } else if (!validateId(id)) {
            Alert.alert("아이디를 영어 또는 숫자로만 입력하세요.")
        } else if (!validatePassword(password)) {
            Alert.alert("비밀번호를 영어, 숫자, 특수문자(~!@#$%^&*)로만 입력하세요.")
        } else if (password !== confirmPassword && confirmPassword == "") {
            Alert.alert("비밀번호가 일치하지 않습니다.")
        } else if (!validatePhoneNumber(phoneNumber) && phoneNumber == "") {
            Alert.alert("올바른 전화번호를 입력하세요.")
        } else {
            console.log(
                "회원가입 입력 정보 :::",
                "이름:", name,
                "아이디:", id,
                "비밀번호:", password,
                "비밀번호 확인:", confirmPassword,
                "전화번호:", phoneNumber
            )

            const userData = {
                name: name,
                id: id,
                pw: password,
                tel: phoneNumber
            }

            // 서버로 회원가입 요청을 보냄
            fetch("http://13.209.77.184/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then((response) => response.json())
                .then((data) => {
                    alert("회원가입 완료!"); // 회원가입 성공 알림
                    console.log("회원가입성공함(DB서버)");
                    clearAll();
                    navigation.navigate("SignInScreen"); // 로그인 화면으로 이동
                })
                .catch((error) => {
                    alert("회원가입 실패: " + error.message);
                });
        }
    }

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <SafeAreaView style={styles.container}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="  이름"
                            style={styles.input}
                            returnKeyType="next"
                            onSubmitEditing={() => { idInput.focus() }}
                            onFocus={() => clearInput("name")}
                        />

                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                ref={(input) => { idInput = input }}
                                value={id}
                                onChangeText={setId}
                                placeholder="  아이디"
                                style={styles.idInput}
                                returnKeyType="next"
                                onSubmitEditing={() => { passwordInput.focus() }}
                                onFocus={() => clearInput("id")}
                            />
                            <TouchableOpacity onPress={() => checkID()} style={styles.checkContianer}>
                                <Text style={styles.text}>확인</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 16, color: availableID_color, paddingTop: 3, paddingBottom: 10 }}>
                            {
                                availableID_text
                            }
                        </Text>

                        <TextInput
                            ref={(input) => { passwordInput = input }}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="  비밀번호"
                            secureTextEntry={true}
                            style={styles.input}
                            returnKeyType="next"
                            onSubmitEditing={() => { confirmPasswordInput.focus() }}
                            onFocus={() => clearInput("password")}
                        />

                        <TextInput
                            ref={(input) => { confirmPasswordInput = input }}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="  비밀번호 확인"
                            secureTextEntry={true}
                            style={styles.input}
                            onSubmitEditing={() => { phoneNumberInput.focus() }}
                            onFocus={() => clearInput("confirmPassword")}
                        />

                        <TextInput
                            ref={(input) => { phoneNumberInput = input }}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            placeholder="  전화번호"
                            style={styles.input}
                            returnKeyType="done"
                            maxLength={11}
                            onFocus={() => clearInput("phoneNumber")}
                        />

                        <TouchableOpacity onPress={signupButtonHandler} style={styles.signupContainer} activeOpacity={0.9}>
                            <Text style={styles.text}>회원가입</Text>
                        </TouchableOpacity>
                    </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    inputContainer: {
        width: "100%",
        alignItems: "center"
    },
    idInput: {
        fontSize: 18,
        color: "#444444",
        width: "54%",
        borderWidth: 1,
        borderColor: "#33333330",
        padding: 10,
        marginBottom: 5,
        borderRadius: 25
    },
    checkContianer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#33333330",
        marginBottom: 5,
        borderRadius: 40,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginLeft: 7
    },
    input: {
        fontSize: 18,
        color: "#444444",
        width: "70%",
        borderWidth: 1,
        borderColor: "#33333330",
        padding: 10,
        marginBottom: 20,
        borderRadius: 25
    },
    signupContainer: {
        backgroundColor: "#33333330",
        padding: 10,
        borderRadius: 20,
        width: "70%",
        alignItems: "center",
        marginBottom: 5
    },
    text: {
        fontSize: 18,
        color: "#444444"
    }
})