import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ChoiceMedia = () => {
    const navigation = useNavigation();

    const uploadImage = () => {
        navigation.navigate("MediaUploadScreen");
    };

    const recordVideo = () => {
        navigation.navigate("RecordScreen");
    };

    const addUser = () => {
        navigation.navigate("UserListScreen");
    };

    return (
        <SafeAreaView style={containers.container}>
            <View style={containers.top}>
                <Text style={texts.title}>처리 방식 선택</Text>
            </View>
            <View style={containers.middle}>
                <Text style={texts.subTitle}>모자이크 처리를 하고 싶은 방식을 선택해주세요.</Text>
                <View style={styles.time}>
                    <Text style={[texts.subTitle2]}>비실시간</Text>
                    <TouchableOpacity onPress={uploadImage} style={containers.circleButton}>
                        <Text style={texts.buttonText}>이미지</Text>
                    </TouchableOpacity>
                </View>

                <View style={containers.buttonContainer}>
                    <View style={styles.time}>
                        <Text style={[texts.subTitle2]}>실시간</Text>
                        <TouchableOpacity onPress={addUser} style={containers.rectButton}>
                            <Text style={texts.buttonText}>인물 추가</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: "3%" }}>
                            <TouchableOpacity onPress={recordVideo} style={containers.rectButton}>
                                <Text style={texts.buttonText}>녹화 시작</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ChoiceMedia;

const containers = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
    },
    top: {
        height: "25%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "3%",
    },
    middle: {
        height: "50%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    bottom: {
        height: "30%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginBottom: "5%",
    },
    circleButton: {
        backgroundColor: "#FFF",
        borderWidth: "1%",
        borderColor: "#000",
        padding: "7%",
        alignItems: "center",
        justifyContent: "center",
        width: "35%",
        height: "35%",
    },
    rectButton: {
        backgroundColor: "#FFF",
        borderWidth: "1%",
        borderColor: "#000",
        paddingVertical: "7%",
        paddingHorizontal: "23%",
        marginHorizontal: "7%",
        alignItems: "center",
        justifyContent: "center"
    },
});

const texts = StyleSheet.create({
    title: {
        fontSize: "35%",
        fontWeight: "bold",
        color: "#333",
    },
    subTitle: {
        fontSize: "22%",
        color: "#FF0000",
        textAlign: "center",
    },
    subTitle2: {
        fontSize: "20%",
        color: "#000",
        textAlign: "center",
        marginTop: "15%",
        padding: "1%"
    },
    buttonText: {
        fontSize: "24%",
        color: "#000",
    },
});

const styles = StyleSheet.create({
    time: {
        alignItems: "center",
    },
});
