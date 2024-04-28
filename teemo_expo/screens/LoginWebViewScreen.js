import { SafeAreaView } from "react-native"
import axios from "axios"
import qs from "qs"
import { WebView } from "react-native-webview"
import { useNavigation } from "@react-navigation/native"

/**
 * 카카오 로그인 시 열리는 WebView 페이지입니다.
 */
const LoginWebViewScreen = () => {
    const navigation = useNavigation()

    const REST_API_KEY = "1b13f316da9c6ceaa13c69366cd87551"
    // const REDIRET_URI = "https://192.168.219.105:8081"
    const REDIRET_URI = "https://teemo.com/oauth"
    const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`

    function LogInProgress(data) {
        const exp = "code="
        var condition = data.indexOf(exp)
        if (condition != -1) {
            var request_code = data.substring(condition + exp.length)
            console.log("access code ::", request_code)
            requestToken(request_code)
        }
    }

    const requestToken = async (code) => {
        const requestTokenUrl = "https://kauth.kakao.com/oauth/token"

        const options = qs.stringify({
            grant_type: "authorization_code",
            client_id: REST_API_KEY,
            redirect_uri: REDIRET_URI,
            code
        })

        try {
            const tokenResponse = await axios.post(requestTokenUrl, options)
            const ACCESS_TOKEN = tokenResponse.data.access_token

            const body = {
                ACCESS_TOKEN
            }

            const response = await axios.post(REDIRET_URI, body)
            const value = response.data
            // const result = await storeUser(value)

            // if (result === "stored") {
            //     const user = await getData("user")
            //     dispatch(read_S(user))
            navigation.navigate("NavigationScreen")

            const userInfo = await getUserInfo(ACCESS_TOKEN)
            const email = userInfo.kakao_account.email
            const nickname = userInfo.properties.nickname

            console.log("사용자 이메일 ::", email)
            console.log("사용자 닉네임 ::", nickname)
            // }
        } catch (e) {
            console.log(e)
        }
    }

    const getUserInfo = async (access_token) => {
        try {
            const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
            return response.data
        } catch (e) {
            console.log("사용자 정보 추출 에러 ::", e)
            throw e
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WebView
                style={{ flex: 1 }}
                source={{
                    uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRET_URI}`
                }}
                injectedJavaScript={INJECTED_JAVASCRIPT}
                javaScriptEnabled={true}
                onMessage={(event) => {
                    LogInProgress(event.nativeEvent["url"])
                }}
            />
        </SafeAreaView>
    )
}

export default LoginWebViewScreen