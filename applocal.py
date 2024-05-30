from flask import Flask, request, jsonify, send_file
import cv2
import face_recognition
import numpy as np
import time
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route('/process_images', methods=['POST'])
def process_images():
    start_time = time.time()
    print("시작시작시작시작")

    reference_files = request.files.getlist('reference_images')
    reference_encodings = []

    for reference_file in reference_files:
        reference_image = face_recognition.load_image_file(reference_file)
        reference_face_locations = face_recognition.face_locations(reference_image,model='cnn')
        reference_face_encodings = face_recognition.face_encodings(reference_image, reference_face_locations)
        reference_encodings.extend(reference_face_encodings)

    group_file = request.files['group_image']
    group_image = face_recognition.load_image_file(group_file)
    group_face_locations = face_recognition.face_locations(group_image,model='cnn')
    group_face_encodings = face_recognition.face_encodings(group_image, group_face_locations)

    unblurred_count = 0

    for i, group_encoding in enumerate(group_face_encodings):
        label = ''
        (top, right, bottom, left) = group_face_locations[i]

        distances = [face_recognition.face_distance([ref_encoding], group_encoding)[0] for ref_encoding in reference_encodings]
        print(f'인덱스 : {i+1}, 거리: {distances}')

        if all(distance >= 0.4 for distance in distances):
            face = group_image[top:bottom, left:right]
            face = cv2.GaussianBlur(face, (99, 99), 30)
            group_image[top:bottom, left:right] = face
        else:
            unblurred_count += 1
            for j, distance in enumerate(distances):
                if distance < 0.4:
                    if j == 0:
                        label += 'haneul'
                    elif j == 1:
                        label += 'suji'
                    elif j == 2:
                        label += 'jiyeon'
                    elif j == 3:
                        label += 'jaeyeon'

            cv2.rectangle(group_image, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.putText(group_image, label, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    end_time = time.time()

    print(f"시작 시간: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time))}")
    print(f"끝 시간: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time))}")
    print(f"총 실행 시간: {end_time - start_time:.2f} 초")
    print(f"모자이크 처리 안 한 사람 수: {unblurred_count}")

    result_image_path = 'result.jpg'
    cv2.imwrite(result_image_path, cv2.cvtColor(group_image, cv2.COLOR_RGB2BGR))

    return send_file(result_image_path, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
