import { useEffect } from "react"
import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import SplashScreen from "react-native-splash-screen"

import Navigation from "./src/navigation/Navigation"

const App = () => {

    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hide()
        }, 1000)
    }, [])

    return (
        <NavigationContainer>
            <Navigation />
        </NavigationContainer>
    )
}

export default App