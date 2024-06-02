import { Modal, StyleSheet, ActivityIndicator, View } from "react-native"

const LoadingModal = ({ visible }) => {
    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={visible}
        >
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </View>
        </Modal>
    )
}

export default LoadingModal

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000020',
    },
    activityIndicatorWrapper: {
        height: "30%",
        width: "30%",
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
})