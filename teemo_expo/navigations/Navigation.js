import { createStackNavigator } from "@react-navigation/stack"

import TakePictureScreen from "../screens/TakePictureScreen"
import RecordScreen from "../screens/RecordScreen"
import UserListScreen from "../screens/UserListScreen"
import LoginWebViewScreen from "../screens/LoginWebViewScreen"
import FaceRecognitionScreen from "../screens/FaceRecognitionScreen"
import SignInScreen from "../screens/SignInScreen"
import SignUpScreen from "../screens/SignUpScreen"
import MediaUploadScreen from "../screens/MediaUploadScreen"
import ResultMediaScreen from "../screens/ResultMediaScreen"
import ChoiceMedia from "../screens/ChoiceMedia"
import NRTAddUserScreen from "../screens/NRTAddUserScreen"
import MosaicTest from "../screens/MosaicTest"
import RealTimeMosaic from "../screens/RealTimeMosaic"
import RTAddUserScreen from "../screens/RTAddUserScreen"
import NavigationScreen from "./NavigationScreen"

const Stack = createStackNavigator()

const Navigation = () => {
    return (
        <Stack.Navigator initialRouteName="NavigationScreen">
            <Stack.Screen
                name="NavigationScreen"
                component={NavigationScreen}
            />
            <Stack.Screen
                name="TakePictureScreen"
                component={TakePictureScreen}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="RecordScreen"
                component={RecordScreen}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="UserListScreen"
                component={UserListScreen}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="WebViewScreen"
                component={LoginWebViewScreen}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="FaceRecognitionScreen"
                component={FaceRecognitionScreen}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="RealTimeMosaic"
                component={RealTimeMosaic}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="SignInScreen"
                component={SignInScreen}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="MediaUploadScreen"
                component={MediaUploadScreen}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="ResultMediaScreen"
                component={ResultMediaScreen}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="ChoiceMedia"
                component={ChoiceMedia}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="NRTAddUserScreen"
                component={NRTAddUserScreen}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="RTAddUserScreen"
                component={RTAddUserScreen}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="MosaicTest"
                component={MosaicTest}
                options={{
                    headerShown: false,
                    // gestureEnabled: false
                }}
            />
        </Stack.Navigator>
    )
}

export default Navigation