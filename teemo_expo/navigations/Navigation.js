import { createStackNavigator } from "@react-navigation/stack"

import NavigationPage from "./NavigationPage"
import TakePicturePage from "../screens/TakePicturePage"
import RecordPage from "../screens/RecordPage"
import UserListPage from "../screens/UserListPage"
import CameraPage from "../screens/CameraPage"
import KakaoLoginPage from "../screens/KakaoLoginPage"
import LoginWebViewPage from "../screens/LoginWebViewPage"
import FaceRecognitionPage from "../screens/FaceRecognitionPage"

const Stack = createStackNavigator()

const Navigation = () => {
    return (
        <Stack.Navigator initialRouteName="NavigationPage">
            <Stack.Screen name="NavigationPage" component={NavigationPage} options={{ headerShown: false }} />
            <Stack.Screen name="TakePicturePage" component={TakePicturePage} options={{ headerShown: false }} />
            <Stack.Screen name="RecordPage" component={RecordPage} options={{ headerShown: false }} />
            <Stack.Screen name="UserListPage" component={UserListPage} options={{ headerShown: false }} />
            <Stack.Screen name="CameraPage" component={CameraPage} options={{ headerShown: false }} />
            <Stack.Screen name="LoginPage" component={KakaoLoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="WebViewPage" component={LoginWebViewPage} options={{ headerShown: false }} />
            <Stack.Screen name="FaceRecognitionPage" component={FaceRecognitionPage} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default Navigation