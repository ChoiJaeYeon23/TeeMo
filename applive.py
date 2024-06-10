import cv2
import face_recognition
from flask import Flask, Response, jsonify
from flask_cors import CORS
import base64
import time
import datetime

app = Flask(__name__)
CORS(app)

recording = False
take_picture = False
frames = []

print("기준 이미지 인코딩 값 추출 시작")
reference_image_paths = [
    "C:\\Users\\wusem\\Desktop\\Teemo\\me.jpg"    
]

reference_encodings = []

for reference_image_path in reference_image_paths:
    reference_image = cv2.imread(reference_image_path)
    if reference_image is None:
        print(f"이미지를 불러올 수 없습니다: {reference_image_path}")
        continue
    reference_face_locations = face_recognition.face_locations(reference_image)  # 성능이 중요하다면 model='cnn' 추가
    reference_face_encodings = face_recognition.face_encodings(reference_image, reference_face_locations,model='cnn')
    reference_encodings.extend(reference_face_encodings)

print("기준 이미지 인코딩 값 추출 끝")

def generate_frames():
    global recording, take_picture, frames
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)  # DirectShow를 사용하도록 설정
    cap.set(cv2.CAP_PROP_FPS, 24)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        group_face_locations = face_recognition.face_locations(frame)
        group_face_encodings = face_recognition.face_encodings(frame, group_face_locations, model='cnn')

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
            timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
            print(timestamp)
            frames.append(frame.copy())

        if take_picture:
            save_photo(frame)
            take_picture = False
            
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    cap.release()

def save_video(frames):
    height, width, _= frames[0].shape
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    output_video_path = 'live_viedo_result.mp4'
    out = cv2.VideoWriter(output_video_path, fourcc, 20.0, (width, height))

    for frame in frames:
        out.write(frame)
    
    out.release()
    print('실시간 모자이크 영상을 저장했습니다.')

def save_photo(frame):
    frame_bytes = cv2.imencode('.jpg', frame)[1].tobytes()
    frame_base64 = base64.b64encode(frame_bytes).decode('utf-8')
    out_photo_path = f"live_result_photo_{time.strftime('%Y%m%d_%H%M%S')}.jpg"
    with open(out_photo_path, 'wb') as f:
        f.write(frame_bytes)
    print('실시간 모자이크 사진 촬영 및 저장에 성공했습니다.')
    return "Saving Photo Success", 200

@app.route('/')
def home():
    return "Flask 서버가 실행 중입니다!"

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/capture', methods=['POST'])
def capture():
    global take_picture
    take_picture = True
    return "Picture capture requested", 200

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