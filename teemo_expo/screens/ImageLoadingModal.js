import { Modal, Text, StyleSheet, Image, View } from "react-native"

const ImageLoadingModal = ({ visible }) => {
    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={visible}
        >
            <View style={styles.modalBackground}>
                    <Text style={styles.loadingText}>모자이크 하는 중...</Text>
                    <Image source={require("../images/sand_timer.gif")} style={styles.image} />
            </View>
        </Modal>
    )
}

export default ImageLoadingModal

const styles = StyleSheet.create({
    modalBackground: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: "#00000090",
    },
    image: {
        width: 120,
        height: 120,
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 6 }, // 그림자 오프셋
        shadowOpacity: 1, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    loadingText: {
        fontSize: 23,
        fontWeight: "bold",
        color: '#fff',
        marginBottom: "5%",
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋
        shadowOpacity: 1, // 그림자 투명도
        shadowRadius: 3, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    }
})
