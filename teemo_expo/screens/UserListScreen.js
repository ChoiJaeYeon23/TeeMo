import { useRef, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    Alert,
    Animated
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Entypo } from "@expo/vector-icons"
import UserList from "../src/UserList"

/**
 * 모자이크 처리를 하지 않을 인물들의 리스트를 출력하는 페이지입니다.
 * 
 * AllowedListScreen or PermittedListScreen or NoMosaicListScreen
 * ... 중 하나로 바꿔야하지 않을까
 * 
 */
const AnimatedEntypo = Animated.createAnimatedComponent(Entypo)

const UserListScreen = () => {
    const [showModal, setShowModal] = useState(false)
    const [showInputModal, setShowInputModal] = useState(false)
    const [inputName, setInputName] = useState("")
    // UI 확인용 배열 입니다. 완성되면 useState([])으로 초기화하기!!!
    const [userList, setUserList] = useState(["최재연", "김지연", "김하늘", "민수지"])

    const [isPressed, setIsPressed] = useState(false)
    const scaleValue = useRef(new Animated.Value(1)).current

    const navigation = useNavigation()

    const addButtonHandler = () => {
        setShowInputModal(true)
    }

    const addUserHandler = (newUser) => {
        setUserList([...userList, newUser])
        console.log("현재 리스트:", userList)
    }

    const deleteUserHandler = (position) => {
        const deleteUser = () => {
            const newUsersArr = userList.filter((num, index) => {
                return position != index
            })
            setUserList(newUsersArr)
        }

        Alert.alert("사용자 삭제",
            "모자이크를 제외할 사용자가 삭제됩니다.\n이 작업을 실행하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                    onPress: () => console.log("사용자 삭제 취소")
                },
                {
                    text: "삭제하기",
                    onPress: () => deleteUser()
                }
            ]
        )
    }

    const startPressAnimation = () => {
        setIsPressed(true)
        Animated.timing(scaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endPressAnimation = () => {
        setIsPressed(false)
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const changeInputName = (text) => {
        setInputName(text)
    }

    const addUser = () => {
        if (inputName != "") {
            console.log("추가할 사용자 이름1:", inputName)
            setShowInputModal(false)
            navigation.navigate("FaceRecognitionScreen", { userName: inputName, addUserHandler: addUserHandler })
            setInputName("")
        } else {
            Alert.alert("추가할 사용자 이름을 한 글자 이상 입력해주세요")
        }
    }

    const startHandler = () => {
        setShowModal(true)
    }

    const takePicture = () => {
        console.log("사진찍으러가기")
        navigation.navigate("TakePictureScreen")
        setShowModal(false)
    }

    const recordVideo = () => {
        console.log("영상찍으러가기")
        navigation.navigate("RecordScreen")
        setShowModal(false)
    }

    return (
        <SafeAreaView style={containers.container}>
            <View style={containers.top}>
                <Text style={texts.title}>사용자 리스트</Text>
            </View>

            <View style={containers.middle}>
                <ScrollView>
                    <View style={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 20,
                        paddingHorizontal: 30,
                    }}>
                        <UserList user={userList} deleteUser={deleteUserHandler} />
                    </View>
                </ScrollView>
                <View style={containers.addButtonContainer}>
                    <TouchableOpacity
                        onPress={() => addButtonHandler()}
                        onPressIn={() => startPressAnimation()}
                        onPressOut={() => endPressAnimation()}
                        hitSlop={10}
                        activeOpacity={1}
                        style={containers.shadow}
                    >
                        <AnimatedEntypo
                            name="circle-with-plus"
                            size={50}
                            color="#999999"
                            style={{ transform: [{ scale: scaleValue }] }}
                        />
                        {/* <Entypo name="circle-with-plus" size={50} color="#999999" /> */}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={containers.bottom}>
                <TouchableOpacity onPress={startHandler} activeOpacity={0.6}>
                    <Text style={texts.startButton}>시작하기</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showInputModal} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowInputModal(false)}>
                    <View style={modal.modalContainer}>
                        <View style={modal.modalContent}>
                            <TextInput
                                style={modal.input}
                                placeholder="  이름을 입력하세요"
                                placeholderTextColor="#AAAAAA"
                                value={inputName}
                                onChangeText={changeInputName}
                            />
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                                <TouchableOpacity style={{ flex: 1, marginLeft: 10, height: 40, backgroundColor: "blue", alignItems: "center", justifyContent: "center" }} onPress={() => [setShowInputModal(false), setInputName("")]}>
                                    <View style={{}}>
                                        <Text style={modal.text}>닫기</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1, marginRight: 10, height: 40, backgroundColor: "red", alignItems: "center", justifyContent: "center" }} onPress={() => addUser()} hitSlop={10} >
                                    <Text style={modal.text}>확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal visible={showModal} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <View style={modal.modalContainer}>
                        <View style={modal.modalContent}>
                            <TouchableOpacity style={modal.optionButton} onPress={() => takePicture()} activeOpacity={0.6}>
                                <Text style={modal.text}>{"  📷 사진 촬영 하기"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={modal.optionButton} onPress={() => recordVideo()} activeOpacity={0.6}>
                                <Text style={modal.text}>{"  🎥 영상 녹화 하기"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={modal.closeButton} onPress={() => setShowModal(false)} activeOpacity={1} >
                                <Text style={modal.closeButtonText}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    )
}

export default UserListScreen

const containers = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        padding: 10,
        alignItems: "center",
    },
    top: {
        height: "8%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    middle: {
        height: "84%",
        width: "100%",
        backgroundColor: "#C5C5C530",
        elevation: 5
    },
    bottom: {
        height: "8%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    user: {

    },
    list: {

    },
    delButtonContainer: {

    },
    addButtonContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        padding: 10,
    },
    shadow: {
        shadowColor: "#333333",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.2,
        shadowRadius: 3
    }
})

const texts = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#333333",
    },
    userName: {

    },
    delButton: {
        fontSize: 20,
        color: "#333333"
    },
    addButton: {
        fontSize: 30,
        color: "#333333",
    },
    startButton: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#333333",
    }
})

const modal = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalContent: {
        width: "60%",
        backgroundColor: "#FFF",
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 25
    },
    input: {
        borderWidth: 1,
        borderRadius: 20,
        color: "#555555",
        padding: 10,
        fontSize: 20,
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 25
    },
    optionButton: {
        padding: 15,
        backgroundColor: "#BBBBBB80",
        borderRadius: 25,
        margin: 10
    },
    closeButton: {
        marginTop: 20,
        marginHorizontal: 10,
        padding: 15,
        backgroundColor: "#333333bb",
        borderRadius: 20,
        alignItems: "center"
    },
    text: {
        fontSize: 21,
        color: "#333333bb",
        fontWeight: "bold"
    },
    closeButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 21
    }
}) 