import { PERMISSIONS } from "react-native-permissions"

/**
 * 앱의 접근 권환 관련 코드 및 문구를 정의해놓은 파일입니다.
 * 
 * { APP_PERMISSION_CODE }: 안드로이드 접근 권한 요청 시 필요한 코드
 * { APP_PERMISSION_LIST }: 사용자에게 안내할 앱 접근 권한 리스트
 * { APP_PERMISSION_DETAIL }: 사용자에게 안내할 앱 접근 권한 상세
 */
export const APP_PERMISSION_CODE = {
    "CAMERA": [PERMISSIONS.ANDROID.CAMERA],
    "MIC": [PERMISSIONS.ANDROID.RECORD_AUDIO],
    "STORAGE": [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, PERMISSIONS.ANDROID.READ_MEDIA_VISUAL_USER_SELECTED, PERMISSIONS.ANDROID.READ_MEDIA_VIDEO]
}

export const APP_PERMISSION_LIST = {
    "CAMERA": ["카메라 / 동영상"],
    "MIC": ["마이크"],
    "STORAGE": ["사진 / 미디어"],
}

export const APP_PERMISSOIN_DETAIL = {
    "CAMERA": ["사진 및 영상 촬영"],
    "MIC": ["영상 촬영 음성 인식?"],
    "STORAGE": ["사진, 동영상 파일 읽기 또는 저장"]
}