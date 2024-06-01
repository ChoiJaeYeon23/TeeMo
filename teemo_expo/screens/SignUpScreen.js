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
import { Ubuntu_Server } from '@env'

const SignUpScreen = () => {
    const navigation = useNavigation();
    const [nickname, setNickname] = useState("")
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [availableIDText, setAvailableIDText] = useState("아이디 중복 여부를 확인해주세요.");
    const [availableIDColor, setAvailableIDColor] = useState("#AAAAAA");

    const keyboardOff = () => {
        Keyboard.dismiss();
    };

    const clearInput = (inputType) => {
        switch (inputType) {
            case "nickname":
                setNickname("")
                break
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
            fetch(`${Ubuntu_Server}/api/check_id`, {
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
            console.log(result.assets[0].uri)
        }
    };

   const signupButtonHandler = async () => {
        if (!id || !password || !nickname || !profilePic) {
            Alert.alert("모든 필드를 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append('image_uri', {
            uri: profilePic,
            type: 'image/jpeg',
            name: 'profile.jpg'
        });
        formData.append('id', id);
        formData.append('pw', password);
        formData.append('nickname', nickname);

        try {
            const response = await fetch(`${Ubuntu_Server}/api/sign_up`, {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || '회원가입 실패');
            }

            const data = await response.json();
            Alert.alert(data.message);
            console.log("회원가입 완료")
            clearAll();
            navigation.navigate("SignInScreen");

        } catch (error) {
            Alert.alert("회원가입 실패: " + error.message);
        }
    };


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
                                <SimpleLineIcons name="user" size={130} color="#fff" />
                            </View>
                        )
                    }
                    <TouchableOpacity onPress={pickImage} style={styles.addPicButton}>
                        <Text style={styles.text}>프로필 사진 추가</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.inputContainer, { marginBottom: "10%" }]}>
                    <TextInput
                        value={nickname}
                        onChangeText={setNickname}
                        placeholder="닉네임"
                        placeholderTextColor="#AAAAAA"
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() => { idInput.focus() }}
                        onFocus={() => clearInput("nickname")}
                    />
                </View>

                <View style={styles.signupContainer}>
                    <View style={styles.idInputContainer}>
                        <TextInput
                            ref={(input) => { idInput = input }}
                            value={id}
                            onChangeText={setId}
                            placeholder="아이디"
                            placeholderTextColor="#AAAAAA"
                            style={styles.idInput}
                            returnKeyType="next"
                            onSubmitEditing={() => { passwordInput.focus() }}
                            onFocus={() => clearInput("id")}
                        />

                        <TouchableOpacity onPress={checkID} style={styles.checkContainer}>
                            <Text style={{ fontSize: "16%", color: "#A0C49D" }}>확인</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: "14%", color: availableIDColor, marginBottom: "3%" }}>{availableIDText}</Text>

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
        backgroundColor: "#C4D7B2",
        marginBottom: "3%",
        shadowColor: "#A0C49D", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.6, // 그림자 투명도
        shadowRadius: 4, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    profilePic: {
        width: "100%",
        height: "100%"
    },
    signupContainer: {
        width: "100%",
        height: "50%",
        alignItems: "center",
        justifyContent: "flex-start",
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
    idInputContainer: {
        width: "80%",
        marginBottom: "3%",
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.2, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    idInput: {
        fontSize: "18%",
        width: "87%",
        color: "#444444",
        paddingVertical: "3%",
        paddingHorizontal: "5%"
    },
    checkContainer: {
        width: "13%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 1,
        paddingHorizontal: 4,
        paddingVertical: 3,
        marginRight: "10%"
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
    signupButton: {
        backgroundColor: "#A0C49D",
        padding: "4%",
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    signup: {
        fontSize: "20%",
        color: "#FFFFFF",
        fontWeight: "600"
    },
    text: {
        fontSize: "18%",
        color: "#A0C49D"
    }
});