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

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{  // tabBarOptions를 screenOptions로 이동합니다.
        activeTintColor: "#000000", 
        inactiveTintColor: "gray", 
        style: {
          display: "flex",
        },
      }}
    >
      <Tab.Screen name="사진영상" component={Home} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="내정보" component={User} options={{ tabBarLabel: () => null }} />
    </Tab.Navigator>
  );
};

export default SettingScreen;
