import { createStackNavigator } from "@react-navigation/stack"

/* import Screen */
import KakaoLoginScreen from "../screens/KakaoLoginScreen"

const Stack = createStackNavigator()

const Navigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="로그인화면" component={KakaoLoginScreen} />
        </Stack.Navigator>
    )
}

export default Navigation