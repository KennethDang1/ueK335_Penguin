import React from "react";
import { StyleSheet } from "react-native";
import Providers from "./Providers";
import { Tabs } from "./Tabs";
import { useAuth } from "./lib/AuthProvider";
import Login from "./screens/Login";

const AppNavigator = () => {
  const { isAuth } = useAuth();
  if (!isAuth) {
    return <Login />;
  }
  return <Tabs />;
};

export default function App() {
  return (
    <Providers>
      <AppNavigator />
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
