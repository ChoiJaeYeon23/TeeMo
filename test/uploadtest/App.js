import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"

import Nav from "./screens/Navigation"
import SplashScreen from "react-native-splash-screen"
import { useEffect } from "react"

const App = () => {

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 1000)
  }, [])

  return (
    <NavigationContainer>
      <Nav />
    </NavigationContainer>
  )
}

export default App