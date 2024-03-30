import { useState } from "react"
import { SafeAreaView, View, Image, Text, TouchableOpacity, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { launchCamera, launchImageLibrary } from "react-native-image-picker"

const InputScreen = () => {
    const [response, setResponse] = useState("")
    const [imgUri, setImgUri] = useState(null)

    const navigation = useNavigation()

    const onSelectImage = async () => {
        launchImageLibrary(
            {
                mediaType: "photo",
                maxWidth: 1080,
                maxHeight: 1080,
                includeBase64: true
            },
            (response) => {
                console.log(response)

                if (response.didCancel) {
                    Alert.alert("사진 선택 취소")
                    return
                } else if (response.errorCode) {
                    console.log("Image Error:", response.errorCode)
                    Alert.alert("사진 오류:", response.errorMessage)
                }

                setResponse(response)
                // setImgUri(response.assets[0].base64)
                setImgUri(response.assets[0].uri)
                console.log("이미지 URI :::: ", imgUri)
            }
        )
    }

    const uploadImage = () => {
        if (imgUri) {
            navigation.navigate("다운로드화면", { imgUri })
        }
        else {
            Alert.alert("사진을 선택해주세요.")
        }
    }

    const delImage = () => {
        if (imgUri) {
            setImgUri(null)
        }
        else {
            Alert.alert("선택된 사진이 없습니다.")
        }
    }

    return (
        <SafeAreaView>
            <View>
                {
                    imgUri ? (
                        <Image
                            // source={response ? { uri: response.assets[0].uri } : 0}
                            source={{ uri: imgUri }}
                            style={{
                                height: 300,
                                width: 300,
                                marginTop: 20,
                                marginBottom: 20,
                                alignSelf: 'center',
                            }}
                        />
                    ) : (
                        <Text>불러온 이미지가 존재하지 않습니다.</Text>
                    )
                }
            </View>

            <View>
                <TouchableOpacity onPress={() => onSelectImage()}>
                    <Text>이미지 불러오기</Text>
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity onPress={() => delImage()}>
                    <Text>선택 취소하기</Text>
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity onPress={() => uploadImage()}>
                    <Text>이미지 업로드하기</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default InputScreen