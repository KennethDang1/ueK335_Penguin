import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import CustomBottomNavbar from "./components/CustomBottomNavbar";
import Explore from "./screens/Explore";
import PenguinManager from "./screens/PenguinDemo";
import Profile from "./screens/Profile";

const Tab = createBottomTabNavigator();

const EmptyComponent = () => <></>;

export function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Explore"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFDA63",
        tabBarInactiveTintColor: "gray",
      }}
      tabBar={(props) => <CustomBottomNavbar {...props} />}
    >
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="penguin" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={PenguinManager}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
