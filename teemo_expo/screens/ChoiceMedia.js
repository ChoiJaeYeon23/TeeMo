import React, { useEffect, useState, useRef } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import Carousel from "react-native-reanimated-carousel"
import CustomProgressBar from "./CustomProgressBar"

const ChoiceMedia = ({ route }) => {
    const navigation = useNavigation()
    // const id = route.params.id
    const [loginNow, setLoginNow] = useState(true)
    const currentStep = 1
    const ref = useRef(null)
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    // const fetchNickname = () => {
    //     fetch("http://3.34.125.163:5001/api/get_nickname", {
    //         method: "POST", // POST 요청으로 변경
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({ id: id }) // id를 서버에 전송
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log("받아온 닉네임: ", data.nickname);
    //             showToast(data.nickname); // 닉네임으로 showToast 함수 호출
    //         })
    //         .catch(error => {
    //             console.error("에러:", error);
    //         });
    // };

    // const showToast = (nickname) => {
    //     Toast.show({
    //         type: 'success',
    //         text1: `${nickname}님, 어서오세요!`,
    //         visibilityTime: 2000,
    //         autoHide: true,
    //     })
    // }

    // useEffect(() => {
    //     if (loginNow) {
    //         fetchNickname()
    //         setLoginNow(false);
    //     }
    // }, []);

    return (
        <>
            <SafeAreaView style={styles.container}>

                <CustomProgressBar currentStep={currentStep} />

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
                                <Image source={item} style={styles.carouselImage} resizeMode="stretch" />
                            </View>
                        )}
                        width={screenWidth * 0.97}
                        height={screenHeight * 0.6 * 0.97}
                        loop={true}
                        snapEnabled={true}
                        autoPlayInterval={1500}
                    />
                </View>

                <Carousel
                        ref={ref}
                        data={[
                            require("../images/guidebanner.png"),
                            require("../images/guidebanner.png")
                        ]}
                        renderItem={({ item }) => (
                            <View style={{width: "100%", height: "10%",}}>
                                <Image source={item} style={{width: 400, height: 100}} resizeMode="contain" />
                            </View>
                        )}
                        width={400}
                        height={100}
                        loop={false}
                        snapEnabled={true}
                    />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("NavigationScreen")} style={[styles.button, { marginLeft: "2%" }]} activeOpacity={1}>
                        {/* <Image source={require("../images/takePicture.png")} style={{ width: 160, height: 110, marginBottom: "10%" }} /> */}
                        <Text style={styles.buttonText}>실시간</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Test")} style={[styles.button, { marginRight: "2%" }]} activeOpacity={1}>
                        {/* <Image source={require("../images/uploadImage.png")} style={{ width: 100, height: 130, marginBottom: "10%" }} /> */}
                        <Text style={styles.buttonText}>비실시간</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <Toast />
        </>
    )
}

export default ChoiceMedia;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    exContainer: {
        width: "100%",
        height: "60%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "5%",
        // marginBottom: "10%",
        overflow: "hidden",
        // backgroundColor: "red"
    },
    carouselImage: {
        width: "97%",
        height: "97%",
        borderRadius: 10
    },
    carouselItemContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        width: "90%",
        height: "20%",
        paddingHorizontal: "1%",
        flexDirection: "row",
        marginTop: "27%",
        justifyContent: "space-around",
    },
    button: {
        width: "46%",
        height: "30%",
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
    buttonText: {
        fontSize: "18%",
        color: "#FFFFFF",
        fontWeight: "bold"
    }
})
