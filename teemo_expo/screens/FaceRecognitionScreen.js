import { useRef, useState, useCallback } from "react"
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
} from "react-native"
import { CameraView } from "expo-camera"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

/**
 * 모자이크 처리하지 않을 인물의 얼굴 사진을 촬영하는 화면입니다.
 */
const FaceRecognitionScreen = ({ route }) => {
    // UserListScreen 에서 전달받은 식별 인물 이름과 식별 인물을 추가하는 함수 초기화
    const { userName, addUserHandler } = route.params

    const cameraType = "front"
    const cameraRef = useRef(null)

    const navigation = useNavigation()

    // 정면, 상, 하, 좌, 우 이미지 uri
    const front = require("../images/front.jpg")
    const top = require("../images/top.jpg")
    const bottom = require("../images/bottom.jpg")
    const left = require("../images/left.jpg")
    const right = require("../images/right.jpg")

    const [images, setImages] = useState({
        front,
        top,
        bottom,
        left,
        right
    })

    // 사용자가 찍은 정면, 상, 하, 좌, 우 사진 URI set
    const [frontFace, setFrontFace] = useState(front)
    const [topFace, setTopFace] = useState(top)
    const [bottomFace, setBottomFace] = useState(bottom)
    const [leftFace, setLeftFace] = useState(left)
    const [rightFace, setRightFace] = useState(right)

    const [currentPosition, setCurrentPosition] = useState("front")

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const uri = await cameraRef.current.takePictureAsync()

                switch (currentPosition) {
                    case "front":
                        setFrontFace(uri)
                        break
                    case "top":
                        setTopFace(uri)
                        break
                    case "bottom":
                        setBottomFace(uri)
                        break
                    case "left":
                        setLeftFace(uri)
                        break
                    case "right":
                        setRightFace(uri)
                        break
                    default:
                        break
                }

                setImages(prevImages => ({
                    ...prevImages,
                    [currentPosition]: uri
                }))
            } catch (error) {
                console.error("사진찍기 오류:", error)
            }
        }
    }

    const switchPosition = useCallback(position => {
        setCurrentPosition(position)
        console.log(`position ${position} 으로 바뀜`)
    }, [])

    /**
     * 서버로 사진을 업로드합니다.
     * 사용자 이름과 얼굴의 정면, 상, 하, 좌, 우 사진 URI를 전송합니다.
     * 서버로 업로드하는 로직 필요
     */
    const uploadHandler = useCallback(() => {
        console.log("사진을 업로드합니다.")

        const faceData = {
            name: userName,
            front: frontFace,
            top: topFace,
            bot: bottomFace,
            left: leftFace,
            right: rightFace
        }

        // 로직 확인을 위해 따로 빼둠
        // 서버랑 디비 연결 되면 밑에 두 줄 지우고 밑에 주석 활성화시키기
        addUserHandler(userName);
        navigation.goBack();
        // fetch("http://13.209.77.184/api/upload_user_face", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(faceData),
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         alert("얼굴 업로드 완료!");
        //         console.log("얼굴 업로드성공함(DB서버)");
        //         addUserHandler(userName);
        //         navigation.goBack();
        //     })
        //     .catch((error) => {
        //         alert("업로드 실패: " + error.message);
        //     });
    }, [userName, addUserHandler, navigation, images])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titleText}>사용자 인식</Text>

            </View>

            <TouchableOpacity style={styles.uploadButton} onPress={() => uploadHandler()}>
                <MaterialIcons name="upload" size={24} color="#555555" />
            </TouchableOpacity>

            <View style={styles.cameraContainer}>
                <CameraView
                    ref={cameraRef}
                    facing={cameraType}
                    style={styles.camera}
                >
                    <Text style={styles.guideText}>얼굴 위치를 프레임에 맞춰주세요</Text>
                    <View style={{ flexDirection: "row", marginBottom: "50%" }}>
                        <Text style={styles.guideLine}>┌</Text>
                        <Text style={styles.guideLine}>┐</Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.guideLine}>└</Text>
                        <Text style={styles.guideLine}>┘</Text>
                    </View>

                </CameraView>
            </View>

            <View style={styles.guideImgContainer}>
                {
                    Object.entries(images).map(([position, image]) => (
                        <TouchableOpacity key={position} onPress={() => switchPosition(position)} style={styles.boxContainer}>
                            <Image source={image} style={styles.box} />
                        </TouchableOpacity>
                    ))
                }
            </View>

            <View style={styles.buttonContainer}>


                <TouchableOpacity style={styles.button} onPress={() => takePicture()}>
                    <MaterialCommunityIcons name="camera-iris" size={65} color="#555555" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default FaceRecognitionScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    header: {
        marginTop: "3%",
        marginBottom: "5%",
        justifyContent: "center",
        alignItems: "center"
    },
    uploadButton: {
        position: "absolute",
        right: "5%",
        top: "7.5%"
    },
    frameContainer: {
        flexDirection: "row",
    },
    guideLine: {
        color: "#FFFFFFBB",
        fontSize: 50,
        marginHorizontal: "25%"
    },
    center: {
        borderRadius: 10,
        width: "70%",
        height: "70%",
        borderWidth: 3,
    },
    guideImgContainer: {
        marginTop: "5%",
        flexDirection: "row",
    },
    boxContainer: {
        paddingRight: 7
    },
    cameraContainer: {
        alignItems: "center",
        width: "100%",
        height: "50%"
    },
    camera: {
        flex: 1,
        aspectRatio: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        flexDirection: "row"
    },
    button: {
        marginHorizontal: 70,
        alignItems: "center",
        justifyContent: "center"
    },
    titleText: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#333333"
    },
    guideText: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: "5%",
        color: "#FFFFFFBB"
    },
    buttonText: {
        fontSize: 18,
        color: "#555555",
        fontWeight: "600",
        paddingTop: 5
    },
    box: {
        width: 70,
        height: 70,
    }
})