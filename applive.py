from flask import Flask, Response, request, jsonify
import cv2
import face_recognition
import os
import base64
import time

app = Flask(__name__)

UPLOAD_FOLDER = 'gallery'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

recording = False
frames = []

reference_image_paths = [
    "C:\\Users\\wusem\\Desktop\\Teemo\\me.jpg",
]

reference_encodings = []

print("기준 이미지 인코딩 값 추출 시작")
for reference_image_path in reference_image_paths:
    reference_image = cv2.imread(reference_image_path)
    if reference_image is None:
        print(f"이미지를 불러올 수 없습니다: {reference_image_path}")
        continue
    reference_face_locations = face_recognition.face_locations(reference_image, model='cnn')
    reference_face_encodings = face_recognition.face_encodings(reference_image, reference_face_locations)
    reference_encodings.extend(reference_face_encodings)
print("기준 이미지 인코딩 값 추출 끝")

def generate_frames():
    global recording, frames
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FPS, 24)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        group_face_locations = face_recognition.face_locations(frame, model='cnn')
        group_face_encodings = face_recognition.face_encodings(frame, group_face_locations)

        for i, group_encoding in enumerate(group_face_encodings):
            (top, right, bottom, left) = group_face_locations[i]
            distances = [face_recognition.face_distance([ref_encoding], group_encoding)[0] for ref_encoding in reference_encodings]
            print(f"인덱스: {i+1}, 거리: {distances}")

            if all(distance >= 0.44 for distance in distances):
                face = frame[top:bottom, left:right]
                face = cv2.GaussianBlur(face, (99, 99), 20)
                frame[top:bottom, left:right] = face
            else:
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        if recording:
            frames.append(frame)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

def save_video(frames):
    height, width, _ = frames[0].shape
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(os.path.join(UPLOAD_FOLDER, 'mosaic.avi'), fourcc, 20.0, (width, height))
    
    for frame in frames:
        out.write(frame)
    
    out.release()
    print("비디오 저장 성공적")

@app.route('/')
def home():
    return "Flask 서버가 실행 중입니다!"

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/capture', methods=['POST'])
def capture():
    try:
        print("촬영 요청을 받았습니다")
        cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        ret, frame = cap.read()
        if ret:
            group_face_locations = face_recognition.face_locations(frame, model='cnn')
            for (top, right, bottom, left) in group_face_locations:
                face = frame[top:bottom, left:right]
                face = cv2.GaussianBlur(face, (99, 99), 30)
                frame[top:bottom, left:right] = face

            ret, buffer = cv2.imencode('.jpg', frame)
            if ret:
                frame_bytes = buffer.tobytes()
                frame_base64 = base64.b64encode(frame_bytes).decode('utf-8')
                filename = os.path.join(UPLOAD_FOLDER, f'captured_picture_{time.strftime("%Y%m%d_%H%M%S")}.jpg') # 시간 형식으로 저장됨
                with open(filename, 'wb') as f:
                    f.write(frame_bytes)
                print("프레임이 촬영되고 저장되었습니다")
                return jsonify({'frame': frame_base64})
            else:
                print("프레임 인코딩에 실패했습니다")
                return '프레임 촬영에 실패했습니다'
        else:
            print("웹캠에서 프레임을 읽는 데 실패했습니다")
            return '프레임 촬영에 실패했습니다'
    except Exception as e:
        print(f"사진 촬영 중 오류 발생: {e}")
        return str(e)

@app.route('/start_recording', methods=['POST'])
def start_recording():
    global recording
    print("녹화 시작 요청 수신")
    recording = True
    return "Recording started", 200

@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    global recording
    print("녹화 중지 요청 수신")
    recording = False
    save_video(frames)
    frames.clear()
    return "Recording stopped", 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5050)