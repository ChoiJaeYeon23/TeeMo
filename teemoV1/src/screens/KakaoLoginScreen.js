import { SafeAreaView, View, Text, Button } from "react-native"
import { useNavigation } from "@react-navigation/native";

/**
 * 카카오 API를 이용한 로그인 화면입니다.
 */
const KakaoLoginScreen = () => {
    const navigation = useNavigation();

    const goToRecord = () => {
        navigation.navigate("Record");
      };

    const goToSave = () => {
        navigation.navigate("Save");
      };

    return (
        <SafeAreaView>
            <View>
                <Text>카카오 로그인 화면입니다.</Text>
                <Button title="녹화" onPress={goToRecord} />
                <Button title="저장" onPress={goToSave} />
            </View>
        </SafeAreaView>
    )
}

export default KakaoLoginScreen