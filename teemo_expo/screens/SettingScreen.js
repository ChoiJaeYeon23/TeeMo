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

// 
const SettingScreen = ({ route }) => {
    // const id = route.params.id
    const [nickname, setNickname] = useState("")
    const [currentPw, setCurrentPw] = useState("")
    const [newPw, setNewPw] = useState("")
    const [checkNewPw, setCheckNewPw] = useState("")
    const navigation = useNavigation()

    // db에 저장돼있는 사진들(최소 1개 이상) 불러와서 set하는 로직 필요
    const [image, setImage] = useState({
        정면: "",
        상: "",
        하: "",
        좌: "",
        우: "",
    })

    const clearAll = () => {
        setNickname("")
        setCurrentPw("")
        setNewPw("")
        setCheckNewPw("")
    }

    const changeNickname = () => {
        // 닉네임 변경 성공시 모든 textinput 초기화하고
        clearAll()
        // 이후 화면 전환
        navigation.navigate("HomeScreen")
    }

    const changePassword = () => {
        // 비밀번호 변경 성공시 모든 textinput 초기화하고
        clearAll()
        // 이후 화면 전환
        navigation.navigate("HomeScreen")
    }

    const changeProfile = () => {
        // 프로필사진 변경 성공시 모든 textinput 초기화하고
        clearAll()
        // 이후 화면 전환
        navigation.navigate("HomeScreen")
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
                            <TouchableOpacity style={styles.button}>
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
                            <TouchableOpacity style={styles.button}>
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
                                                    <Image source={image[item]} style={styles.profileImage} />
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
                            <TouchableOpacity style={styles.button}>
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
        color: "#66CDAA"
    },
    mainContainer: {
        width: "100%",
        height: "85%",
    },
    profileSection: {
        width: "100%",
        height: "45%",
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
        justifyContent: "center",
    },
    itemContainer: {
        width: 150,
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
        color: "#333",
        marginTop: "5%"
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
        backgroundColor: "#66CDAA",
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