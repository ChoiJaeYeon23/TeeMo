import React, { useRef, useEffect, useState } from "react"
import {
    SafeAreaView,
    View,
    Image,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    Animated
} from "react-native"
import Toast from "react-native-toast-message"
import Carousel from "react-native-reanimated-carousel"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { Ubuntu_Server } from '@env'

const HomeScreen = ({ route }) => {
    const ref = useRef(null)
    const id = route.params.id
    const [loginNow, setLoginNow] = useState(true)
    const screenWidth = Dimensions.get("window").width
    const screenHeight = Dimensions.get("window").height
    const navigation = useNavigation()
    const scaleValue = useRef(new Animated.Value(1)).current

    const startPressAnimation = () => {
        Animated.timing(scaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endPressAnimation = () => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const fetchNickname = () => {
        fetch(`${Ubuntu_Server}/api/get_nickname`, {
            method: "POST", // POST 요청으로 변경
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id }) // id를 서버에 전송
        })
            .then(response => response.json())
            .then(data => {
                console.log("받아온 닉네임: ", data.nickname);
                showToast(data.nickname); // 닉네임으로 showToast 함수 호출
            })
            .catch(error => {
                console.error("에러:", error);
            });
    };

    const showToast = (nickname) => {
        Toast.show({
            type: 'success',
            text1: `${nickname}님, 어서오세요!`,
            visibilityTime: 2000,
            autoHide: true,
        })
    }

    useEffect(() => {
        if (loginNow) {
            fetchNickname()
            setLoginNow(false);
        }
    }, [])

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>TeeMo</Text>
                </View>

                <TouchableOpacity style={styles.headerSetting} onPress={() => navigation.navigate("SettingScreen", { id })}>
                    <Feather name="settings" size={24} color="#767676" />
                </TouchableOpacity>

                <View style={styles.exContainer}>
                    <Carousel
                        ref={ref}
                        mode="parallax"
                        autoPlay={true}
                        data={[
                            require("../images/top.jpg"),
                            require("../images/app_logo.png"),
                            require("../images/bottom.jpg"),
                            require("../images/kakao_login.png"),
                            require("../images/front.jpg"),
                            require("../images/01.gif"),
                            require("../images/result.jpg")
                        ]}
                        modeConfig={{
                            parallaxScrollingScale: 0.9,
                            parallaxScrollingOffset: 50
                        }}
                        renderItem={({ item }) => (
                            <View style={styles.carouselItemContainer}>
                                <Image source={item} style={styles.carouselImage} resizeMode="contain" />
                            </View>
                        )}
                        width={screenWidth * 0.97}
                        height={screenHeight * 0.6 * 0.97}
                        loop={true}
                        snapEnabled={true}
                        autoPlayInterval={1500}
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    />
                </View>

                <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        activeOpacity={1}
                        onPressIn={() => startPressAnimation()}
                        onPressOut={() => endPressAnimation()}
                        onPress={() => navigation.navigate("ChoiceMedia", { id })}
                    >
                        <Text style={styles.buttonText}>모자이크 시작하기</Text>
                        <MaterialIcons name="navigate-next" size={30} color="#FFFFFF" />
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>

            <Toast />
        </>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    headerContainer: {
        width: "100%",
        height: "15%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    headerTitle: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#95ce67"
    },
    headerSetting: {
        position: "absolute",
        right: "3%",
        top: "5.5%",
        padding: "3%"
    },
    exContainer: {
        width: "100%",
        height: "62%",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    carouselImage: {
        width: "97%",
        height: "97%",
        borderRadius: 10
    },
    carouselItemContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        flexDirection: "row",
        backgroundColor: "#95ce67",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: "4%",
        paddingVertical: "5%",
        borderRadius: 15,
        marginTop: "5%"
    },
    buttonText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginHorizontal: "3%",
    }
})