import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
    const navigation = useNavigation();

    const goToRecord = () => {
        navigation.navigate("Record");
    };

    const goToPicture = () => {
        navigation.navigate("Picture");
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.leftButton]} onPress={goToPicture}>
                    <Text style={styles.buttonText}>사진</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.rightButton]} onPress={goToRecord}>
                    <Text style={styles.buttonText}>영상 녹화</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.centered}>
                <Text style={styles.headerText}>모자이크 방식을 선택하세요.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end', // 아래쪽 정렬
        alignItems: 'center',
        backgroundColor: 'white', // 배경색을 흰색으로 설정
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20, // 아래쪽 마진 추가
    },
    button: {
        backgroundColor: 'lightblue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        width: '35%', // 버튼 너비 조정
    },
    leftButton: {
        marginRight: '5%', // 오른쪽 마진 추가
    },
    rightButton: {
        marginLeft: '5%', // 왼쪽 마진 추가
    },
    centered: {
        position: 'absolute',
        top: '50%', // 화면 상단에서 50% 위치
        transform: [{ translateY: -50 }], // 위로 이동하여 가운데 정렬
        width: '100%',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center', // 텍스트 가운데 정렬
    },
});

export default Home;
