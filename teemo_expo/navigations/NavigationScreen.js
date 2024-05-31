import { SafeAreaView, Button } from "react-native"
import { useNavigation } from "@react-navigation/native"

const NavigationScreen = () => {
    const navigation = useNavigation()

    return (
        <SafeAreaView>
            <Button
                title="[1] 로그인 화면"
                onPress={() => navigation.navigate("SignInScreen")}
            />

            <Button
                title="[1.1] 회원가입 화면"
                onPress={() => navigation.navigate("SignUpScreen")}
            />

            <Button
                title="[2] 처리 방식 선택(로그인 안 하면 오류떠요~)"
                onPress={() => navigation.navigate("ChoiceMedia")}
            />

            <Button
                title="[2.1.1] 기준 이미지 추가 화면(비실시간 [1])"
                onPress={() => navigation.navigate("Test")}
            />

            <Button
                title="[2.1.2] 기준/그룹 이미지 미리보기(비실시간 [2])"
                onPress={() => navigation.navigate("MosaicTest")}
            />

            <Button
                title="[2.2.2] 실시간 모자이크 웹뷰 화면"
                onPress={() => navigation.navigate("RealTimeMosaic")}
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
                title="사진 촬영 화면"
                onPress={() => navigation.navigate("TakePictureScreen")}
            />

            <Button
                title="사용자 리스트 화면(사용 안할듯)"
                onPress={() => navigation.navigate("UserListScreen")}
            />

            <Button
                title="미디어 업로드하기(사용 안할듯)"
                onPress={() => navigation.navigate("MediaUploadScreen")}
            />

            <Button
                title="기준 이미지 촬영(여기 들어가면 reload해야돼)"
                onPress={() => navigation.navigate("FaceRecognitionScreen")}
            />
        </SafeAreaView>
    )
}

export default NavigationScreen