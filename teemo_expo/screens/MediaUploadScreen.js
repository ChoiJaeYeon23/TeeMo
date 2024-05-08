import { useRef, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    ScrollView,
    Alert,
    Animated
} from "react-native"
import MediaDisplay from "./MediaDisplay"
import * as ImagePicker from "expo-image-picker"

const { width } = Dimensions.get("window")

/**
 * 사진과 동영상 파일을 업로드하는 화면입니다.
 */
const MediaUploadScreen = () => {
    const [mediaType, setMediaType] = useState("PHOTO") // 미디어 타입 PHOTO(사진) 또는 VIDEO(동영상), 기본 값은 PHOTO로 초기화
    const [mediaUri, setMediaUri] = useState("")    // 결과물 미디어(사진 or 동영상)의 URI
    // const [resultPhoto, setResultPhoto] = useState("")  // 결과물 사진의 URI
    // const [resultVideo, setResultVideo] = useState("")  // 결과물 동영상의 URI
    const [recogFaceObj, setRecogFaceObj] = useState([])    // 탐지된 얼굴 객체의 이미지 URI를 초기화할 배열

    const temp = [
        require("../images/front.jpg"),
        require("../images/top.jpg"),
        require("../images/bottom.jpg"),
        require("../images/left.jpg"),
        require("../images/right.jpg")
    ]
    const [selectedFaceObj, setSelectedFaceObj] = useState(Array(temp.length).fill(false))  // 선택된 얼굴 객체 이미지의 인덱스값을 초기화할 배열
    const animation = useRef(new Animated.Value(1)).current

    /**
     * 하단 가로 스크롤 뷰에 렌더링할 이미지
     * 추후 탐지된 얼굴 객체의 이미지 URI 배열을 recogFaceObj에서 받아 map으로 감싸기!!!!
     */
    const renderImages = () => {
        return temp.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => selectFaceObj(index)}>
                <Image source={image} style={styles.thumbnail} />
            </TouchableOpacity>
        ))
    }

    const selectFaceObj = (index) => {
        console.log(`클릭한 얼굴 객체 이미지의 인덱스: ${index}`)
        const updatedSelection = [...selectedFaceObj]
        updatedSelection[index] = !updatedSelection[index]
        setSelectedFaceObj(updatedSelection)

        console.log(selectedFaceObj)
        Animated.timing(animation, {
            toValue: updatedSelection[index] ? 1 : 0.5,
            duration: 300,
            useNativeDriver: true
        }).start()
    }

    // 갤러리에서 사진을 선택합니다
    const pickPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,   // 선택 시 편집 여부
            allowsMultipleSelection: false, // 선택 여러 개 여부
            selectionLimit: 1,  // 선택 개수 제한(숫자 형식, 지금은 1개)
            quality: 1, // 품질 (0~1까지의 값)
            exif: false,    // 메타데이터 포함 여부
        })

        console.log(result)

        if (!result.canceled) {
            setMediaType("PHOTO")
            setMediaUri(result.assets[0].uri)
        } else {
            Alert.alert("사진 선택이 취소되었습니다.")
        }
    }

    // 갤러리에서 동영상을 선택합니다
    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,   // 선택 시 편집 여부
            allowsMultipleSelection: false, // 선택 여러 개 여부
            selectionLimit: 1,  // 선택 개수 제한(숫자 형식, 지금은 1개)
            quality: 1, // 품질 (0~1까지의 값)
            exif: false,    // 메타데이터 포함 여부
        })

        console.log(result)

        if (!result.canceled) {
            setMediaType("VIDEO")
            setMediaUri(result.assets[0].uri)
        } else {
            Alert.alert("동영상 선택이 취소되었습니다.")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>사진/동영상 업로드 화면</Text>
            </View>

            <View style={styles.previewContainer}>
                <MediaDisplay mediaType={mediaType} mediaUri={mediaUri} />
            </View>

            <View style={styles.scrollContainer}>
                <ScrollView
                    showsHorizontalScrollIndicator={true}
                    horizontal
                >
                    {
                        renderImages()
                    }
                </ScrollView>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={() => pickPhoto()}>
                    <Text style={styles.uploadText}>사진 업로드</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadButton} onPress={() => pickVideo()}>
                    <Text style={styles.uploadText}>동영상 업로드</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default MediaUploadScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    titleContainer: {
        marginTop: 15
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 20
    },
    previewContainer: {
        width: width - 40,
        height: 600,
        borderWidth: 1,
        borderColor: "#333333",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 5
    },
    scrollContainer: {
        backgroundColor: "red",
        height: 55,
        width: width - 40
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderRadius: 5,
        marginVertical: 20,
        paddingHorizontal: 20
    },
    uploadButton: {
        backgroundColor: "#87CEFA",
        paddingVertical: 20,
        paddingHorizontal: 30,
        marginHorizontal: 25,
        borderRadius: 25
    },
    uploadText: {
        color: "#333333",
        fontWeight: "bold",
        fontSize: 18
    },
    thumbnail: {
        width: 50,
        height: 50,
        resizeMode: "cover",
        marginHorizontal: 5
    },
    media: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    }
})