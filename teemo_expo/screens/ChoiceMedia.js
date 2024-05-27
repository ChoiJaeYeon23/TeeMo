import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"

const ChoiceMedia = () => {
    const navigation = useNavigation()

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>시작하기</Text>
            </View>

            <View style={styles.exContainer}>
                <View style={{backgroundColor: "#E1ECC8", width: "100%", height: "100%"}}>
                    <Text></Text>
                </View>
                {/** */}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("NavigationScreen")} style={styles.button}>
                    <Text style={styles.buttonText}>미디어 촬영하기</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Test")} style={styles.button}>
                    <Text style={styles.buttonText}>미디어 업로드하기</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
        height: "13%",
        justifyContent: "center"
    },
    exContainer: {
        width: "100%",
        height: "67%",
        paddingHorizontal: "3%",
        paddingBottom: "3%"
    },
    buttonContainer: {
        width: "100%",
        height: "20%",
        paddingVertical: "4%",
        alignItems: "center"
    },
    titleText: {
        fontSize: "30%",
        fontWeight: "900",
        color: "#A0C49D",
        marginLeft: "7%"
    },
    button: {
        width: "80%",
        backgroundColor: "#A0C49D",
        padding: "5%",
        borderRadius: 15,
        alignItems: "center",
        marginBottom: "4%"
    },
    buttonText: {
        fontSize: "20%",
        color: "#FFFFFF",
        fontWeight: "600"
    }
})
