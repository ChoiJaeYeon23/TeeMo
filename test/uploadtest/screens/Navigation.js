import { createStackNavigator } from "@react-navigation/stack"

/* import Screen */
import InputScreen from "./InputScreen"
import OutputScreen from "./OutputScreen"

const Stack = createStackNavigator()

const Navigation = () => {
    return (
        <Stack.Navigator initialRouteName="업로드화면">
            <Stack.Screen name="업로드화면" component={InputScreen} />
            <Stack.Screen name="다운로드화면" component={OutputScreen} />
        </Stack.Navigator>
    )
}

export default Navigation