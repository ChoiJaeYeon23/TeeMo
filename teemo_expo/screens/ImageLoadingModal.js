import { Modal, Text, StyleSheet, Image, View } from "react-native"

const ImageLoadingModal = ({ visible }) => {
    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={visible}
        >
            <View style={styles.modalBackground}>
                <Image source={require("../images/sand_timer.gif")} style={styles.image} />
            </View>
        </Modal>
    )
}

export default ImageLoadingModal

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000020',
    },
    image: {
        width: "30%",
        height: "30%"
    }
})