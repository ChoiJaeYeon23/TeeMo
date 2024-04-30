import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { logout } from "@react-native-seoul/kakao-login";
import { useNavigation } from "@react-navigation/native";

const User = ({ route }) => {
  // route.params가 정의되지 않은 경우를 처리하여 기본값을 설정합니다.
  const { name = "", email = "" } = route.params || {};
  const navigation = useNavigation();

  const goUserList = () => {
    navigation.navigate("UserList");
  };

  const signOutWithKakao = async () => {
    console.log("로그아웃 버튼 눌림");
    try {
      const message = await logout();
      if (message === "Successfully logged out") console.log("로그아웃 성공");
      navigation.navigate("로그인화면");
    } catch (err) {
      console.error("로그아웃 오류", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={goUserList}>
          <Text style={styles.buttonText}>사용자인식</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={signOutWithKakao}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
  },
  logoutText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 25,
  },
});

export default User;
