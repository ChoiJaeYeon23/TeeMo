import { Alert, Linking } from "react-native"
import { RESULTS, check, requestMultiple } from "react-native-permissions"

/**
 * 앱의 접근 권한을 공통으로 관리하는 파일입니다.
 */
const PermissionUtil = {
    /**
     * 배열을 순회하면서 모든 접근 권한이 '허용(granted)' 됐는지 체크합니다.
     * 
     * @param {permissionArr}
     * @returns {notGrantedArr} 모든 접근 권한이 허용인 경우 빈 배열, 허용하지 않은 권한이 있으면 배열을 반환합니다
     */
    grantedPermissionArrCheck: async (permissionArr) => {
        let notGrantedArr = []

        for (let permissionItem of permissionArr) {
            let permissionCheck = await check(permissionItem)

            switch (permissionCheck) {
                case "granted":
                    break
                case "blocked":
                case "denied":
                case "limited":
                case "unavailable":
                    notGrantedArr.push(permissionItem)
                    break
            }
        }
        if (notGrantedArr.length == 0) {
            console.log("허용되지 않은 권한 없음")
        } else {
            console.log("허용되지 않은 권한:", notGrantedArr)
        }
        return notGrantedArr
    },

    /**
     * 접근 권한을 허용받아야 하는 것을 배열로 전달받습니다.
     * 
     * @param
     * @returns
     */
    requestPermission: async (permissionArr) => {
        const notGrantedArr = await PermissionUtil.grantedPermissionArrCheck(permissionArr)
        const notGrantedArrLength = notGrantedArr.length

        /**
         * 허용되지 않은 권한이 있는지 체크합니다.
         *
         * 허용되지 않은 권한이 없는 경우: 종료
         *
         * 허용되지 않은 권한이 있는 경우: 권한 요청
         * ** 허용 거부 => 현재는 Alert창만 내려가지만 추후에 앱 종료 or 에러메시지 출력 예정
         * ** 허용 확인 => Linking.openSettings() 함수를 이용해 앱 설정 창에서 권한을 허용하도록 유도
         */
        if (notGrantedArrLength == 0) return
        else {
            await requestMultiple(notGrantedArr)
                .then((statues) => {
                    let notGrantedCount = 0
                    notGrantedArr.map((permissionItem) => statues[permissionItem] === RESULTS.GRANTED ? notGrantedCount += 1 : 0)

                    if (notGrantedArrLength === notGrantedCount) return
                    else {
                        Alert.alert(
                            "허용되지 않은 접근 권한이 있습니다",
                            "모든 접근 권한을 허용해주세요.",
                            [
                                { text: "거부", onPress: () => console.log("앱 접근 권한 허용 거부"), style: "cancel" },
                                { text: "확인", onPress: () => Linking.openSettings(), style: "default" }
                            ]
                        )
                    }
                })
        }
    }
}

export default PermissionUtil