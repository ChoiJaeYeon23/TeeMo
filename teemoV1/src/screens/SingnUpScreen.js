import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SignUpScreen = () => {
    const navigation = useNavigation();

    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleGoBack = () => {
        navigation.goBack(); // 뒤로가기 기능
    };

    const keyboardOff = () => {
        Keyboard.dismiss();
    };

    const clearInput = (inputType) => {
        switch (inputType) {
            case "name":
                setName("");
                break;
            case "id":
                setId("");
                break;
            case "password":
                setPassword("");
                break;
            case "confirmPassword":
                setConfirmPassword("");
                break;
            case "phoneNumber":
                setPhoneNumber("");
                break;
        }
    };

    const validateName = (text) => {
        const regex = /^[가-힣a-zA-Z]+$/;
        return regex.test(text);
    };

    const validateId = (text) => {
        const regex = /^[a-zA-Z0-9]+$/;
        return regex.test(text);
    };

    const validatePassword = (text) => {
        const regex = /^[a-zA-Z0-9~!@#$%^&*]+$/;
        return regex.test(text);
    };

    const validatePhoneNumber = (text) => {
        return text.length === 11;
    };

    const signupButtonHandler = () => {
        if (name === "") {
            Alert.alert("이름을 입력하세요.");
        } else if (id === "") {
            Alert.alert("아이디를 입력하세요.");
        } else if (password === "") {
            Alert.alert("비밀번호를 입력하세요.");
        } else if (!validateName(name)) {
            Alert.alert("이름을 한글 또는 영어로만 입력하세요.");
        } else if (!validateId(id)) {
            Alert.alert("아이디를 영어 또는 숫자로만 입력하세요.");
        } else if (!validatePassword(password)) {
            Alert.alert("비밀번호를 영어, 숫자, 특수문자(~!@#$%^&*)로만 입력하세요.");
        } else if (password !== confirmPassword && confirmPassword === "") {
            Alert.alert("비밀번호가 일치하지 않습니다.");
        } else if (!validatePhoneNumber(phoneNumber) && phoneNumber === "") {
            Alert.alert("올바른 전화번호를 입력하세요.");
        } else {
            console.log(
                "회원가입 입력 정보 :::",
                "이름:", name,
                "아이디:", id,
                "비밀번호:", password,
                "비밀번호 확인:", confirmPassword,
                "전화번호:", phoneNumber
            );
            navigation.navigate("NavigationScreen");
            // 회원가입 로직 추가
        }
    };

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{'←'}</Text>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="  이름"
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() => { idInput.focus(); }}
                        onFocus={() => clearInput("name")}
                    />

                    <TextInput
                        ref={(input) => { idInput = input; }}
                        value={id}
                        onChangeText={setId}
                        placeholder="  아이디"
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() => { passwordInput.focus(); }}
                        onFocus={() => clearInput("id")}
                    />

                    <TextInput
                        ref={(input) => { passwordInput = input; }}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="  비밀번호"
                        secureTextEntry={true}
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() => { confirmPasswordInput.focus(); }}
                        onFocus={() => clearInput("password")}
                    />

                    <TextInput
                        ref={(input) => { confirmPasswordInput = input; }}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="  비밀번호 확인"
                        secureTextEntry={true}
                        style={styles.input}
                        onSubmitEditing={() => { phoneNumberInput.focus(); }}
                        onFocus={() => clearInput("confirmPassword")}
                    />

                    <TextInput
                        ref={(input) => { phoneNumberInput = input; }}
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
                        <Text style={styles.signup}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

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
    input: {
        fontSize: 20,
        color: "#444444",
        width: "50%",
        borderWidth: 1,
        borderColor: "#33333340",
        padding: 10,
        marginBottom: 20,
        borderRadius: 20
    },
    signupContainer: {
        backgroundColor: "#000000",
        padding: 10,
        borderRadius: 20,
        width: "50%",
        alignItems: "center",
        marginBottom: 5
    },
    signup: {
        fontSize: 20,
        color: "#FFFFFF"
    },
    backButton: {
        position: "absolute",
        top: 0,
        left: 0,
        padding: 10,
        zIndex: 1
    },
    backButtonText: {
        fontSize: 30,
        color: "#000000"
    }
});

export default SignUpScreen;
