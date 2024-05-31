import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';

const CustomProgressBar = ({ currentStep }) => {
    const progressWidth = useSharedValue(0);

    useEffect(() => {
        progressWidth.value = withTiming((currentStep / 4) * 100, { duration: 500 }); // 4단계 기준으로 width 계산
    }, [currentStep]);

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progressWidth.value / 100,
            [0, 1],
            ['#66CDAA', '#66CDAA']
        );

        return {
            width: `${progressWidth.value}%`,
            backgroundColor,
        };
    });

    const getStepText = (step) => {
        switch (step) {
            case 1:
                return "시작하기";
            case 2:
                return "인물추가";
            case 3:
                return "제작하기";
            case 4:
                return "결과보기";
            default:
                return "";
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.progressBar, animatedStyle]} />
            <View style={styles.stepContainer}>
                {[1, 2, 3, 4].map((step) => (
                    <View key={step} style={styles.step}>
                        <Text style={[
                            styles.stepText,
                            currentStep === step && styles.currentStepText // 현재 단계에 포인트 색상 적용
                        ]}>
                            {getStepText(step)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "90%",
        height: "6%",
        marginTop: "5%",
        borderRadius: 50,
        backgroundColor: '#eeeeee',
        overflow: 'hidden',
        justifyContent: 'center',
    },
    progressBar: {
        position: 'absolute',
        height: '100%',
        borderRadius: 50,
    },
    stepContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        paddingHorizontal: 10,
    },
    step: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "20%",
        height: "100%",
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    stepText: {
        fontSize: "15%",
        color: '#999999',
        fontWeight: 'bold',
    },
    currentStepText: {
        fontSize: "18%",
        color: '#FFFF00',
        fontWeight: "bold"
    }
});

export default CustomProgressBar