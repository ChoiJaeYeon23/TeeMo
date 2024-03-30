import { useEffect, useState } from "react"
import { SafeAreaView, View, Image, TouchableOpacity, Text, Alert } from "react-native"
import RNFS from "react-native-fs"

const OutputScreen = ({ route }) => {
    const [img, setImg] = useState(null)
    const imgUri = route.params?.imgUri || null
    const [time, setTime] = useState("/------/--:--:--")

    var timee = "/------/--:--:--"
    const timeSetting = () => {
        const date = new Date()
        const formattedYear = date.getFullYear().toString().slice(-2)
        const formattedDate = `${formattedYear}.${date.getMonth() + 1}.${date.getDate()}`

        const hours = String(date.getHours()).padStart(2, "0")
        const minutes = String(date.getMinutes()).padStart(2, "0")
        const seconds = String(date.getSeconds()).padStart(2, "0")
        const formattedTime = `${hours}:${minutes}:${seconds}`

        // setTime(`/${formattedDate}/${formattedTime}`)
        // console.log("최종 날짜 포맷", time)
        timee = `/${formattedDate}.${formattedTime}`
        console.log("현재시간은:", timee)
    }

    const saveImage = () => {
        timeSetting()

        if (imgUri) {
            RNFS.readFile(imgUri, "base64")
                .then(contents => {
                    const saveTime = timee
                    const savePath = RNFS.PicturesDirectoryPath + `/savedImage.jpg` // 저장할 경로 설정
                    console.log("경로: ", savePath)

                    RNFS.writeFile(savePath, contents, "base64")
                        .then(() => {
                            Alert.alert("이미지 저장 완료", "갤러리에서 이미지를 확인하세염")
                        })
                        .catch(error => {
                            console.log("Save Error:", error.message)
                            Alert.alert("이미지 저장 실패", "이미지 저장하는데 오류 발생함 ~")
                        })
                })
                .catch(error => {
                    console.log("Read Error:", error.message)
                    Alert.alert("이미지 읽기 실패", "이미지 읽는데 오류 발생함 ~")
                })
        } else {
            Alert.alert("이미지 로드 오류", "이미지 로드 안 됨 !!")
        }
    }

    return (
        <SafeAreaView>
            <View>
                {imgUri ? (
                    <Image
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
                    <Text>이미지 로드 오류</Text>
                )}
            </View>
            <TouchableOpacity onPress={() => saveImage()}>
                <Text>저장하기</Text>
            </TouchableOpacity>
            <View>

            </View>
        </SafeAreaView>
    )
}

export default OutputScreen