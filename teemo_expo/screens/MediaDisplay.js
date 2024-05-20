import { Image, StyleSheet, ActivityIndicator, Platform } from "react-native"
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
                <ActivityIndicator
                    size={Platform.OS === "ios" ? "large" : 40}
                    animating={props.loading}
                    color="#F2DE00"
                />
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
                <ActivityIndicator
                    size={Platform.OS === "ios" ? "large" : 40}
                    animating={props.loading}
                    color="#F2DE00"
                />
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
        fontSize: "17%"
    }
})

export default MediaDisplay