import { createStackNavigator } from "@react-navigation/stack"

/* import Screen */
import InputScreen from "./InputScreen"
import OutputScreen from "./OutputScreen"
import SaveScreen from "./Record/SaveScreen"
import RecordScreen from "./Record/RecordScreen"

const Stack = createStackNavigator()

const Navigation = () => {
    return (
        <Stack.Navigator initialRouteName="업로드화면">
            <Stack.Screen name="업로드화면" component={InputScreen} />
            <Stack.Screen name="다운로드화면" component={OutputScreen} />
            <Stack.Screen name="동영상 저장 화면" component={SaveScreen} />
            <Stack.Screen name="녹화 화면" component={RecordScreen} />
        </Stack.Navigator>
    )
}

export default Navigation