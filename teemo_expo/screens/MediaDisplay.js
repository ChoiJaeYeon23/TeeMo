import { Image, Text, StyleSheet } from "react-native"
import { Video } from "expo-av"

const MediaDisplay = (props) => {
    return (
        props.mediaType === "PHOTO" ? (
            props.mediaUri != "" ? (
                <Image
                    source={{ uri: props.mediaUri }}
                    style={styles.media}
                    resizeMode="contain"
                />
            ) : (
                <Text>불러온 사진이 없습니다.</Text>
            )
        ) : (
            props.mediaUri != "" ? (
                <Video
                    source={{ uri: props.mediaUri }}
                    style={styles.media}
                    shouldPlay={true}
                    useNativeControls={true}
                />
            ) : (
                <Text>불러온 동영상이 없습니다.</Text>
            )
        )
    )
}

const styles = StyleSheet.create({
    media: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },
    text: {
        color: "#333333",
        fontSize: 17
    }
})

export default MediaDisplay