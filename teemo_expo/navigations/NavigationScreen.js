import { SafeAreaView, Button } from "react-native"
import { useNavigation } from "@react-navigation/native"



const NavigationScreen = () => {
    const navigation = useNavigation()

    return (
        <SafeAreaView>
            <Button
                title="처리 방식 선택"
                onPress={() => navigation.navigate("ChoiceMedia")}
            />

            <Button
                title="기준 이미지 촬영"
                onPress={() => navigation.navigate("FaceRecognitionScreen")}
            />


            <Button
                title="기준/그룹 이미지 미리보기(비실시간 [2])"
                onPress={() => navigation.navigate("MosaicTest")}
            />

            <Button
                title="동영상 녹화 화면"
                onPress={() => navigation.navigate("RecordScreen")}
            />

            <Button
                title="결과 이미지 보기"
                onPress={() => navigation.navigate("ResultMediaScreen")}
            />

            <Button
                title="로그인 화면"
                onPress={() => navigation.navigate("SignInScreen")}
            />

            <Button
                title="회원가입 화면"
                onPress={() => navigation.navigate("SignUpScreen")}
            />

            <Button
                title="사진 촬영 화면"
                onPress={() => navigation.navigate("TakePictureScreen")}
            />

            <Button
                title="기준 이미지 추가 화면(비실시간 [1])"
                onPress={() => navigation.navigate("Test")}
            />

            <Button
                title="사용자 리스트 화면(사용 안할듯)"
                onPress={() => navigation.navigate("UserListScreen")}
            />
            <Button
                title="미디어 업로드하기(사용 안할듯)"
                onPress={() => navigation.navigate("MediaUploadScreen")}
            />
        </SafeAreaView>
    )
}

export default NavigationScreen