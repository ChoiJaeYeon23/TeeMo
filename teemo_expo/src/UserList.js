import { useEffect, useRef, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"

const UserList = (props) => {
    const [isPressed, setIsPressed] = useState(new Array(props.user.length).fill(false))
    const scaleValues = useRef(props.user.map(() => new Animated.Value(1))).current

    useEffect(() => {
        // 배열의 길이가 변경될 때마다 scaleValues 업데이트
        scaleValues.push(new Animated.Value(1))
    }, [props.user.length])

    /**
     * 아이템을 눌렀을 때 onPressIn 애니메이션
     */
    const startPressAnimation = (index) => {
        setIsPressed((prevState) => {
            const newState = [...prevState]
            newState[index] = true
            return newState
        })

        Animated.timing(scaleValues[index], {
            toValue: 0.9,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    /**
     * 아이템을 눌렀을 때 onPressOut 애니메이션
     */
    const endPressAnimation = (index) => {
        setIsPressed((prevState) => {
            const newState = [...prevState]
            newState[index] = false
            return newState
        })

        Animated.timing(scaleValues[index], {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    return (
        props.user.map((item, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => props.deleteUser(index)}
                onPressIn={() => startPressAnimation(index)}
                onPressOut={() => endPressAnimation(index)}
                style={[styles.itemContainer, { transform: [{ scale: scaleValues[index] }] }]}
                activeOpacity={1}
            >
                { /* "ㅇ번 - ㅇㅇㅇ" 의 형태로 출력됩니다. 추후 변경 예정 */ }
                <Text style={styles.text}>{index + 1}번 - {item}</Text>
            </TouchableOpacity>
        ))
    )
}

export default UserList

const styles = StyleSheet.create({
    itemContainer: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        paddingVertical: 20,
        paddingLeft: 30,
        marginBottom: 20,
        marginTop: 10,
        borderRadius: 40,
        // IOS 그림자 추가
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        // Android 그림자 추가
        elevation: 3
    },
    text: {
        fontSize: 26
    }
})