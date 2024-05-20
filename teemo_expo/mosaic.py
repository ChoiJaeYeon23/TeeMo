# pip install Flask flask-socketio eventlet opencv-python-headless numpy aiortc

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import base64
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack, MediaStreamTrack
from aiortc.contrib.media import MediaPlayer, MediaRecorder
import asyncio

# Flask 애플리케이션 초기화
app = Flask(__name__)
socketio = SocketIO(app)

# 얼굴 인식을 위한 Haar Cascade 로드
xml = 'teemo_expo/haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(xml)

# WebRTC 피어 연결 관리
pcs = set()

# 비디오 스트림을 변환하는 클래스 정의 (모자이크 처리)
class VideoTransformTrack(VideoStreamTrack):
    def __init__(self, track):
        super().__init__()
        self.track = track

    async def recv(self):
        frame = await self.track.recv()

        # 프레임을 OpenCV 이미지로 변환
        img = frame.to_ndarray(format="bgr24")

        # 이미지를 그레이스케일로 변환
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 얼굴 감지
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        for (x, y, w, h) in faces:
            face_img = img[y:y+h, x:x+w]
            face_img = cv2.resize(face_img, (0, 0), fx=0.04, fy=0.04)  # 축소
            face_img = cv2.resize(face_img, (w, h), interpolation=cv2.INTER_NEAREST)  # 확대
            img[y:y+h, x:x+w] = face_img  # 인식된 얼굴 영역에 모자이크 처리

        # 다시 프레임으로 변환
        new_frame = VideoFrame.from_ndarray(img, format="bgr24")
        new_frame.pts = frame.pts
        new_frame.time_base = frame.time_base

        return new_frame

# WebRTC Offer 처리 함수
async def offer(pc, offer):
    await pc.setRemoteDescription(offer)
    for t in pc.getTransceivers():
        if t.kind == "video":
            pc.addTrack(VideoTransformTrack(t.receiver.track))
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    return pc.localDescription

# WebSocket 이벤트 처리 (offer 수신 시)
@socketio.on('offer')
async def on_offer(data):
    pc = RTCPeerConnection()
    pcs.add(pc)
    
    # ICE 연결 상태 변경 이벤트 처리
    @pc.on("iceconnectionstatechange")
    async def on_iceconnectionstatechange():
        if pc.iceConnectionState == "failed":
            await pc.close()
            pcs.discard(pc)

    # WebRTC Offer 설정 및 Answer 생성
    offer = RTCSessionDescription(data['sdp'], data['type'])
    answer = await offer(pc, offer)
    emit('answer', {'sdp': answer.sdp, 'type': answer.type})

# 서버 실행
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
