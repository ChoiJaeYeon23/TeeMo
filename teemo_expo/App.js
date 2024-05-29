import { NavigationContainer } from "@react-navigation/native"
import Navigation from "./navigations/Navigation"
import 'react-native-reanimated'

const App = () => {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  )
}

export default App