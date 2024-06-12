import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Local_Server } from '@env'

const RealTimeMosaic = () => {
    const webviewRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);

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

        // 서버에 녹화 시작 요청
        try {
            console.log("녹화 요청 시도")
            const response = await fetch(`http://10.20.39.80:5050/start_recording`, {
                method: "POST"
            });
            console.log("서버 응답 수신:", response);
            if (response.ok) {
                console.log("녹화 시작 요청 성공");
                startCapturingFrames();
            } else {
                console.log("녹화 시작 요청 실패");
            }
        } catch (e) {
            console.error("녹화 시작 요청 오류", e);
        }
        // webviewRef.current.injectJavaScript(`
        //     (function() {
        //         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        //             navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        //                 .then(function(stream) {
        //                     window.localStream = stream;
        //                     const video = document.querySelector('video');
        //                     video.srcObject = stream;
        //                     window.mediaRecorder = new MediaRecorder(stream);
        //                     window.mediaRecorder.start();
        //                     window.recordedChunks = [];
        //                     window.mediaRecorder.ondataavailable = function(e) {
        //                         window.recordedChunks.push(e.data);
        //                     };
        //                     alert('Recording started');
        //                 })
        //                 .catch(function(err) {
        //                     alert('Error accessing media devices: ' + err.message);
        //                 });
        //         } else {
        //             alert('getUserMedia not supported on your browser!');
        //         }
        //     })();
        // `);
    };

    const stopRecording = async () => {
        console.log("녹화 중지");

        // 서버에 녹화 중지 요청
        try {
            console.log("녹화 중지 요청 시도");
            const response = await fetch(`http://10.20.39.80:5050/stop_recording`, {
                method: "POST",
            });
            console.log("서버 응답 수신");
            if (response.ok) {
                console.log("녹화 중지 요청 성공");
                stopCapturingFrames();
            } else {
                console.log("녹화 중지 요청 실패")
            }
        } catch (e) {
            console.log("녹화 중지 요청 오류", e)
        }
        // webviewRef.current.injectJavaScript(`
        //     (function() {
        //         if (window.mediaRecorder && window.mediaRecorder.state !== 'inactive') {
        //             window.mediaRecorder.stop();
        //             window.localStream.getTracks().forEach(track => track.stop());
        //             const blob = new Blob(window.recordedChunks, { type: 'video/webm' });
        //             const reader = new FileReader();
        //             reader.onloadend = function() {
        //                 const base64data = reader.result;
        //                 window.ReactNativeWebView.postMessage(base64data);
        //             };
        //             reader.readAsDataURL(blob);
        //             alert('Recording stopped');
        //         }
        //     })();
        // `);
    };

    const capturePhoto = async () => {
        setIsCapturing(true);
        console.log("촬영 요청 보내는 중");
        try {
            const response = await fetch(`http://10.20.39.80:5050/capture`, {
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
        <View style={styles.container}>
            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={{ uri: `http://10.20.39.80:5050/video` }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={handleMessage} onLoad={() => {
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