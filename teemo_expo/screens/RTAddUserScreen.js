import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
    FlatList,
    Animated,
    Modal
} from 'react-native'
import CustomProgressBar from "./CustomProgressBar"
import { Ubuntu_Server } from '@env' // 환경 변수 import

/**
 * Real Time
 * 실시간 인물 추가 화면입니다.
 */
const RTAddUserScreen = ({ navigation }) => {
    const [id, setId] = useState('');
    const [userList, setUserList] = useState([]); // ui 확인용 배열
    const currentStep = 2

    const [modalVisible, setModalVisible] = useState(false)
    // ui 확인용 임시 uri
    const [selectedImageUri, setSelectedImageUri] = useState("")

    const [isPressed, setIsPressed] = useState(new Array(userList.length).fill(false))
    const scaleValues = useRef(userList.map(() => new Animated.Value(1))).current

    const keyboardOff = () => {
        Keyboard.dismiss()
    }

    const goBack = () => {
        navigation.goBack()
    }

    const fetchUserImage = async (userId) => {
        try {
            const response = await fetch(`${Ubuntu_Server}/api/get_user_image`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: userId }),
            });

            if (!response.ok) {
                throw new Error(`이미지를 찾을 수 없습니다. (ID: ${userId})`);
            }

            const imageBlob = await response.blob();
            const reader = new FileReader();

            reader.onload = () => {
                const imageUrl = reader.result;
                setUserList((prevList) => [...prevList, { id: userId, imageUrl }]);
            };

            reader.readAsDataURL(imageBlob); // Blob을 base64 문자열로 변환하여 읽음
        } catch (error) {
            console.error(`에러 발생: ${error.message}`);
            Alert.alert("에러 발생", error.message);
        }
    };


    const addUser = async () => {
        if (!id) {
            Alert.alert("아이디를 입력하세요.");
            return;
        }

        try {
            // 사용자 정보 및 이미지를 불러오고 리스트에 추가합니다.
            await fetchUserImage(id);
            setId(''); // 입력 필드 초기화
        } catch (error) {
            console.error(`에러 발생: ${error.message}`);
            Alert.alert("에러 발생", error.message);
        }
    };

    const handleStart = () => {
        navigation.navigate('RealTimeMosaic', { userList });
    };

    const deleteUserHandler = (position) => {
        const deleteUser = () => {
            const newUsersArr = userList.filter((num, index) => {
                return position != index
            })
            setUserList(newUsersArr)
        }

        Alert.alert(
            "사용자 삭제",
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

    useEffect(() => {
        // 배열의 길이가 변경될 때마다 scaleValues 업데이트
        scaleValues.push(new Animated.Value(1))
    }, [userList.length])

    /**
     * 아이템을 눌렀을 때 onPressIn 애니메이션
     */
    const startUserItemPressAnimation = (index) => {
        setIsPressed((prevState) => {
            const newState = [...prevState]
            newState[index] = true
            return newState
        })

        Animated.timing(scaleValues[index], {
            toValue: 0.93,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    /**
     * 아이템을 눌렀을 때 onPressOut 애니메이션
     */
    const endUserItemPressAnimation = (index) => {
        setIsPressed((prevState) => {
            const newState = [...prevState]
            newState[index] = false
            return newState
        })

        Animated.timing(scaleValues[index], {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const openModal = (imageUrl) => {
        setSelectedImageUri(imageUrl)
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
    }

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <SafeAreaView style={styles.container}>

                <View style={styles.progressbarWrapper}>
                    <CustomProgressBar currentStep={currentStep} />
                </View>

                <View style={styles.headerContainer}>
                    <Text style={styles.titleText}>인물 추가</Text>
                </View>

                <View style={styles.exContainer}>
                    <View style={styles.imageContainer}>
                        <FlatList
                            data={userList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={styles.itemContainer}>
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        style={[styles.userItem, { transform: [{ scale: scaleValues[index] }] }]}
                                        onPressIn={() => startUserItemPressAnimation(index)}
                                        onPressOut={() => endUserItemPressAnimation(index)}
                                        onPress={() => [openModal(item.imageUrl)]}
                                    >
                                        <Text style={styles.userId}>{"닉네임 ( "}{item.id}{" )"}</Text>
                                        {/* <Image source={{ uri: imageUrl }} style={styles.image} /> */}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.delButton}
                                        onPress={() => deleteUserHandler(index)}
                                        activeOpacity={1}
                                    >
                                        <Text style={styles.delText}>삭제</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            contentContainerStyle={styles.flatListContainer}
                        />
                    </View>
                </View>

                <View style={styles.inputContanier}>
                    <TextInput
                        value={id}
                        onChangeText={setId}
                        placeholder="사용자 ID"
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={addUser} style={styles.addButton} activeOpacity={1}>
                        <Text style={styles.buttonText}>추가</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.guideText}>모자이크 하지 않을 사용자를 추가해주세요.</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={goBack} style={styles.backButton} activeOpacity={1}>
                        <Text style={styles.back}>이전 단계</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleStart} style={styles.nextButton} activeOpacity={1}>
                        <Text style={styles.next}>다음 단계</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                >
                    <TouchableWithoutFeedback onPress={closeModal}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalImageContainer}>
                                <Image
                                    source={{ uri: selectedImageUri }}
                                    style={styles.image}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default RTAddUserScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    progressbarWrapper: {
        width: "100%",
        height: "8%",
        alignItems: "center",
        justifyContent: "center",
    },
    headerContainer: {
        width: "100%",
        height: "15%",
        justifyContent: "center",
    },
    exContainer: {
        width: "95%",
        height: "40%",
        paddingHorizontal: "3%",
        paddingBottom: "3%",
        marginTop: "3%",
        backgroundColor: "#e5e5e5"
    },
    flatListContainer: {
        width: "100%",
        height: "100%"
    },
    inputContanier: {
        width: "90%",
        height: "10%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    buttonContainer: {
        width: "90%",
        height: "16%",
        flexDirection: "row",
        paddingHorizontal: "1%",
        marginTop: "8%",
        justifyContent: "space-around"
    },
    titleText: {
        fontSize: "30%",
        fontWeight: "900",
        color: "#66CDAA",
        marginLeft: "7%"
    },
    guideText: {
        fontSize: "17%",
        color: "#66CDAA"
    },
    input: {
        fontSize: "18%",
        width: "80%",
        height: "55%",
        paddingHorizontal: "4%",
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 1 }, // 그림자 오프셋
        shadowOpacity: 0.2, // 그림자 투명도
        shadowRadius: 1, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    buttonText: {
        fontSize: "20%",
        color: "#FFFFFF",
        fontWeight: "600"
    },
    addButton: {
        width: "13%",
        height: "55%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#66CDAA",
        marginLeft: "3%",
        borderRadius: 10,
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 1 }, // 그림자 오프셋
        shadowOpacity: 0.2, // 그림자 투명도
        shadowRadius: 1, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    backButton: {
        width: "46%",
        height: "40%",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    nextButton: {
        width: "46%",
        height: "40%",
        backgroundColor: "#66CDAA",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    back: {
        fontSize: "18%",
        color: "#66CDAA",
        fontWeight: "bold"
    },
    next: {
        fontSize: "18%",
        color: "#FFFFFF",
        fontWeight: "bold"
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    userItem: {
        width: "80%",
        backgroundColor: "#FFFFFF",
        paddingVertical: "4%",
        paddingHorizontal: "5%",
        marginTop: "3%",
        marginRight: "3%",
        borderRadius: 10
    },
    userId: {
        fontSize: "18%",
        fontWeight: "600",
        color: "#888888"
    },
    delButton: {
        marginTop: "3%",
        paddingVertical: "4%",
        paddingHorizontal: "3%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        backgroundColor: "#E84A4A"
    },
    delText: {
        fontSize: "18%",
        fontWeight: "600",
        color: "#FFFFFF"
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#00000030",
        alignItems: "center",
        justifyContent: "center"
    },
    modalImageContainer: {
        width: "70%",
        height: "40%"
    },
    image: {
        width: "100%",
        height: "100%"
    }
})