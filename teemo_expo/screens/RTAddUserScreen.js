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
    Modal,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import CustomProgressBar from "./CustomProgressBar";
import { Ubuntu_Server, Local_Server } from '@env';
import LoadingModal from "./LoadingModal";

const RTAddUserScreen = ({ navigation }) => {
    const [id, setId] = useState('');
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState({});
    const [isPressed, setIsPressed] = useState(new Array(userList.length).fill(false));
    const scaleValues = useRef(userList.map(() => new Animated.Value(1))).current;
    const backScaleValue = useRef(new Animated.Value(1)).current
    const nextScaleValue = useRef(new Animated.Value(1)).current

    const startBackPressAnimation = () => {
        Animated.timing(backScaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endBackPressAnimation = () => {
        Animated.timing(backScaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const startNextPressAnimation = () => {
        Animated.timing(nextScaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endNextPressAnimation = () => {
        Animated.timing(nextScaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const keyboardOff = () => {
        Keyboard.dismiss();
    };

    const goBack = () => {
        navigation.goBack();
    };

    const fetchUserImages = async (userId) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${Ubuntu_Server}/api/get_user_images`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: userId }),
            });

            if (!response.ok) {
                setIsLoading(false);
                throw new Error(`이미지를 찾을 수 없습니다. (ID: ${userId})`);
            }

            const data = await response.json();
            setUserList((prevList) => [
                ...prevList,
                {
                    id: userId,
                    images: {
                        front: `data:image/png;base64,${data.images.front_image_path}`,
                        top: `data:image/png;base64,${data.images.top_image_path}`,
                        bottom: `data:image/png;base64,${data.images.bottom_image_path}`,
                        left: `data:image/png;base64,${data.images.left_image_path}`,
                        right: `data:image/png;base64,${data.images.right_image_path}`
                    }
                }
            ]);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error(`에러 발생:  ${error.message}`);
            Alert.alert("에러 발생", error.message);
        }
    };

    const addUser = async () => {
        if (!id) {
            Alert.alert("아이디를 입력하세요.");
            return;
        }

        try {
            await fetchUserImages(id);
            setId(''); // 입력 필드 초기화
        } catch (error) {
            console.error(`에러 발생: ${error.message}`);
            Alert.alert("에러 발생", error.message);
        }
    };

    const handleStart = async () => {
        const uploadReferenceImages = async () => {
            try {
                const formData = new FormData();
                // 기준 이미지 추가
                userList.forEach((user, userIndex) => {
                    Object.keys(user.images).forEach((imageKey, imageIndex) => {
                        const imageName = `reference_image_${userIndex}_${imageIndex}.jpg`;
                        formData.append('reference_images', {
                            uri: user.images[imageKey],
                            name: imageName,
                            // type: 'image/jpeg' // Ensure the type is set
                        });
                    });
                });
                console.log("기준이미지 전송중1")
                const response = await fetch(`${Local_Server}/upload_reference_images`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    console.log("기준 이미지가 업로드 되었습니다");
                } else {
                    console.error("기준 이미지 업로드에 실패하였습니다.");
                }
            } catch (e) {
                console.error("기준 이미지 업로드에 실패하였습니다.", e);
            }
        };
        await uploadReferenceImages();
        console.log("기준이미지전송성공");
        navigation.navigate('RealTimeMosaic'); // userList 데이터를 함께 전달
    };

    const deleteUserHandler = (position) => {
        const deleteUser = () => {
            const newUsersArr = userList.filter((_, index) => position !== index);
            setUserList(newUsersArr);
        };

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
                    onPress: deleteUser
                }
            ]
        );
    };

    useEffect(() => {
        // 배열의 길이가 변경될 때마다 scaleValues 업데이트
        scaleValues.push(new Animated.Value(1));
    }, [userList.length]);

    const startUserItemPressAnimation = (index) => {
        setIsPressed((prevState) => {
            const newState = [...prevState];
            newState[index] = true;
            return newState;
        });

        Animated.timing(scaleValues[index], {
            toValue: 0.93,
            duration: 100,
            useNativeDriver: true
        }).start();
    };

    const endUserItemPressAnimation = (index) => {
        setIsPressed((prevState) => {
            const newState = [...prevState];
            newState[index] = false;
            return newState;
        });

        Animated.timing(scaleValues[index], {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
        }).start();
    };

    const openModal = (images) => {
        setSelectedImages(images);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImages({});
    };

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <SafeAreaView style={styles.container}>
                    <View style={styles.progressbarWrapper}>
                        <CustomProgressBar currentStep={2} />
                    </View>

                    <View style={styles.headerContainer}>
                        <Text style={styles.titleText}>실시간 인물 추가</Text>
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
                                            onPress={() => openModal(item.images)}
                                        >
                                            <Text style={styles.userId}>{item.id}</Text>
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

                    <View style={styles.inputContainer}>
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
                        <Animated.View style={{ width: "46%", transform: [{ scale: backScaleValue }] }}>
                            <TouchableOpacity
                                onPressIn={() => startBackPressAnimation()}
                                onPressOut={() => endBackPressAnimation()}
                                onPress={goBack}
                                style={styles.backButton}
                                activeOpacity={1}
                            >
                                <Text style={styles.back}>이전 단계</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View style={{ width: "46%", transform: [{ scale: nextScaleValue }] }}>
                            <TouchableOpacity
                                onPressIn={() => startNextPressAnimation()}
                                onPressOut={() => endNextPressAnimation()}
                                onPress={handleStart}
                                style={styles.nextButton}
                                activeOpacity={1}
                            >
                                <Text style={styles.next}>다음 단계</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {/* <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                    >
                        <TouchableWithoutFeedback onPress={closeModal}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalImageContainer}>
                                    {selectedImages.front && <Image source={{ uri: selectedImages.front }} style={styles.image} />}
                                    {selectedImages.top && <Image source={{ uri: selectedImages.top }} style={styles.image} />}
                                    {selectedImages.bottom && <Image source={{ uri: selectedImages.bottom }} style={styles.image} />}
                                    {selectedImages.left && <Image source={{ uri: selectedImages.left }} style={styles.image} />}
                                    {selectedImages.right && <Image source={{ uri: selectedImages.right }} style={styles.image} />}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal> */}

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={closeModal}
                    >
                        <TouchableWithoutFeedback onPress={closeModal}>
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalImageContainer}>
                                        <View style={styles.imageRow}>
                                            {selectedImages.front && <Image source={{ uri: selectedImages.front }} style={styles.image} />}
                                            {selectedImages.top && <Image source={{ uri: selectedImages.top }} style={styles.image} />}
                                        </View>
                                        <View style={styles.imageRow}>
                                            {selectedImages.bottom && <Image source={{ uri: selectedImages.bottom }} style={styles.image} />}
                                            {selectedImages.left && <Image source={{ uri: selectedImages.left }} style={styles.image} />}
                                        </View>
                                        <View style={styles.imageRow}>
                                            {selectedImages.right && <Image source={{ uri: selectedImages.right }} style={styles.image} />}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                    <LoadingModal visible={isLoading} />
                </SafeAreaView>
            </KeyboardAvoidingView>
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
        height: "7%",
        justifyContent: "center",
    },
    exContainer: {
        width: "95%",
        height: "60%",
        paddingHorizontal: "3%",
        paddingBottom: "3%",
        marginTop: "3%",
        backgroundColor: "#e5e5e5"
    },
    flatListContainer: {
        width: "100%",
        height: "100%"
    },
    inputContainer: {
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
        color: "#95ce67",
        marginLeft: "7%"
    },
    guideText: {
        fontSize: "17%",
        color: "#95ce67"
    },
    backButton: {
        width: "100%",
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
        width: "100%",
        height: "40%",
        backgroundColor: "#95ce67",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    addButton: {
        width: "13%",
        height: "55%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#95ce67",
        marginLeft: "3%",
        borderRadius: 10,
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 1 }, // 그림자 오프셋
        shadowOpacity: 0.2, // 그림자 투명도
        shadowRadius: 1, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    back: {
        fontSize: "18%",
        color: "#95ce67",
        fontWeight: "bold"
    },
    next: {
        fontSize: "18%",
        color: "#FFFFFF",
        fontWeight: "bold"
    },
    buttonText: {
        fontSize: "20%",
        color: "#FFFFFF",
        fontWeight: "600"
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
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "100%",
        height: "60%",
        backgroundColor: "#00000030",
        alignItems: "center",
        justifyContent: "center",
    },
    modalImageContainer: {
        flexDirection: 'column',
        alignItems: 'center', // Center align the rows
        justifyContent: 'center', // Center align the rows
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: "4%"
    },
    image: {
        width: 150,
        height: 150,
        marginHorizontal: "2%"
    }
    // modalContainer: {
    //     flex: 1,
    //     backgroundColor: "#00000030",
    //     alignItems: "center",
    //     justifyContent: "center"
    // },
    // modalImageContainer: {
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     width: "70%",
    //     height: "40%"
    // },
    // image: {
    //     width: 50,
    //     height: 50,
    //     margin: 5
    // }
});
