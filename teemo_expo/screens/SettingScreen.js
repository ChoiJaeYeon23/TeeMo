import { useEffect, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Platform
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { useNavigation } from "@react-navigation/native"
import { Ubuntu_Server } from "@env"

const SettingScreen = ({ route }) => {
    const id = route.params.id
    const [nickname, setNickname] = useState("")
    const [currentPw, setCurrentPw] = useState("")
    const [newPw, setNewPw] = useState("")
    const [checkNewPw, setCheckNewPw] = useState("")
    const navigation = useNavigation()

    // db에 저장돼있는 사진들(최소 1개 이상) 불러와서 set하는 로직 필요
    const [image, setImage] = useState({
        front: "",
        top: "",
        bottom: "",
        left: "",
        right: "",
    })

    const clearAll = () => {
        setNickname("")
        setCurrentPw("")
        setNewPw("")
        setCheckNewPw("")
    }

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${Ubuntu_Server}/api/get_user_info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id
                })
            });
            const data = await response.json();
            console.log("사용자의 모든 데이터 id 기준으로 불러온", data)
            if (response.ok) {
                // 이미지 설정
                setImage({
                    front: { uri: `data:image/png;base64,${data.front_image_path}` },
                    top: { uri: `data:image/png;base64,${data.top_image_path}` },
                    bottom: { uri: `data:image/png;base64,${data.bottom_image_path}` },
                    left: { uri: `data:image/png;base64,${data.left_image_path}` },
                    right: { uri: `data:image/png;base64,${data.right_image_path}` }
                });
            } else {
                // 사용자 정보를 가져오는 데 실패한 경우에 대한 처리
                console.error('Failed to fetch user info:', data.message);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const changeNickname = async () => {
        try {
            const response = await fetch(`${Ubuntu_Server}/api/change_nickname`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    newNickname: nickname // 기존 닉네임은 입력하지 않고, 새 닉네임만 전송
                })
            });
            const data = await response.json();
            if (response.ok) {
                console.log("닉네임 변경 완료:", data.message);
                // 닉네임 변경 성공 시, 모든 입력 필드 초기화
                clearAll();
                // 홈 화면으로 이동
                
                navigation.navigate("HomeScreen", { id });
            } else {
                console.error('닉네임 변경 실패:', data.message);
            }
        } catch (error) {
            console.error('Error changing nickname:', error);
        }
    }


    const changePassword = async () => {
        // 새 비밀번호와 확인용 비밀번호가 일치하는지 확인
        if (newPw !== checkNewPw) {
            console.error('비밀번호와 확인용 비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
            return;
        }

        try {
            const response = await fetch(`${Ubuntu_Server}/api/change_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    pw: newPw // 비밀번호 변경 시, 해당 컬럼에 새 비밀번호 저장
                })
            });
            const data = await response.json();
            if (response.ok) {
                console.log("비밀번호 변경 완료:", data.message);
                // 비밀번호 변경 성공 시, 모든 입력 필드 초기화
                clearAll();
                // 로그인 화면으로 이동
                navigation.navigate("SignInScreen");
            } else {
                console.error('비밀번호 변경 실패:', data.message);
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    }


    const changeProfile = async () => {
        const formData = new FormData();
        formData.append("id", id); // id를 FormData에 추가

        Object.keys(image).forEach((key) => {
            if (image[key]) {
                const uriParts = image[key].uri.split(".");
                const fileType = uriParts[uriParts.length - 1];

                formData.append(key, {
                    uri: image[key].uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                });
            }
        });

        console.log("FormData 내용:", formData);
        try {
            const response = await fetch(`${Ubuntu_Server}/api/update_profile_images`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const responseText = await response.text(); // 응답 본문을 텍스트로 읽기
            console.log("Response Text:", responseText); // 응답 본문 출력

            const data = JSON.parse(responseText); // JSON 파싱 시도
            if (response.ok) {
                console.log("사진 업로드 성공:", data.message);
                // 모든 입력 필드 초기화
                clearAll();
                // 홈 화면으로 이동
                navigation.navigate("HomeScreen", { id });
            } else {
                console.error('사진 업로드 실패:', data.message);
            }
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    }


    const pickImage = async (text) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permissionResult.granted) {
            Alert.alert("권한 필요", "갤러리에 접근하기 위한 권한이 필요합니다.")
            return
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 1,
            exif: false
        })

        if (!result.canceled) {
            console.log(result.assets[0].uri)
            const source = { uri: result.assets[0].uri };
            setImage({ ...image, [text]: source })
        }
    }


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>회원 정보 수정</Text>
                </View>

                <View style={styles.mainContainer}>
                    <KeyboardAvoidingView
                        style={styles.nnSection}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                    >
                        <Text style={styles.sectionTitle}>닉네임 변경</Text>

                        <TextInput
                            value={nickname}
                            onChangeText={setNickname}
                            placeholder="새 닉네임"
                            style={styles.input}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={changeNickname} style={styles.button}>
                                <Text style={styles.buttonText}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>

                    <View style={styles.line} />

                    <KeyboardAvoidingView
                        style={styles.pwSection}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                    >
                        <Text style={styles.sectionTitle}>비밀번호 변경</Text>

                        <TextInput
                            value={newPw}
                            onChangeText={setNewPw}
                            placeholder="새 비밀번호"
                            style={styles.input}
                        />

                        <TextInput
                            value={checkNewPw}
                            onChangeText={setCheckNewPw}
                            placeholder="새 비밀번호 확인"
                            style={styles.input}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={changePassword} style={styles.button}>
                                <Text style={styles.buttonText}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>

                    <View style={styles.line} />

                    <View style={styles.profileSection}>
                        <Text style={styles.sectionTitle}>프로필 사진 변경</Text>

                        <View style={styles.list}>
                            <FlatList
                                data={Object.keys(image)}
                                renderItem={({ item }) => (
                                    <View style={styles.itemContainer}>
                                        {
                                            image[item] ? (
                                                <View style={styles.imageContainer}>
                                                    <Image source={{ uri: image[item].uri }} style={styles.profileImage} />
                                                </View>
                                            ) : (
                                                <View style={styles.imageContainer} />
                                            )
                                        }
                                        <TouchableOpacity onPress={() => pickImage(item)}>
                                            <Text style={styles.itemText}>{item}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                horizontal={true}
                                keyExtractor={item => item}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={changeProfile} style={styles.button}>
                                <Text style={styles.buttonText}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default SettingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    headerContainer: {
        width: "100%",
        height: "13%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#95ce67"
    },
    mainContainer: {
        width: "100%",
        height: "85%",
    },
    profileSection: {
        width: "100%",
        height: "50%",
        padding: "5%",
        marginBottom: "2%"
    },
    nnSection: {
        width: "100%",
        height: "22%",
        padding: "5%",
        marginBottom: "2%"
    },
    pwSection: {
        width: "100%",
        height: "30%",
        padding: "5%"
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#666666"
    },
    list: {
        width: "100%",
        height: "80%",
        justifyContent: "center"
    },
    itemContainer: {
        width: 150,
        height: "100%",
        marginRight: "1%",
        alignItems: "center",
        paddingHorizontal: "3%",
        justifyContent: "center"
    },
    imageContainer: {
        width: 150,
        height: 150,
        backgroundColor: "#00000020",
        borderRadius: 100
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 100
    },
    itemText: {
        fontSize: 18,
        color: "#95ce67",
        marginTop: "5%",
        fontWeight: "500"
    },
    input: {
        fontSize: 18,
        width: "80%",
        color: "#00000090",
        padding: "3%",
        marginTop: "3%",
        borderRadius: 13,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    buttonContainer: {
        width: "100%",
        alignItems: "flex-end",
        marginTop: "3%"
    },
    button: {
        paddingVertical: "3%",
        paddingHorizontal: "5%",
        backgroundColor: "#95ce67",
        borderRadius: 13,
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF"
    },
    line: {
        marginHorizontal: "3%",
        width: "94%",
        borderWidth: 0.6,
        borderColor: "#AAAAAA"
    }
})