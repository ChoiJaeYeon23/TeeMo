import { useEffect, useLayoutEffect, useRef, useState } from "react"
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
import { Entypo, Feather } from "@expo/vector-icons"
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

    useEffect(() => {
        setUser()
    }, [])

    /**
     * 서버로부터 받아온 사용자의 리스트를 userList에 저장합니다.
     */
    const setUser = async () => {
        try {
            const response = await fetch("http://13.209.77.184/api/load_user_list");
            const data = await response.json();
            setUserList(data);  // 사용자 리스트에 저장합니다. 배열형태가 아닌 경우 배열 형태로 변환 후 저장해야함!
        } catch (error) {
            console.error("사용자 리스트 불러오기 실패:", error);
        }
    }

    const addButtonHandler = () => {
        setShowInputModal(true)
    }

    const addUserHandler = (newUser) => {
        setUserList([...userList, newUser])
        console.log([...userList, newUser])
        console.log("현재 리스트:", userList)
    }

    /**
     * userList가 변경될 때마다 서버로 포스트
     */
    useEffect(() => {
        fetch("http://13.209.77.184/api/post_user_list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userList),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("사용자 리스트 전송 완료!");
                console.log("사용자 리스트 전송 성공함(DB서버)");
            })
            .catch((error) => {
                alert("사용자 리스트 전송 실패: " + error.message);
            });
    }, [userList])

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
            if (userList.includes(inputName)) {
                Alert.alert("기존 사용자와 겹치지 않는 이름을 사용해주세요!")
            } else {
                console.log("추가할 사용자 이름1:", inputName)
                setShowInputModal(false)
                navigation.navigate("FaceRecognitionScreen", {
                    userName: inputName,
                    addUserHandler: addUserHandler
                })
            }
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
                                <TouchableOpacity style={{ flex: 1, height: 40, alignItems: "center", justifyContent: "center" }} onPress={() => [setShowInputModal(false), setInputName("")]}>
                                    <View style={{}}>
                                        <Text style={modal.text}>닫기</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1, height: 40, alignItems: "center", justifyContent: "center" }} onPress={() => addUser()} hitSlop={10} >
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
                                <Feather name="camera" size={15} color="#555555" style={{ marginHorizontal: 10 }} />
                                <Text style={modal.text}>{"사진 촬영 하기"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={modal.optionButton} onPress={() => recordVideo()} activeOpacity={0.6}>
                                <Feather name="video" size={15} color="#555555" style={{ marginHorizontal: 10 }} />
                                <Text style={modal.text}>{"영상 녹화 하기"}</Text>
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
        padding: "10%",
        alignItems: "center",
    },
    top: {
        height: "10%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "2%"
    },
    middle: {
        height: "75%",
        width: "100%",
        backgroundColor: "#C5C5C530",
        elevation: 5
    },
    bottom: {
        height: "15%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    addButtonContainer: {
        position: "absolute",
        bottom: "2%",
        right: "3%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        padding: "2%",
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
        fontSize: "30%",
        fontWeight: "bold",
        color: "#333333",
    },
    delButton: {
        fontSize: "20%",
        color: "#333333"
    },
    addButton: {
        fontSize: "30%",
        color: "#333333",
    },
    startButton: {
        fontSize: "25%",
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
        paddingVertical: "5%",
        paddingHorizontal: "3%",
        borderRadius: 25
    },
    input: {
        borderWidth: 1,
        borderColor: "#555555",
        borderRadius: 100,
        color: "#555555",
        padding: "4%",
        fontSize: "20%",
        marginHorizontal: "5%",
        marginTop: "5%",
        marginBottom: "13%"
    },
    optionButton: {
        padding: "7%",
        backgroundColor: "#CCCCCC80",
        borderRadius: 100,
        margin: "5%",
        flexDirection: "row",
        alignItems: "center"
    },
    closeButton: {
        marginTop: "10%",
        marginHorizontal: "5%",
        padding: "7%",
        backgroundColor: "#777777",
        borderRadius: 100,
        alignItems: "center"
    },
    text: {
        fontSize: "18%",
        color: "#555555",
        fontWeight: "600"
    },
    closeButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: "18%"
    }
}) 