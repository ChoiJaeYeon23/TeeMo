# [ TeeMo ] 티끌 모자이크

허가되지 않은 인물들의 얼굴을 실시간으로 모자이크 처리할 수 있는 모바일 앱입니다.

사진이나 동영상에서 특정 얼굴을 식별한 후 해당 얼굴 객체에 모자이크 처리한 결과물을 사용자에게 제공하며, 이를 통해 개인 권리 침해 방지와 법적 책임 예방에 대한 효과적인 대응 방안을 제공하고자 합니다.

<br/>

## 목차
* [개요](#개요)
* [기술 스택 및 개발 환경](#기술-스택-및-개발-환경)
* [비인가 인원 모자이크 처리 기술](#비인가-인원-모자이크-처리-기술)
* [결과물](#결과물)

<br/>

## 개요

### 팀 소개

* **최재연** : <wasid4598@naver.com>
* 김지연 : <wusemr2@naver.com>
* 김하늘 : <redlight02@naver.com>
* 민수지 : <tnwl3109@naver.com>

<br/>

### 프로젝트 소개

* 프로젝트 명
  - **비인가 인원 모자이크 처리** 기술을 적용한 모바일 애플리케이션
  - Mobile Application with **Mosaic Processing** by **Unauthorized Objects**
 
* 프로젝트 기간
  - 2024.03 ~ 2024.06

* 프로젝트 목표
  - **촬영 대상**<sup> 인가 인원 </sup>의 각 얼굴을 정확하게 식별합니다.
  - **미디어 파일**<sup> 사진, 동영상 </sup>업로드 시 등장하는 모든 인원의 얼굴이 식별되며,
    **모자이크를 적용하지 않을 사람들**<sup> 촬영 대상(=인가 인원) </sup>을 선택할 수 있습니다.
  - 실시간 촬영 시 **촬영 대상 외의 인물**<sup> 비인가 인원 </sup>의 얼굴에 모자이크 처리가 실시간으로 적용됩니다.
    
<br/>

## 기술 스택 및 개발 환경

### Environment

![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
<br/>
[![NVIDIA GTX 1660](https://img.shields.io/badge/nVIDIA%20GTX%201660-%2376B900.svg?style=for-the-badge&logo=nVIDIA&logoColor=white)](https://www.nvidia.com/)
<br/>
![CMake](https://img.shields.io/badge/CMake-%23008FBA.svg?style=for-the-badge&logo=cmake&logoColor=white)
![nVIDIA](https://img.shields.io/badge/cuda-000000.svg?style=for-the-badge&logo=nVIDIA&logoColor=green)
![cuDNN](https://img.shields.io/badge/cuDNN-FF3D00?style=for-the-badge&logo=nVIDIA&logoColor=white)


### Development

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
<br/>
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

### Libarary

![dlib](https://img.shields.io/badge/dlib-5C8BF5?style=for-the-badge&logo=dlib&logoColor=white)
![face_recognition](https://img.shields.io/badge/face_recognition-8C3B3B?style=for-the-badge&logo=python&logoColor=white)

### Communication
![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)

### Versions

| 기술 / 환경          | 버전         |
|-------------------|-------------|
| **OS**            | Windows 10  |
| **Python**        | 3.8.12      |
| **CMake**         | 3.29.3      |
| **dlib**          | 19.24.99    |
| **face_recognition** | 1.3.0    |
| **CUDA**          | 10.2        |
| **cuDNN**         | 8.7.0       |
| **GPU**           | GTX 1660    |
| **React Native**  | 0.74.1      |
| **Expo SDK**      | 51.0.1      |

<br/>

## 비인가 인원 모자이크 처리 기술

### 개념 모델
<!-- 개념 모델 이미지 추가 -->

* 데이터셋
  + 인가 객체의 얼굴 사진
    - 각 객체당 최소 1개 ~ 5개의 사진으로 구성
    - 각도나 표정에 따른 얼굴 모양의 변화를 고려하여 인식의 정확도를 높임
  + 모자이크 처리 대상 미디어
    - 사진, 동영상 혹은 실시간으로 촬영 중인 카메라 화면
> 입력 데이터셋의 크기가 큰 경우 GPU 메모리 사용량이 크게 증가하므로, GPU 환경에 맞게 조정하는 전처리 과정 필요<br/>
> 확장자를 설정하여 모델에서 분석하기 적합한 형식의 데이터로 가공<br/>
> ex. 사진 - JPEG, 동영상 - MP4

* 얼굴 객체 탐지 및 특징 추출
  + **dlib의 MMOD**<sup> Max-Margin Object Detection</sup> **모델**
    - 얼굴 객체 탐지에 특화된 딥러닝 기반 객체 탐지 모델
    - CNN<sup> Convolutional Neural Networks </sup>을 사용해 분류 정확도를 높임
  + **face_recognition 라이브러리** [face_recognition GitHub Repository](https://github.com/ageitgey/face_recognition)
    - face_recognition의 함수는 기본적으로 HOG<sup> Histogram of Oriented Gradients</sup> 기반의 얼굴 객체 탐지 모델을 사용

## 주요 기능
