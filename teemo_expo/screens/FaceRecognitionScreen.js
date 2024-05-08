import { useRef, useState, useCallback } from "react"
import { SafeAreaView, View, StyleSheet, Text, Image, TouchableOpacity } from "react-native"
import { Camera, CameraType } from "expo-camera"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

/**
 * 모자이크 처리하지 않을 인물의 얼굴 사진을 촬영하는 화면입니다.
 */
const FaceRecognitionScreen = ({ route }) => {
    // UserListScreen 에서 전달받은 식별 인물 이름과 식별 인물을 추가하는 함수 초기화
    const { userName, addUserHandler } = route.params
    
    const cameraType = CameraType.front
    const cameraRef = useRef(null)
    
    const navigation = useNavigation()

    // 정면, 상, 하, 좌, 우 이미지 uri
    const front = "../images/front.jpg"
    const top = "../images/top.jpg"
    const bottom = "../images/bottom.jpg"
    const left = "../images/left.jpg"
    const right = "../images/right.jpg"

    // 사용자가 찍은 정면, 상, 하, 좌, 우 사진 set
    const [frontFace, setFrontFace] = useState(null)
    const [topFace, setTopFace] = useState(null)
    const [bottomFace, setBottomFace] = useState(null)
    const [leftFace, setLeftFace] = useState(null)
    const [rightFace, setRightFace] = useState(null)

    /**
     * 사진을 업로드합니다.
     * 서버로 업로드하는 로직 필요
     */
    const uploadHandler = useCallback(() => {
        console.log("사진을 업로드합니다.")
        // 리스트 추가 함수 호출
        addUserHandler(userName)
        navigation.goBack()
    }, [userName, addUserHandler, navigation])

    return (
        <SafeAreaView style={containers.container}>
            <View style={containers.titleContainer}>
                <Text style={texts.title}>사용자 인식</Text>
            </View>

            <View style={containers.cameraContainer}>
                <Camera
                    ref={cameraRef}
                    type={cameraType}
                    style={containers.camera}
                />
            </View>

            <View style={containers.guideTxtContainer}>
                <Text style={texts.guide}>얼굴 위치를 프레임에 맞춰주세요</Text>
            </View>

            <View style={containers.guideImgContainer}>
                {/* 정면 */}
                <View style={containers.boxContainer}>
                    <TouchableOpacity>
                        {
                            !frontFace ? (
                                <Image source={require(front)} style={contents.box} />
                            ) : (
                                <Image />
                            )
                        }
                    </TouchableOpacity>
                </View>
                {/* 상 */}
                <View style={containers.boxContainer}>
                    <TouchableOpacity>
                        {
                            !topFace ? (
                                <Image source={require(top)} style={contents.box} />
                            ) : (
                                <Image />
                            )
                        }
                    </TouchableOpacity>
                </View>
                {/* 하 */}
                <View style={containers.boxContainer}>
                    <TouchableOpacity>
                        {
                            !bottomFace ? (
                                <Image source={require(bottom)} style={contents.box} />
                            ) : (
                                <Image />
                            )
                        }
                    </TouchableOpacity>
                </View>
                {/* 좌 */}
                <View style={containers.boxContainer}>
                    <TouchableOpacity>
                        {
                            !leftFace ? (
                                <Image source={require(left)} style={contents.box} />
                            ) : (
                                <Image />
                            )
                        }
                    </TouchableOpacity>
                </View>
                {/* 우 */}
                <View>
                    <TouchableOpacity>
                        {
                            !rightFace ? (
                                <Image source={require(right)} style={contents.box} />
                            ) : (
                                <Image />
                            )
                        }
                    </TouchableOpacity>
                </View>
            </View>

            <View style={containers.buttonContainer}>
                <TouchableOpacity style={containers.upload} onPress={() => uploadHandler()}>
                    <Feather name="upload" size={40} color="#333333" />
                    <Text style={texts.upload}>업로드</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default FaceRecognitionScreen

const containers = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    titleContainer: {
        padding: 30
    },
    guideTxtContainer: {
        padding: 20
    },
    guideImgContainer: {
        flexDirection: "row",
    },
    boxContainer: {
        paddingRight: 10
    },
    cameraContainer: {
        alignItems: "center",
        width: "100%",
        height: "50%"
    },
    camera: {
        flex: 1,
        aspectRatio: 1,
        width: "100%"
    },
    buttonContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    upload: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})

const texts = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#333333"
    },
    guide: {
        fontSize: 22,
        fontWeight: "600",
        color: "red"
    },
    upload: {
        fontSize: 22,
        color: "#333333",
        paddingTop: 5
    }
})

const contents = StyleSheet.create({
    box: {
        width: 60,
        height: 60,
    }
})