import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import { BottomNavigation } from "react-native-paper";
/**
 * CustomBottomNavbar component for rendering a customized bottom tab bar.
 * It uses react-native-paper's BottomNavigation.Bar to display navigation tabs.
 * @param {BottomTabBarProps} { state, descriptors, navigation, insets } - Props for the bottom tab bar.
 * @param {NavigationState} state - The navigation state of the bottom tab bar.
 * @param {Descriptor[]} descriptors - The route descriptors for the bottom tab bar.
 * @param {BottomNavigation} navigation - The navigation object for the bottom tab bar.
 * @param {SafeAreaInsets} insets - The safe area insets for the bottom tab bar.
 * @returns {JSX.Element} The rendered BottomNavigation.Bar component.
 */
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
  /**
   * Styles for the bottom navigation bar, setting background color, top border width, and color.
   */
  bottomNavigation: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});

export default CustomBottomNavbar;
