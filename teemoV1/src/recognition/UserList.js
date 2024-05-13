import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserList = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [userList, setUserList] = useState([]);

  const handleSave = () => {
    if (!userName.trim()) {
      alert('사용자 이름을 입력해주세요.');
      return;
    }
    setUserList([...userList, { name: userName, photos: [] }]);
    setUserName(''); // 입력 필드 초기화
  };

  const handleAddPhotos = () => {
    navigation.navigate('Userrecognition');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사용자 리스트</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          placeholder="사용자 이름 입력"
          value={userName}
          onChangeText={setUserName}
        />
        {userList.map((user, index) => (
          <View key={index} style={styles.userEntry}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPhotos}>Photos: {user.photos.length}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>시작</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAddPhotos}>
          <Text style={styles.buttonText}>추가</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,  // 스크롤 뷰의 내용이 동적으로 커질 수 있도록 설정
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '40%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userEntry: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    width: '100%',
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
