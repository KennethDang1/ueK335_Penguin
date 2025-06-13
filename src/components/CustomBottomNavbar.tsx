import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import { BottomNavigation } from "react-native-paper";
const CustomBottomNavbar = ({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) => {
  return (
    <BottomNavigation.Bar
      navigationState={state}
      safeAreaInsets={insets}
      onTabPress={({ route }) => navigation.navigate(route.name)}
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];
        return options.tabBarIcon?.({ focused, color, size: 24 }) || null;
      }}
      getLabelText={({ route }) => {
        const { options } = descriptors[route.key];
        return String(options.tabBarLabel ?? options.title ?? route.name);
      }}
      style={styles.bottomNavigation}
      activeColor="black"
      inactiveColor="gray"
      activeIndicatorStyle={{
        backgroundColor: "#FFCB05",
      }}
    />
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});

export default CustomBottomNavbar;
