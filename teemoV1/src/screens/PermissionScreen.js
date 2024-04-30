import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import PermissionUtil from "../permissions/PermissionUtil";
import { APP_PERMISSION_CODE, APP_PERMISSION_LIST, APP_PERMISSOIN_DETAIL } from "../permissions/Permissions";

const PermissionScreen = () => {
    const navigation = useNavigation();

    const iconSize = 40;
    const iconColor = "#222222";
    const permUtil = PermissionUtil;

    const handlePermissionRequest = async () => {
        try {
            await permUtil.requestPermission([
                ...APP_PERMISSION_CODE.CAMERA,
                ...APP_PERMISSION_CODE.MIC,
                ...APP_PERMISSION_CODE.STORAGE,
            ]);
            console.log("접근 권한이 허용되었습니다");
            Alert.alert("모든 접근 권한이 허용되었습니다.");
            navigation.navigate("설정화면");
        } catch (error) {
            console.error("접근 권한 요청 중 오류가 발생했습니다", error);
            Alert.alert("접근 권한 요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.title}>필수 접근 권한 안내</Text>
                <Text style={styles.description}>"티모" 서비스를 사용하기 위해서는 다음 세 가지 접근 권한의 허용이 필요합니다.</Text>
            </View>

            <View style={styles.middle}>
                <View style={styles.box}>
                    <View style={styles.item}>
                        <Icon name="videocam-outline" size={iconSize} color={iconColor} />
                        <Text style={styles.permissionList}>{APP_PERMISSION_LIST.CAMERA}</Text>
                    </View>
                    <Text style={styles.permissionDetails}>{APP_PERMISSOIN_DETAIL.CAMERA}</Text>
                </View>

                <View style={styles.box}>
                    <View style={styles.item}>
                        <Icon name="mic-outline" size={iconSize} color={iconColor} />
                        <Text style={styles.permissionList}>{APP_PERMISSION_LIST.MIC}</Text>
                    </View>
                    <Text style={styles.permissionDetails}>{APP_PERMISSOIN_DETAIL.MIC}</Text>
                </View>

                <View style={styles.box}>
                    <View style={styles.item}>
                        <Icon name="images-outline" size={iconSize} color={iconColor} />
                        <Text style={styles.permissionList}>{APP_PERMISSION_LIST.STORAGE}</Text>
                    </View>
                    <Text style={styles.permissionDetails}>{APP_PERMISSOIN_DETAIL.STORAGE}</Text>
                </View>
            </View>

            <View style={styles.bottom}>
            <TouchableOpacity onPress={handlePermissionRequest} style={styles.button}>
                    <Text style={styles.buttonTextBold}>허용</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default PermissionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: "center"
    },
    top: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    middle: {
        flex: 1.3
    },
    bottom: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 20 // 조정된 위치
    },
    box: {
        flex: 1
    },
    item: {
        flex: 0.5,
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        color: "#222222",
        fontSize: 23,
        paddingTop: 40
    },
    description: {
        color: "#666666",
        fontSize: 15,
        paddingTop: 15
    },
    permissionList: {
        color: "#222222",
        fontSize: 18,
        paddingLeft: 20
    },
    permissionDetails: {
        color: "#666666",
        fontSize: 17,
        paddingLeft: 60
    },
    button: {
        backgroundColor: "#FFFFFF", // 흰색 배경
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1, // 테두리 추가
        borderColor: "#000000", // 테두리 색상 설정
        marginBottom: 170
    },
    buttonTextBold: {
        fontSize: 25,
        color: "#000000", // 흑색 텍스트
    }
});
