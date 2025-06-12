import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import CustomBottomNavbar from "./components/CustomBottomNavbar";

import CreatePenguin from "./screens/Create";
import ExploreStack from "./screens/Explore/ExploreStack";
import LandingPage from "./screens/LandingPage";
import Profile from "./screens/Profile";

const Tab = createBottomTabNavigator();

export type TabsParamList = {
  Overview: undefined;
  Explore: undefined;
  Create: undefined;
  Profile: undefined;
};

export function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Overview"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFDA63",
        tabBarInactiveTintColor: "gray",
      }}
      tabBar={(props) => <CustomBottomNavbar {...props} />}
    >
      <Tab.Screen
        name="Overview"
        component={LandingPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="penguin" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreatePenguin}
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
