import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

/* import Screen */
import KakaoLoginScreen from "../screens/KakaoLoginScreen"
import SettingScreen from "../screens/SettingScreen"
import RecordScreen from '../screens/Record/RecordScreen';
import PictureScreen from '../screens/Record/PictureScreen';
import PermissionScreen from "../screens/PermissionScreen"
<<<<<<< HEAD
=======
import Record from '../screens/RecordScreen/Record';
import Save from '../screens/RecordScreen/Save';
import UserList from '../recognition/UserList';
import Userrecognition from '../recognition/Userrecognition';
>>>>>>> main


const Stack = createStackNavigator()

const Navigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="로그인화면" component={KakaoLoginScreen} />
            <Stack.Screen name="설정화면" component={SettingScreen} />
            <Stack.Screen name="Record" component={RecordScreen} />
            <Stack.Screen name="Picture" component={PictureScreen} />
            <Stack.Screen name="권한화면" component={PermissionScreen} />
<<<<<<< HEAD
=======
            <Stack.Screen name="UserList" component={UserList} />
            <Stack.Screen name='Userrecognition' component={Userrecognition}/>
            <Stack.Screen name="Record" component={Record} />
            <Stack.Screen name="Save" component={Save} />
>>>>>>> main
        </Stack.Navigator>
    )
}

export default Navigation
