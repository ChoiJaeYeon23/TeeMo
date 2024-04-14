import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserList = () => {
  const navigation = useNavigation(); 
  
  const handleStart = () => {
    console.log('시작');
  };

  const handleAdd = () => {
    navigation.navigate('Userrecognition'); // 사용자 얼굴 인식 이동
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>사용자 리스트</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.firstButton]} onPress={handleStart}>
          <Text style={styles.buttonText}>시작</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondButton]} onPress={handleAdd}>
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
    justifyContent: 'space-between', 
    backgroundColor: '#fff', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  button: {
    flex: 1, 
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, 
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5, 
  },
  firstButton: {
    marginLeft: 0,
  },
  secondButton: {
    marginRight: 0, 
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', 
  },
});

export default UserList;
