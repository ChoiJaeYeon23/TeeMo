import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

/* import Screen */
import KakaoLoginScreen from "../screens/KakaoLoginScreen";
import SettingScreen from "../screens/SettingScreen";
import RecordScreen from "../screens/Record/RecordScreen";
import PictureScreen from "../screens/Record/PictureScreen";
import PermissionScreen from "../screens/PermissionScreen";
import UserList from "../recognition/UserList";
import Userrecognition from "../recognition/Userrecognition";
import User from "../screens/User";
import Home from "../screens/Home";
import SignUpScreen from "../screens/SingnUpScreen";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="로그인화면" component={KakaoLoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="설정화면" component={SettingScreen} />
        <Stack.Screen name="Record" component={RecordScreen} />
        <Stack.Screen name="Picture" component={PictureScreen} />
        <Stack.Screen name="권한화면" component={PermissionScreen} />
        <Stack.Screen name="UserList" component={UserList} />
        <Stack.Screen name="Userrecognition" component={Userrecognition} />
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
