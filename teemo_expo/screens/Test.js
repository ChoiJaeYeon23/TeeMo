import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const TestScreen = ({ navigation }) => {
    const [id, setId] = useState('');
    const [userList, setUserList] = useState([]);

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
        <View style={styles.container}>
            <Text style={styles.title}>사용자 이미지 보기</Text>
            <TextInput
                value={id}
                onChangeText={setId}
                placeholder="사용자 ID"
                style={styles.input}
            />
            <TouchableOpacity onPress={addUser} style={styles.addButton}>
                <Entypo name="circle-with-plus" size={50} color="#999999" />
            </TouchableOpacity>
            <View style={styles.imageContainer}>
                {userList.map(({ id, imageUrl }, index) => (
                    <View key={index} style={styles.userItem}>
                        <Text style={styles.userId}>{id}</Text>
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    </View>
                ))}
            </View>
            <TouchableOpacity onPress={handleStart} style={styles.startButton}>
                <Text style={styles.startText}>시작하기</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TestScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        fontSize: 18,
        width: '80%',
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 5,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
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
    },
    startButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    startText: {
        color: '#FFF',
        fontSize: 16,
    },
});
