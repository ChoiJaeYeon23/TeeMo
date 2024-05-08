import { NavigationContainer } from "@react-navigation/native"
import "react-native-gesture-handler"
import Navigation from "./navigations/Navigation"

const App = () => {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  )
}

export default App