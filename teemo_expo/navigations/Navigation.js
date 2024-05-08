import { createStackNavigator } from "@react-navigation/stack"

import NavigationScreen from "./NavigationScreen"
import TakePictureScreen from "../screens/TakePictureScreen"
import RecordScreen from "../screens/RecordScreen"
import UserListScreen from "../screens/UserListScreen"
import CameraScreen from "../screens/CameraScreen"
import KakaoLoginScreen from "../screens/KakaoLoginScreen"
import LoginWebViewScreen from "../screens/LoginWebViewScreen"
import FaceRecognitionScreen from "../screens/FaceRecognitionScreen"
import SignInScreen from "../screens/SignInScreen"
import SignUpScreen from "../screens/SignUpScreen"
import MediaUploadScreen from "../screens/MediaUploadScreen"
import ResultMediaScreen from "../screens/ResultMediaScreen"

const Stack = createStackNavigator()

const Navigation = () => {
    return (
        <Stack.Navigator initialRouteName="NavigationScreen">
            <Stack.Screen name="NavigationScreen" component={NavigationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TakePictureScreen" component={TakePictureScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RecordScreen" component={RecordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="UserListScreen" component={UserListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
            <Stack.Screen name="KakaoLoginScreen" component={KakaoLoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="WebViewScreen" component={LoginWebViewScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FaceRecognitionScreen" component={FaceRecognitionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MediaUploadScreen" component={MediaUploadScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResultMediaScreen" component={ResultMediaScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default Navigation