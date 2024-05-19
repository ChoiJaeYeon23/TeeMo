import { useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const SignUpScreen = () => {
    const navigation = useNavigation();

    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const [availableIDText, setAvailableIDText] = useState("아이디 중복 여부를 확인해주세요.");
    const [availableIDColor, setAvailableIDColor] = useState("#555555");

    const keyboardOff = () => {
        Keyboard.dismiss();
    };

    const clearInput = (inputType) => {
        switch (inputType) {
            case "id":
                setId("");
                break;
            case "password":
                setPassword("");
                break;
        }
    };

    const clearAll = () => {
        setId("");
        setPassword("");
    };

    const validateId = (text) => /^[a-zA-Z0-9]+$/.test(text);
    const validatePassword = (text) => /^[a-zA-Z0-9~!@#$%^&*]+$/.test(text);

    const checkID = () => {
        if (id === "") {
            Alert.alert("아이디를 먼저 입력해주세요.");
            return;
        }

        return new Promise((resolve, reject) => {
            fetch("http://13.209.77.184:5001/api/check_id", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.isDuplicate) {
                        setAvailableIDText("이미 사용 중인 아이디입니다.");
                        setAvailableIDColor("#DB0000");
                        reject(new Error("이미 사용 중인 아이디입니다."));
                    } else {
                        setAvailableIDText("사용 가능한 아이디입니다.");
                        setAvailableIDColor("#000AC9");
                        resolve();
                    }
                })
                .catch((error) => {
                    alert("아이디 중복 확인 중 오류가 발생했습니다.");
                    reject(new Error("아이디 중복 확인 중 오류가 발생했습니다"));
                });
        });
    };

    const signupButtonHandler = () => {
        if (id === "") {
            Alert.alert("아이디를 입력하세요.");
        } else if (password === "") {
            Alert.alert("비밀번호를 입력하세요.");
        } else if (!validateId(id)) {
            Alert.alert("아이디를 영어 또는 숫자로만 입력하세요.");
        } else if (!validatePassword(password)) {
            Alert.alert("비밀번호를 영어, 숫자, 특수문자(~!@#$%^&*)로만 입력하세요.");
        } else {
            console.log(
                "회원가입 입력 정보 :::",
                "아이디:", id,
                "비밀번호:", password
            );

            const userData = {
                id: id,
                pw: password
            };

            fetch("http://13.209.77.184:5001/api/sign_up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((data) => {
                            throw new Error(data.message || '회원가입 실패');
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    alert(data.message); // 회원가입 성공 알림
                    console.log("회원가입 성공함 (DB 서버)");
                    clearAll();
                    navigation.navigate("SignInScreen"); // 로그인 화면으로 이동
                })
                .catch((error) => {
                    alert("회원가입 실패: " + error.message);
                });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <SafeAreaView style={styles.container}>
                <View style={styles.inputContainer}>
                    <View style={{ flexDirection: "row" }}>
                        <TextInput
                            value={id}
                            onChangeText={setId}
                            placeholder="  아이디"
                            style={styles.idInput}
                            returnKeyType="next"
                            onSubmitEditing={() => { passwordInput.focus() }}
                            onFocus={() => clearInput("id")}
                        />
                        <TouchableOpacity onPress={() => checkID()} style={styles.checkContainer}>
                            <Text style={styles.text}>확인</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 16, color: availableIDColor, paddingTop: 3, paddingBottom: 10 }}>
                        {availableIDText}
                    </Text>

                    <TextInput
                        ref={(input) => { passwordInput = input }}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="  비밀번호"
                        secureTextEntry={true}
                        style={styles.input}
                        returnKeyType="done"
                        onFocus={() => clearInput("password")}
                    />

                    <TouchableOpacity onPress={signupButtonHandler} style={styles.signupContainer} activeOpacity={0.9}>
                        <Text style={styles.text}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default SignUpScreen;

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
    checkContainer: {
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
});
