import React, { useEffect, useState, useRef, Component } from "react";
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
import Swiper from "react-native-swiper"
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

                <View style={styles.progressbarWrapper}>
                    <CustomProgressBar currentStep={currentStep} />
                </View>

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

                <View style={styles.swiperWrapper}>
                    <Swiper
                        style={styles.swiper}
                        showsPagination={true}
                        autoplay={false}
                        dotStyle={styles.dot}
                        activeDotStyle={styles.activeDot}
                        paginationStyle={styles.pagination}
                    >
                        <View style={styles.swiperSlide}>
                            <Image source={require("../images/takePicture.png")} style={{ width: 80, height: 80, marginRight: "8%" }} />
                            <View>
                                <Text style={styles.guideTitle}>실시간 모자이크 촬영물 제작 가이드</Text>
                                <Text style={styles.guideText}>
                                    {"1. 실시간 버튼을 눌러주세요."}
                                    {"\n"}
                                    {"2. 모자이크를 제외할 인물을 추가해주세요."}
                                    {"\n"}
                                    {"3. 사진이나 동영상을 촬영해주세요."}
                                    {"\n"}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.swiperSlide}>
                            <Image source={require("../images/uploadImage.png")} style={{ width: 80, height: 80, marginRight: "5%" }} />
                            <View>
                                <Text style={styles.guideTitle}>비실시간 모자이크 촬영물 제작 가이드</Text>
                                <Text style={styles.guideText}>
                                    {"1. 비실시간 버튼을 눌러주세요."}
                                    {"\n"}
                                    {"2. 모자이크를 제외할 인물을 추가해주세요."}
                                    {"\n"}
                                    {"3. 모자이크 하고싶은 사진이나 동영상을 추가해주세요."}
                                    {"\n"}
                                </Text>
                            </View>
                        </View>
                    </Swiper>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("RTAddUserScreen")} style={[styles.button, { marginLeft: "2%" }]} activeOpacity={1}>
                        {/* <Image source={require("../images/takePicture.png")} style={{ width: 160, height: 110, marginBottom: "10%" }} /> */}
                        <Text style={styles.buttonText}>실시간</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("NRTAddUserScreen")} style={[styles.button, { marginRight: "2%" }]} activeOpacity={1}>
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
    progressbarWrapper: {
        width: "100%",
        height: "8%",
        alignItems: "center",
        justifyContent: "center",
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
    swiperWrapper: {
        width: "100%",
        height: "15%",
        paddingVertical: "3%",
    },
    swiper: {
        alignItems: "center",
        justifyContent: "center",
    },
    swiperSlide: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    guideTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: "3%",
        color: "#333333"
    },
    guideText: {
        fontSize: 16,
        color: "#565656"
    },
    dot: {
        backgroundColor: "#99999950",
        width: 6,
        height: 6,
        borderRadius: 4,
    },
    activeDot: {
        backgroundColor: "#999999EE",
        width: 6,
        height: 6,
        borderRadius: 4,
    },
    pagination: {
        bottom: "-3%", // Adjust this value as needed
    },
    buttonContainer: {
        width: "90%",
        height: "8%",
        paddingHorizontal: "1%",
        flexDirection: "row",
        marginTop: "7%",
        justifyContent: "space-around",
    },
    button: {
        width: "46%",
        height: "80%",
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
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: "bold"
    }
})
