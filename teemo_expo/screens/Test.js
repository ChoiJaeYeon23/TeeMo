import React, { useState } from 'react';
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
    TouchableWithoutFeedback
} from 'react-native';

const TestScreen = ({ navigation }) => {
    const [id, setId] = useState('');
    const [userList, setUserList] = useState([]);

    const keyboardOff = () => {
        Keyboard.dismiss()
    }

    const goBack = () => {
        navigation.goBack()
    }
    
    const fetchUserImage = async (userId) => {
        try {
            const response = await fetch("http://3.34.125.163:5001/api/get_user_image", {
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
            const imageUrl = URL.createObjectURL(imageBlob);

            // 새로운 사용자 정보를 추가하고 이미지 URL을 업데이트합니다.
            setUserList((prevList) => [...prevList, { id: userId, imageUrl }]);
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
        navigation.navigate('MosaicTest', { userList });
    };

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.titleText}>사용자 이미지 보기</Text>
                    <Text style={styles.guideText}>모자이크 하지 않을 사용자를 추가해주세요.</Text>
                </View>

                <View style={styles.exContainer}>
                    <View style={styles.imageContainer}>
                        {
                            userList.map(({ id, imageUrl }, index) => (
                                <View key={index} style={styles.userItem}>
                                    <Text style={styles.userId}>{id}</Text>
                                    <Image source={{ uri: imageUrl }} style={styles.image} />
                                </View>
                            ))
                        }
                    </View>
                </View>

                <View style={styles.inputContanier}>
                    <TextInput
                        value={id}
                        onChangeText={setId}
                        placeholder="사용자 ID"
                        style={styles.input}
                    />

                    <TouchableOpacity onPress={addUser} style={styles.addButton}>
                        <Text style={styles.buttonText}>추가</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={goBack} style={styles.backButton}>
                        <Text style={styles.back}>이전 단계</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleStart} style={styles.nextButton}>
                        <Text style={styles.next}>다음 단계</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default TestScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    headerContainer: {
        width: "100%",
        height: "13%",
        justifyContent: "center"
    },
    exContainer: {
        width: "100%",
        height: "60%",
        paddingHorizontal: "3%",
        paddingBottom: "3%",
        backgroundColor: "#E1ECC8"
    },
    inputContanier: {
        width: "90%",
        height: "10%",
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#C4D7B2",
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
        color: "#A0C49D",
        marginLeft: "7%"
    },
    guideText: {
        fontSize: "17%",
        marginLeft: "7%",
        marginTop: "3%",
        color: "#A0C49D"
    },
    input: {
        fontSize: "18%",
        width: "76%",
        height: "55%",
        paddingHorizontal: "4%",
        borderColor: '#A0C49D',
        borderWidth: 1,
        borderRadius: 15
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
        backgroundColor: "#A0C49D",
        marginLeft: "3%",
        borderRadius: 15
    },
    backButton: {
        width: "46%",
        height: "40%",
        borderWidth: 1,
        borderColor: "#A0C49D",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    nextButton: {
        width: "46%",
        height: "40%",
        backgroundColor: "#A0C49D",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    back: {
        fontSize: "18%",
        color: "#A0C49D",
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
        justifyContent: 'center',
    },
    userItem: {
        alignItems: 'center',
        margin: 10,
    },
    userId: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    image: {
        width: 100,
        height: 100,
    }
})
