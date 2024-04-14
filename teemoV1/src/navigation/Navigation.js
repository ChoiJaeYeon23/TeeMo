import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

/* import Screen */
import KakaoLoginScreen from "../screens/KakaoLoginScreen"
import SettingScreen from "../screens/SettingScreen"
import RecordScreen from '../screens/Record/RecordScreen';
import PictureScreen from '../screens/Record/PictureScreen';
import PermissionScreen from "../screens/PermissionScreen"

const Stack = createStackNavigator()

const Navigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="로그인화면" component={KakaoLoginScreen} />
            <Stack.Screen name="설정화면" component={SettingScreen} />
            <Stack.Screen name="Record" component={RecordScreen} />
            <Stack.Screen name="Picture" component={PictureScreen} />
            <Stack.Screen name="권한화면" component={PermissionScreen} />
        </Stack.Navigator>
    )
}

export default Navigation
