import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"

const ChoiceMedia = ({ route }) => {
    const navigation = useNavigation()
    // const id = route.params.id
    const [loginNow, setLoginNow] = useState(true)

    const showToast = (id) => {
        Toast.show({
            type: 'success',
            text1: `${id}님, 어서오세요!`,
            visibilityTime: 2000,
            autoHide: true,
        })
    }

    // useEffect(() => {
    //     if (loginNow) {
    //         showToast(id);
    //         setLoginNow(false);
    //     }
    // }, []);

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.titleText}>시작하기</Text>
                </View>

                <View style={styles.exContainer}>
                    {/** */}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("NavigationScreen")} style={[styles.button, { marginLeft: "2%" }]} activeOpacity={1}>
                        <Text style={styles.buttonText}>미디어 촬영하기</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Test")} style={[styles.button, { marginRight: "2%" }]} activeOpacity={1}>
                        <Text style={styles.buttonText}>미디어 업로드하기</Text>
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
    headerContainer: {
        width: "100%",
        height: "20%",
        justifyContent: "center"
    },
    exContainer: {
        width: "100%",
        height: "50%",
        backgroundColor: "#e5e5e5",
        paddingHorizontal: "3%",
        paddingBottom: "3%"
    },
    buttonContainer: {
        width: "100%",
        height: "20%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        marginHorizontal: "4%"
    },
    titleText: {
        fontSize: "30%",
        fontWeight: "900",
        color: "#A0C49D",
        marginLeft: "7%"
    },
    button: {
        width: "42%",
        backgroundColor: "#A0C49D",
        padding: "5%",
        borderRadius: 10,
        alignItems: "center",
        marginBottom: "4%",
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    buttonText: {
        fontSize: "20%",
        color: "#FFFFFF",
        fontWeight: "600"
    }
})
