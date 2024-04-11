import React from "react"
import { SafeAreaView, View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"

import PermissionUtil from "../permissions/PermissionUtil"
import { APP_PERMISSION_CODE, APP_PERMISSION_LIST, APP_PERMISSOIN_DETAIL } from "../permissions/Permissions"

/**
 * 사용자에게 요청할 모든 접근 권한을 안내하는 페이지입니다.
 * 
 * ○ 필수 접근 권한 리스트
 *   └ 카메라 & 동영상 촬영
 *   └ 마이크 사용
 *   └ 사진 및 영상 라이브러리 접근
 */
const PermissionScreen = () => {
    const navigation = useNavigation()

    const iconSize = 40
    const iconColor = "#222222"
    const permUtil = PermissionUtil

    const handlePermissionRequest = async () => {
        try {
            await permUtil.requestPermission([
                ...APP_PERMISSION_CODE.CAMERA,
                ...APP_PERMISSION_CODE.MIC,
                ...APP_PERMISSION_CODE.STORAGE,
            ])
            console.log("접근 권한이 허용되었습니다")
            Alert.alert("모든 접근 권한이 허용되었습니다.")
            navigation.navigate("HOME")
        } catch (error) {
            console.error("접근 권한 요청 중 오류가 발생했습니다", error)
            Alert.alert("접근 권한 요청 중 오류가 발생했습니다.")
        }
    }

    return (
        <SafeAreaView style={containers.container}>

            <View style={containers.top}>
                <Text style={texts.title}>필수 접근 권한 안내</Text>
                <Text style={texts.description}>"티모" 서비스를 사용하기 위해서는 다음 세 가지 접근 권한의 허용이 필요합니다.</Text>
            </View>

            <View style={containers.middle}>
                <View style={contents.box}>
                    <View style={contents.item}>
                        <Icon name="videocam-outline" size={iconSize} color={iconColor} />
                        <Text style={texts.permission_list}>{APP_PERMISSION_LIST.CAMERA}</Text>
                    </View>
                    <Text style={texts.permission_details}>{APP_PERMISSOIN_DETAIL.CAMERA}</Text>
                </View>

                <View style={contents.box}>
                    <View style={contents.item}>
                        <Icon name="mic-outline" size={iconSize} color={iconColor} />
                        <Text style={texts.permission_list}>{APP_PERMISSION_LIST.MIC}</Text>
                    </View>
                    <Text style={texts.permission_details}>{APP_PERMISSOIN_DETAIL.MIC}</Text>
                </View>

                <View style={contents.box}>
                    <View style={contents.item}>
                        <Icon name="images-outline" size={iconSize} color={iconColor} />
                        <Text style={texts.permission_list}>{APP_PERMISSION_LIST.STORAGE}</Text>
                    </View>
                    <Text style={texts.permission_details}>{APP_PERMISSOIN_DETAIL.STORAGE}</Text>
                </View>
            </View>

            <View style={containers.bottom}>
                <TouchableOpacity onPress={handlePermissionRequest}>
                    <Text style={button.permission_allow}>모든 접근 권한 허용하기</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default PermissionScreen

const containers = StyleSheet.create({
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
        flex: 1
    }
})

const contents = StyleSheet.create({
    box: {
        flex: 1
    },
    item: {
        flex: 0.5,
        flexDirection: "row",
        alignItems: "center",
    }
})

const texts = StyleSheet.create({
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
    permission_list: {
        color: "#222222",
        fontSize: 18,
        paddingLeft: 20
    },
    permission_details: {
        color: "#666666",
        fontSize: 17,
        paddingLeft: 60
    }
})

const button = StyleSheet.create({
    permission_allow: {

    }
})