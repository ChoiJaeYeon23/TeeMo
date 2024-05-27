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
    Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { SimpleLineIcons } from "@expo/vector-icons"


const SignUpScreen = () => {
    const navigation = useNavigation();
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [availableIDText, setAvailableIDText] = useState("아이디 중복 여부를 확인해주세요.");
    const [availableIDColor, setAvailableIDColor] = useState("#A0C49D");

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
            fetch("http://3.34.125.163:5001/api/check_id", {
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

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("권한 필요", "갤러리에 접근하기 위한 권한이 필요합니다.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 1,
            exif: false
        });

        if (!result.canceled && result.assets) {
            setProfilePic(result.assets[0].uri)
        }
    };

    const signupButtonHandler = (assets) => {
        for (const asset of assets) {
            const formData = new FormData();
            formData.append('image_uri', {
                uri: asset.uri,
                type: 'image/jpeg',
                name: 'profile.jpg'
            });

            if (asset) {

                // 기타 사용자 데이터 추가
                formData.append('id', id);
                formData.append('pw', password);

                fetch("http://3.34.125.163:5001/api/sign_up", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: formData,
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
                        console.log("회원가입 완료 했습니다.");
                        clearAll();
                        navigation.navigate("SignInScreen"); // 로그인 화면으로 이동
                    })
                    .catch((error) => {
                        alert("회원가입 실패: " + error.message);
                    });
            }
        }
    }

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <SafeAreaView style={styles.container}>
                <View style={styles.profileContainer}>
                    {
                        profilePic ? (
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: profilePic }} style={styles.profilePic} />
                            </View>
                        ) : (
                            <View style={styles.imageContainer}>
                                <SimpleLineIcons name="user" size={130} color="#F7FFE5" />
                            </View>
                        )
                    }
                    <TouchableOpacity onPress={pickImage} style={styles.addPicButton}>
                        <Text style={styles.text}>프로필 사진 추가</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.signupContainer}>
                    <View style={styles.inputContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center", height: "50%" }}>
                            <TextInput
                                value={id}
                                onChangeText={setId}
                                placeholder={availableIDText}
                                placeholderTextColor={availableIDColor}
                                style={styles.idInput}
                                returnKeyType="next"
                                onSubmitEditing={() => { passwordInput.focus() }}
                                onFocus={() => clearInput("id")}
                            />

                            <TouchableOpacity onPress={checkID} style={styles.checkContainer}>
                                <Text style={styles.text}>확인</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.separator} />

                        <TextInput
                            ref={(input) => { passwordInput = input }}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="비밀번호"
                            placeholderTextColor="#A0C49D"
                            secureTextEntry={true}
                            style={styles.input}
                            returnKeyType="done"
                            onFocus={() => clearInput("password")}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={
                            async () => {
                                signupButtonHandler(profilePic)
                            }
                        }
                        style={styles.signupButton} activeOpacity={0.9}>
                        <Text style={styles.signup}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around"
    },
    profileContainer: {
        width: "100%",
        height: "50%",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: "10%"
    },
    imageContainer: {
        width: "60%",
        height: "60%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E1ECC8",
        marginBottom: "3%"
    },
    profilePic: {
        width: "98%",
        height: "98%"
    },
    signupContainer: {
        width: "100%",
        height: "50%",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    inputContainer: {
        width: "70%",
        height: "21%",
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: "#C4D7B2",
        marginBottom: "8%"
    },
    idInput: {
        fontSize: "18%",
        color: "#A0C49D",
        width: "86%",
        height: "100%",
        paddingHorizontal: "4%"
    },
    checkContainer: {
        width: "13%",
        height: "100%",
        justifyContent: "center",
        marginBottom: 1,
        paddingHorizontal: 4,
        paddingVertical: 3,
        marginLeft: 2
    },
    separator: {
        height: 1.8,
        width: "100%",
        backgroundColor: "#C4D7B2",
    },
    input: {
        fontSize: 18,
        color: "#444444",
        width: "100%",
        height: "50%",
        paddingHorizontal: "5%"
    },
    signupButton: {
        backgroundColor: "#A0C49D",
        padding: "3%",
        borderRadius: 15,
        width: "70%",
        alignItems: "center"
    },
    signup: {
        fontSize: "18%",
        color: "#FFFFFF",
        fontWeight: "600"
    },
    text: {
        fontSize: 18,
        color: "#A0C49D"
    }
});