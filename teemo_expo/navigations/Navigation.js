import { createStackNavigator } from "@react-navigation/stack"

import SignInScreen from "../screens/SignInScreen"
import SignUpScreen from "../screens/SignUpScreen"
import ResultMediaScreen from "../screens/ResultMediaScreen"
import ChoiceMedia from "../screens/ChoiceMedia"
import NRTAddUserScreen from "../screens/NRTAddUserScreen"
import MosaicTest from "../screens/MosaicTest"
import RealTimeMosaic from "../screens/RealTimeMosaic"
import RTAddUserScreen from "../screens/RTAddUserScreen"
import HomeScreen from "../screens/HomeScreen"
import SettingScreen from "../screens/SettingScreen"

const Stack = createStackNavigator()

const Navigation = () => {
    return (
        <Stack.Navigator initialRouteName="SignInScreen">
            <Stack.Screen
                name="SettingScreen"
                component={SettingScreen}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="RealTimeMosaic"
                component={RealTimeMosaic}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="SignInScreen"
                component={SignInScreen}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="ResultMediaScreen"
                component={ResultMediaScreen}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="ChoiceMedia"
                component={ChoiceMedia}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="NRTAddUserScreen"
                component={NRTAddUserScreen}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="RTAddUserScreen"
                component={RTAddUserScreen}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="MosaicTest"
                component={MosaicTest}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
        </Stack.Navigator>
    )
}

export default Navigation