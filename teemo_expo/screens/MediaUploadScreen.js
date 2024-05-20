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
import { Entypo, Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

/**
 * 사진과 동영상 파일을 업로드하는 화면입니다.
 */
const MediaUploadScreen = () => {
    const [mediaType, setMediaType] = useState("PHOTO") // 미디어 타입 PHOTO(사진) 또는 VIDEO(동영상), 기본 값은 PHOTO로 초기화
    const [media, setMedia] = useState({
        fileName: "",
        height: "",
        width: "",
        mimeType: "",
        type: "",
        duration: "",
        uri: ""
    })
    const [mediaUri, setMediaUri] = useState("")    // 결과물 미디어(사진 or 동영상)의 URI
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

    const navigation = useNavigation()

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

        setMedia({
            fileName: result.assets[0].fileName,
            height: result.assets[0].height,
            width: result.assets[0].width,
            mimeType: result.assets[0].mimeType,    // 미디어 유형/타입 (ex. video/mp4)
            type: result.assets[0].type,    // 미디어 타입 (ex. jpg)
            duration: result.assets[0].duration,    // 동영상 재생시간
            uri: result.assets[0].uri
        })

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

        // 선택한 미디어(사진, 동영상)의 정보를 저장
        setMedia({
            fileName: result.assets[0].fileName,
            height: result.assets[0].height,
            width: result.assets[0].width,
            mimeType: result.assets[0].mimeType,    // 미디어 유형/타입 (ex. video/mp4)
            type: result.assets[0].type,    // 미디어 타입 (ex. jpg)
            duration: result.assets[0].duration,    // 동영상 재생시간 (사진의 경우 null)
            uri: result.assets[0].uri
        })

        if (!result.canceled) {
            setMediaType("VIDEO")
            setMediaUri(result.assets[0].uri)
        } else {
            Alert.alert("동영상 선택이 취소되었습니다.")
        }
    }

    /**
     * 서버로 미디어(사진, 동영상) 업로드를 요청하는 함수입니다.
     */
    const uploadMedia = () => {
        fetch("http://13.209.77.184/api/media_upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(media),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("미디어 업로드 완료!");
                console.log("미디어 업로드 성공함(DB서버)");
            })
            .catch((error) => {
                alert("미디어 업로드 실패: " + error.message);
            });
    }

    /**
     * 미디어에서 인식된 사람들의 얼굴 사진 배열을 서버로부터 불러오는 함수입니다.
     * 사진 URI 배열을 받아와야 합니다.
     */
    const loadImages = async () => {
        try {
            const response = await fetch("http://13.209.77.184/api/load_recog_face");
            const data = await response.json();
            setRecogFaceObj(data);  // 얼굴 객체 배열에 저장합니다. 배열형태가 아닌 경우 배열 형태로 변환 후 저장해야함!
        } catch (error) {
            console.error("얼굴 불러오기 실패:", error);
        }
    };

    /**
     * 서버로 모자이크를 제외할 사람이 선택된 배열을 업로드하는 함수입니다.
     * 사진 URI 배열을 전송합니다.(아니면 배열 인덱스?)
     */
    const uploadSelectedFace = () => {
        fetch("http://13.209.77.184/api/upload_selected_face", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedFaceObj),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("업로드 완료!");
                console.log("업로드성공함(DB서버)");
                navigation.navigate("ResultMediaScreen")
            })
            .catch((error) => {
                alert("업로드 실패: " + error.message);
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>사진/동영상 업로드 화면</Text>
            </View>

            <View style={styles.previewContainer}>
                <MediaDisplay mediaType={mediaType} mediaUri={mediaUri} />
            </View>

            <View style={[styles.scrollContainer, { flexDirection: "row" }]}>
                <ScrollView
                    showsHorizontalScrollIndicator={true}
                    horizontal
                >
                    {
                        renderImages()
                    }
                </ScrollView>
                <TouchableOpacity style={{ marginLeft: "1%" }} onPress={() => uploadSelectedFace()}>
                    <Feather name="check-square" size={30} color="#777777" />
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={() => pickPhoto()}>
                    <Entypo name="image-inverted" size={30} color="#777777" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadButton} onPress={() => pickVideo()}>
                    <Entypo name="video" size={28} color="#777777" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.uploadButton, { marginLeft: "30%" }]} onPress={() => uploadMedia()}>
                    <Feather name="upload" size={24} color="#777777" />
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
        marginTop: "8%"
    },
    title: {
        fontSize: "24%",
        fontWeight: "bold",
        color: "#333333",
        marginBottom: "10%"
    },
    previewContainer: {
        width: width - 40,
        height: "65%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1%"
    },
    scrollContainer: {
        height: "10%",
        width: width - 40,
        justifyContent: "center"
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderRadius: 5,
        marginTop: "7%",
        paddingHorizontal: "20%"
    },
    uploadButton: {
        paddingVertical: "5%",
        paddingHorizontal: "3%",
        marginHorizontal: "20%",
        borderRadius: "100%"
    },
    uploadText: {
        color: "#333333",
        fontWeight: "bold",
        fontSize: "18%"
    },
    thumbnail: {
        width: 70,
        height: 70,
        resizeMode: "cover",
        marginHorizontal: 5
    },
    media: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    }
})