import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const RealTimeMosaic = () => {
    const webviewRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
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

    const toggleRecording = async () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
        setIsRecording(prevState => !prevState);
    };

    const startRecording = async () => {
        webviewRef.current.injectJavaScript(`
            (function() {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                        .then(function(stream) {
                            window.localStream = stream;
                            const video = document.querySelector('video');
                            video.srcObject = stream;
                            window.mediaRecorder = new MediaRecorder(stream);
                            window.mediaRecorder.start();
                            window.recordedChunks = [];
                            window.mediaRecorder.ondataavailable = function(e) {
                                window.recordedChunks.push(e.data);
                            };
                            alert('Recording started');
                        })
                        .catch(function(err) {
                            alert('Error accessing media devices: ' + err.message);
                        });
                } else {
                    alert('getUserMedia not supported on your browser!');
                }
            })();
        `);
    };

    const stopRecording = () => {
        webviewRef.current.injectJavaScript(`
            (function() {
                if (window.mediaRecorder && window.mediaRecorder.state !== 'inactive') {
                    window.mediaRecorder.stop();
                    window.localStream.getTracks().forEach(track => track.stop());
                    const blob = new Blob(window.recordedChunks, { type: 'video/webm' });
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        const base64data = reader.result;
                        window.ReactNativeWebView.postMessage(base64data);
                    };
                    reader.readAsDataURL(blob);
                    alert('Recording stopped');
                }
            })();
        `);
    };

    const handleMessage = async (event) => {
        const base64Data = event.nativeEvent.data.split(',')[1];
        const fileUri = FileSystem.documentDirectory + 'recorded_video.webm';

        await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('Expo', asset, false);

        Alert.alert('Video saved', `Saved to ${asset.uri}`);
    };

    return (
        <View style={styles.container}>
            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={{ uri: 'http://192.168.0.25:5050/video' }}
                style={styles.webview}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={handleMessage}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={toggleRecording} style={styles.recordButton}>
                    <Ionicons name={isRecording ? 'stop' : 'play'} size={35} color="#FFFFFF90" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RealTimeMosaic;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    recordButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
    },
});