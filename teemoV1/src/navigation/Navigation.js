import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

/* import Screen */
<<<<<<< HEAD
import KakaoLoginScreen from "../screens/KakaoLoginScreen"
import SettingScreen from "../screens/SettingScreen"
=======
import KakaoLoginScreen from '../screens/KakaoLoginScreen';
import Record from '../screens/RecordScreen/Record';
import Save from '../screens/RecordScreen/Save';
>>>>>>> Suji

const Stack = createStackNavigator();

const Navigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="로그인화면" component={KakaoLoginScreen} />
<<<<<<< HEAD
            <Stack.Screen name="설정화면" component={SettingScreen} />
=======
            <Stack.Screen name="Record" component={Record} />
            <Stack.Screen name="Save" component={Save} />
>>>>>>> Suji
        </Stack.Navigator>
    );
};

export default Navigation;
