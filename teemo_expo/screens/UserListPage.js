import { useState } from "react"
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native"
import { useNavigation } from "@react-navigation/native"

const UserListPage = () => {
    const [showModal, setShowModal] = useState(false)

    const navigation = useNavigation()

    const addUserHandler = () => {

    }

    const startHandler = () => {
        setShowModal(true)
    }

    const takePicture = () => {
        console.log("사진찍으러가기")
        navigation.navigate("TakePicturePage")
        setShowModal(false)
    }

    const recordVideo = () => {
        console.log("영상찍으러가기")
        navigation.navigate("TakePicturePage")
        setShowModal(false)
    }

    return (
        <SafeAreaView style={containers.container}>
            <View style={containers.top}>
                <Text style={texts.title}>사용자 리스트</Text>
            </View>

            <View style={containers.middle}>
                <ScrollView>
                    <View>

                    </View>
                </ScrollView>
                <View style={containers.addButtonContainer}>
                    <TouchableOpacity
                        onPress={addUserHandler}
                        hitSlop={10}
                        activeOpacity={0.6}
                    >
                        <Text style={texts.addButton}>➕</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={containers.bottom}>
                <TouchableOpacity onPress={startHandler} activeOpacity={0.6}>
                    <Text style={texts.startButton}>시작하기</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showModal} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <View style={modal.modalContainer}>
                        <View style={modal.modalContent}>
                            <TouchableOpacity style={modal.optionButton} onPress={takePicture} activeOpacity={0.6}>
                                <Text style={modal.text}>📷 사진 촬영 하기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={modal.optionButton} onPress={recordVideo} activeOpacity={0.6}>
                                <Text style={modal.text}>🎥 영상 녹화 하기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={modal.closeButton} onPress={() => setShowModal(false)} activeOpacity={0.6}>
                                <Text style={modal.closeButtonText}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    )
}

export default UserListPage

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
        bottom: 30,
        right: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        padding: 10,
        backgroundColor: "#C5C5C580",
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
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 10
    },
    optionButton: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#333333"
    },
    closeButton: {
        marginTop: 10,
        padding: 15,
        backgroundColor: "#33333380",
        borderRadius: 5,
        alignItems: "center"
    },
    text: {
        fontSize: 21
    },
    closeButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 18
    }
}) 