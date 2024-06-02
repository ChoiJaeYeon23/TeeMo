import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Local_Server } from '@env'

const RealTimeMosaic = () => {
    const webviewRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        if (isRecording) {
            startRecording();
        }
    }, [isRecording]); // isRecording이 변경될 때마다 실행

    const toggleRecording = async () => {
        if (!isRecording) {
            await startRecording();
        } else {
            await stopRecording();
        }
        setIsRecording(prevState => !prevState);
    };

    const startRecording = async () => {
        console.log('녹화 시작');

        // 서버에 녹화 시작 요청 보내기
        try {
            console.log('서버에 요청 보내기 시작');
            const response = await fetch(`${Local_Server}/start_recording`, {
                method: 'POST',
            });
            console.log('서버 응답 수신:', response);
            if (response.ok) {
                Alert.alert('녹화 시작 요청 성공', '서버에 녹화 시작 요청을 성공적으로 보냈습니다.');
                startCapturingFrames();
            } else {
                Alert.alert('녹화 시작 요청 실패', '서버에 녹화 시작 요청을 보내는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('녹화 시작 요청 오류:', error);
            Alert.alert('녹화 시작 요청 오류', error.message);
        }
    };

    const stopRecording = async () => {
        console.log('녹화 중지');

        // 서버에 녹화 중지 요청 보내기
        try {
            console.log('서버에 요청 보내기 시작');
            const response = await fetch(`${Local_Server}/stop_recording`, {
                method: 'POST',
            });
            console.log('서버 응답 수신:', response);
            if (response.ok) {
                Alert.alert('녹화 중지 요청 성공', '서버에 녹화 중지 요청을 성공적으로 보냈습니다.');
                stopCapturingFrames();
            } else {
                Alert.alert('녹화 중지 요청 실패', '서버에 녹화 중지 요청을 보내는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('녹화 중지 요청 오류:', error);
            Alert.alert('녹화 중지 요청 오류', error.message);
        }
    };

    const startCapturingFrames = () => {
        const id = setInterval(() => {
            webviewRef.current.postMessage('captureFrame');
        }, 1000 / 30); // 30 FPS
        setIntervalId(id);
    };

    const stopCapturingFrames = () => {
        clearInterval(intervalId);
    };

    const capturePhoto = async () => {
        setIsCapturing(true);
        console.log("촬영 요청 보내는 중");
        try {
            const response = await fetch(`${Local_Server}/capture`, {
                method: 'POST',
            });
            if (response.ok) {
                console.log("촬영 응답을 받았습니다.");
                const data = await response.json();
                const frameData = data.frame;
                console.log('프레임이 성공적으로 촬영되었습니다.');
                Alert.alert('사진 촬영 성공', '사진이 촬영되었습니다.');
            } else {
                console.error('프레임 촬영에 실패했습니다.');
                Alert.alert('사진 촬영 실패', '사진 촬영에 실패했습니다.');
            }
        } catch (error) {
            console.error('프레임 촬영 중 오류 발생:', error);
            Alert.alert('사진 촬영 오류', error.message);
        }
        setIsCapturing(false);
    };

    const handleMessage = async (event) => {
        if (webviewRef.current) {
            const message = event.nativeEvent.data;
            if (message === 'frameCaptured') {
                // 프레임이 캡처되었을 때 서버에 업로드하는 로직
                webviewRef.current.postMessage('captureFrame');
            }
        } else {
            console.warn('웹뷰가 아직 로드되지 않았습니다.');
        }
    };

    return (
        <View style={styles.container}>
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
                    <Ionicons name={isRecording ? 'stop' : 'play'} size={35} color="#FFFFFF90" />
                </TouchableOpacity>
                <TouchableOpacity onPress={capturePhoto} style={styles.captureButton}>
                    <Ionicons name="camera" size={35} color="#FFFFFF90" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RealTimeMosaic;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    recordButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    captureButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
});