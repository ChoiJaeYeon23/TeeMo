import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const UserList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { photos } = route.params;
  const [userName, setUserName] = useState('');
  const [userList, setUserList] = useState([]);

  const handleSave = () => {
    // 이름과 함께 사용자 리스트에 추가
    setUserList([...userList, { name: userName, photos }]);
    setUserName(''); // 입력 필드 초기화
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>사용자 리스트</Text>
          <TextInput
            style={styles.input}
            placeholder="사용자 이름 입력"
            value={userName}
            onChangeText={setUserName}
          />
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>저장</Text>
          </TouchableOpacity>

          {userList.map((user, index) => (
            <View key={index} style={styles.userEntry}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userPhotos}>Photos: {user.photos.length}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userEntry: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userPhotos: {
    fontSize: 14,
  },
});

export default UserList;
