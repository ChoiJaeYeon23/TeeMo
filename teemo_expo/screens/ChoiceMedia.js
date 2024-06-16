import React, { useRef } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Animated
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Octicons, MaterialCommunityIcons, Ionicons, AntDesign } from "@expo/vector-icons"
import Swiper from "react-native-swiper"
import CustomProgressBar from "./CustomProgressBar"

const ChoiceMedia = () => {
    const navigation = useNavigation()
    const currentStep = 1
    const ref = useRef(null)
    const RTscaleValue = useRef(new Animated.Value(1)).current
    const NRTscaleValue = useRef(new Animated.Value(1)).current

    const startRTPressAnimation = () => {
        Animated.timing(RTscaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endRTPressAnimation = () => {
        Animated.timing(RTscaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const startNRTPressAnimation = () => {
        Animated.timing(NRTscaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endNRTPressAnimation = () => {
        Animated.timing(NRTscaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const goBack = () => {
        navigation.goBack()
    }

    return (
        <>
            <SafeAreaView style={styles.container}>

                <View style={styles.progressbarWrapper}>
                    <CustomProgressBar currentStep={currentStep} />
                </View>

                <View style={[styles.exContainer, { paddingBottom: "5%", marginBottom: "10%", marginTop: "7%" }]}>
                    <View style={{ flexDirection: "row", marginVertical: "5%" }}>
                        <Octicons name="pin" size={24} color="#444444" />
                        <Text style={styles.guideSubTitle}>{"제작 방법"}</Text>
                    </View>
                    <Swiper
                        style={styles.swiper}
                        showsPagination={true}
                        autoplay={false}
                        dotStyle={styles.dot}
                        activeDotStyle={styles.activeDot}
                        paginationStyle={styles.pagination}
                    >
                        <View style={styles.swiperSlide}>

                            <Text style={styles.guideTitle}>실시간 모자이크</Text>
                            <Image source={require("../images/takePicture.png")} style={{ width: 200, height: 200, marginRight: "8%" }} />
                            <View style={{ width: "70%" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <MaterialCommunityIcons name="gamepad-circle-up" color="#444444" size={25} />
                                    <Text style={styles.guideText}>{"왼쪽 하단의 실시간 버튼을 눌러주세요."}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <MaterialCommunityIcons name="gamepad-circle-right" color="#444444" size={25} />
                                    <Text style={styles.guideText}>{"모자이크를 제외할 인물을 추가해주세요."}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <MaterialCommunityIcons name="gamepad-circle-down" color="#444444" size={25} />
                                    <Text style={styles.guideText}>{"사진이나 동영상을 촬영해주세요."}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <MaterialCommunityIcons name="gamepad-circle-left" color="#444444" size={25} />
                                    <Text style={styles.guideText}>{"결과물을 확인해주세요."}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.swiperSlide}>
                            <Text style={styles.guideTitle}>비실시간 모자이크</Text>
                            <Image source={require("../images/uploadImage.png")} style={{ width: 180, height: 180, marginRight: "5%", marginVertical: "2%" }} />
                            <View style={{ width: "75%" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <MaterialCommunityIcons name="gamepad-circle-up" color="#444444" size={25} />
                                    <Text style={styles.guideText}>{"오른쪽 하단의 비실시간 버튼을 눌러주세요."}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <MaterialCommunityIcons name="gamepad-circle-right" color="#444444" size={25} />
                                    <Text style={styles.guideText}>{"모자이크를 제외할 인물을 추가해주세요."}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <MaterialCommunityIcons name="gamepad-circle-down" color="#444444" size={25} />
                                    <Text style={styles.guideText}>{"사진이나 동영상을 업로드해주세요."}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <MaterialCommunityIcons name="gamepad-circle-left" color="#444444" size={25} />
                                    <Text style={styles.guideText}>{"결과물을 확인해주세요."}</Text>
                                </View>
                            </View>
                        </View>
                    </Swiper>
                </View>

                <View style={styles.buttonContainer}>
                    <Animated.View style={{ width: "46%", transform: [{ scale: RTscaleValue }] }}>
                        <TouchableOpacity
                            onPressIn={() => startRTPressAnimation()}
                            onPressOut={() => endRTPressAnimation()}
                            onPress={() => navigation.navigate("RTAddUserScreen")}
                            style={[styles.button, { marginLeft: "2%" }]}
                            activeOpacity={1}
                        >
                            <Text style={styles.buttonText}>실시간</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{ width: "46%", transform: [{ scale: NRTscaleValue }] }}>
                        <TouchableOpacity
                            onPressIn={() => startNRTPressAnimation()}
                            onPressOut={() => endNRTPressAnimation()}
                            onPress={() => navigation.navigate("NRTAddUserScreen")}
                            style={[styles.button, { marginRight: "2%" }]}
                            activeOpacity={1}
                        >
                            <Text style={styles.buttonText}>비실시간</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={{ flexDirection: "row", position: "absolute", left: "2%", bottom: "5%", zIndex: 1, alignItems: "center" }}>
                    <TouchableOpacity style={styles.goback} onPress={goBack} activeOpacity={1}>
                        <Ionicons name="chevron-back" size={34} color="#787878" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 17, color: "#787878", fontWeight: "600" }}>홈으로</Text>
                </View>
            </SafeAreaView>
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
    },
    guideTitle: {
        fontSize: 34,
        fontWeight: "bold",
        marginBottom: "3%",
        color: "#95ce67",
    },
    guideSubTitle: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: "3%",
        color: "#444444",
        marginLeft: "3%"
    },
    guideText: {
        fontSize: 21,
        color: "#444444",
        fontWeight: "600",
        marginVertical: "2%",
        marginLeft: "2%"
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
        width: "100%",
        height: "80%",
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
    buttonText: {
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: "bold"
    },
    goback: {
        padding: 10
    }
})
