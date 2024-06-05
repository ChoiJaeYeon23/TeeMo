import cv2
import face_recognition
from flask import Flask, Response

app = Flask(__name__)

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
             
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def home():
    return "Flask 서버가 실행 중입니다!"

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5050)