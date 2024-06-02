from flask import Flask, request, jsonify, send_file
import cv2
import face_recognition
import numpy as np
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/process_media', methods=['POST'])
def process_media():
                                    #시작부분
                                    #시작부분
                                    #시작부분
    start_time = time.time()
    print("시작시작시작시작")
                                    #여기부터 밑에줄은 이미지처리
                                    #여기부터 밑에줄은 이미지처리
                                    #여기부터 밑에줄은 이미지처리
    if 'group_image' in request.files:
        # 이미지를 받은 경우
        reference_files = request.files.getlist('reference_images')
        reference_encodings = []

        for reference_file in reference_files:
            reference_image = face_recognition.load_image_file(reference_file)
            reference_face_locations = face_recognition.face_locations(reference_image)
            reference_face_encodings = face_recognition.face_encodings(reference_image, reference_face_locations)
            reference_encodings.extend(reference_face_encodings)

        group_file = request.files['group_image']
        group_image = face_recognition.load_image_file(group_file)
        group_face_locations = face_recognition.face_locations(group_image)
        group_face_encodings = face_recognition.face_encodings(group_image, group_face_locations)

        unblurred_count = 0

        for i, group_encoding in enumerate(group_face_encodings):
            label = ''
            (top, right, bottom, left) = group_face_locations[i]

            distances = [face_recognition.face_distance([ref_encoding], group_encoding)[0] for ref_encoding in reference_encodings]
            print(f'인덱스 : {i+1}, 거리: {distances}')

            if all(distance >= 0.38 for distance in distances):
                face = group_image[top:bottom, left:right]
                face = cv2.GaussianBlur(face, (99, 99), 30)
                group_image[top:bottom, left:right] = face
            else:
                unblurred_count += 1
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
                                    #여기까지 사진처리
                                    #여기까지 사진처리
                                    #여기까지 사진처리


                                    #여기부터 밑에줄은 동영상처리
                                    #여기부터 밑에줄은 동영상처리
                                    #여기부터 밑에줄은 동영상처리
    elif 'group_video' in request.files:
        # 동영상을 받은 경우
        reference_files = request.files.getlist('reference_images')
        reference_encodings = []

        for reference_file in reference_files:
            reference_image = face_recognition.load_image_file(reference_file)
            reference_face_locations = face_recognition.face_locations(reference_image)
            reference_face_encodings = face_recognition.face_encodings(reference_image, reference_face_locations)
            reference_encodings.extend(reference_face_encodings)

        video_file = request.files['group_video']
        video_path = 'uploaded_video.mp4'  # 업로드된 동영상 파일 경로
        video_file.save(video_path)

        # 비디오 캡처 객체 생성
        video_capture = cv2.VideoCapture(video_path)

        # 비디오 속성 가져오기
        frame_width = int(video_capture.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(video_capture.get(cv2.CAP_PROP_FPS))

        # 비디오 파일 저장 설정
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        output_video_path = 'processed_video.mp4'
        out = cv2.VideoWriter(output_video_path, fourcc, fps, (frame_width, frame_height))

        while True:
            ret, frame = video_capture.read()
            if not ret:
                break

            # 프레임에서 얼굴 인식
            group_face_locations = face_recognition.face_locations(frame)
            group_face_encodings = face_recognition.face_encodings(frame, group_face_locations)

            for i, group_encoding in enumerate(group_face_encodings):
                label = ''
                (top, right, bottom, left) = group_face_locations[i]

                # 모든 기준 이미지와의 거리 계산
                distances = [face_recognition.face_distance([ref_encoding], group_encoding)[0] for ref_encoding in reference_encodings]
                print(f'인덱스 : {i+1}, 거리: {distances}')

                # 모든 거리가 0.44보다 큰 경우
                if all(distance >= 0.44 for distance in distances):  
                    # 모자이크 처리
                    face = frame[top:bottom, left:right]
                    face = cv2.GaussianBlur(face, (99, 99), 20)
                    frame[top:bottom, left:right] = face
                else:
                    # 하나라도 0.44보다 작은 경우
                    for j, distance in enumerate(distances):
                        if distance < 0.44:
                            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                            cv2.putText(frame, label, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 2)

            # 결과 비디오에 프레임 저장
            out.write(frame)

            # 'q' 키를 누르면 루프를 종료
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        # 비디오 캡처 객체와 모든 창 닫기
        video_capture.release()
        out.release()
        cv2.destroyAllWindows()

        print('output video saved at:', output_video_path)
        end_time = time.time()

        print(f"시작 시간: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time))}")
        print(f"끝 시간: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time))}")
        print(f"총 실행 시간: {end_time - start_time:.2f} 초")

        return send_file(output_video_path, mimetype='video/mp4')
                                    #여기까지 동영상처리
                                    #여기까지 동영상처리
                                    #여기까지 동영상처리                                        
    else:
        return "미디어 파일 못받음"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)