import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import User from "./User";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const SettingScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "사진영상") {
            iconName = focused ? "camera" : "camera-outline"; 
          } else if (route.name === "내정보") {
            iconName = focused ? "person" : "person-outline";
          }

          // 아이콘과 탭 바 설정을 동시에 제공
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#000000", // tabBarOptions 내용을 이곳으로 이동
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          display: "flex"
        },
        tabBarLabel: () => null // 탭 레이블 설정을 각 탭의 options에서 screenOptions으로 이동
      })}
    >
      <Tab.Screen name="사진영상" component={Home} />
      <Tab.Screen name="내정보" component={User} />
    </Tab.Navigator>
  );
};

export default SettingScreen;
