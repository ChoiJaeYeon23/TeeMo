import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import CustomProgressBar from "./CustomProgressBar"
import { Local_Server } from '@env'
import { useNavigation } from '@react-navigation/native'
import ImageLoadingModal from './ImageLoadingModal'

const RealTimeMosaic = () => {
    const currentStep = 3
    const navigation = useNavigation()
    const webviewRef = useRef(null);
    const [mediaType, setMediaType] = useState("PHOTO");
    const [webviewLoaded, setWebviewLoaded] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        (async () => {
            const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
            if (mediaLibraryStatus !== 'granted') {
                Alert.alert('Media library permission is required to save videos.');
            } else {
                setHasMediaLibraryPermission(true);
            }
        })();
    }, []);

    useEffect(() => {
        if (isRecording) {
            startRecording();
        }
    }, [isRecording])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!webviewLoaded) {
                console.log('The request timed out.');
            }
        }, 30000);

        return () => clearTimeout(timeout);
    }, [webviewLoaded]);

    const toggleRecording = async () => {
        if (!isRecording) {
            await startRecording();
        } else {
            await stopRecording();
        }
        setIsRecording(prevState => !prevState);
    };

    const startRecording = async () => {
        console.log("녹화시작");
        setMediaType("VIDEO")
        try {
            console.log("녹화 요청 시도")
            const response = await fetch(`${Local_Server}/start_recording`, {
                method: "POST",
            });
            console.log("서버 응답 수신:", response);
            if (response.ok) {
                console.log("녹화 시작 요청 성공");
                startCapturingFrames();
            } else {
                console.error(`에러 발생: ${error.message}`);
            }
        } catch (e) {
            console.error("녹화 시작 요청 오류", e);
        }
    };

    const stopRecording = async () => {
        console.log("녹화 중지");
        try {
            console.log("녹화 중지 요청 시도");
            const response = await fetch(`${Local_Server}/stop_recording`, {
                method: "POST",
            });
            console.log("서버 응답 수신");
            if (response.ok) {
                setIsLoading(true);
                console.log("녹화 중지 요청 성공");
                stopCapturingFrames();
                const resultBlob = await response.blob();
                const resultUrl = URL.createObjectURL(resultBlob);
                navigation.navigate("ResultMediaScreen", { mediaType, resultUrl });
                setIsLoading(false);
            } else {
                console.error(`에러 발생: ${error.message}`);
                console.log("녹화 중지 요청 실패")
            }
        } catch (e) {
            console.log("녹화 중지 요청 오류", e)
        }
    };

    const capturePhoto = async () => {
        setMediaType("PHOTO")
        setIsCapturing(true);
        console.log("촬영 요청 보내는 중");
        try {
            const response = await fetch(`${Local_Server}/take_picture`, {
                method: "POST"
            });
            console.log("서버 응답 수신");
            if (response.ok) {
                setIsLoading(true);
                console.log("사진 촬영 및 저장 완료");
                setIsCapturing(false);
                console.log(response);
                const resultBlob = await response.blob();
                const resultUrl = URL.createObjectURL(resultBlob);
                navigation.navigate("ResultMediaScreen", { mediaType, resultUrl });
                setIsLoading(false);
            } else {
                console.error(`에러 발생: ${error.message}`);
            }
        } catch (e) {
            console.log("사진 촬영 오류", e)
        }
    };

    const startCapturingFrames = () => {
        const id = setIntervalId(() => {
            webviewRef.current.postMessage("captureFrame");
        }, 1000 / 30);
        setIntervalId(id);
    }

    const stopCapturingFrames = () => {
        clearInterval(intervalId);
    }

    const handleMessage = async (event) => {
        if (webviewRef.current) {
            const message = event.nativeEvent.data;

            // 프레임이 캡쳐 되면 서버에 업로드
            if (message === 'frameCaptured') {
                webviewRef.current.postMessage('captureFrame');
            } else {
                console.log("웹뷰가 아직 로드되지 않았습니다.");
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressbarWrapper}>
                <CustomProgressBar currentStep={currentStep} />
            </View>

            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={{ uri: `${Local_Server}/video` }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={handleMessage}
                onLoad={() => {
                    // 웹뷰 로드되면 자동으로 비디오 재생
                    webviewRef.current.injectJavaScript(`
                    (function() {
                        const video = document.querySelector('video');
                        video.play();
                    })();
                    `);
                }}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={toggleRecording} style={styles.recordButton}>
                    <Ionicons name={isRecording ? 'stop' : 'play'} size={38} color="#95ce67" />
                </TouchableOpacity>
                <TouchableOpacity onPress={capturePhoto} style={styles.captureButton}>
                    <Ionicons name="camera" size={38} color="#95ce67" />
                </TouchableOpacity>
            </View>
            <ImageLoadingModal visible={isLoading} />
        </SafeAreaView>
    );
};

export default RealTimeMosaic;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    progressbarWrapper: {
        width: "100%",
        height: "8%",
        alignItems: "center",
        justifyContent: "center",
    },
    webview: {
        flex: 1,
        marginVertical: "10%",
        width: '100%',
        height: '40%',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 60,
        marginBottom: "5%",
        flexDirection: 'row',
        alignSelf: 'center',
    },
    recordButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋
        shadowOpacity: 0.25, // 그림자 투명도
        shadowRadius: 2, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
    captureButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 100,
        marginHorizontal: 10,
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋
        shadowOpacity: 0.25, // 그림자 투명도
        shadowRadius: 2, // 그림자 반경
        elevation: 5, // 그림자 높이 (Android용)
    },
});