import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../lib/AuthProvider";

function Login() {
  const autContext = useAuth();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text>Login</Text>
      <Button onPress={() => autContext.setAuth("john@doe.com", "password123")}>
        Login
      </Button>
      <Button onPress={() => autContext.clearAuth()}>Logout</Button>
    </View>
  );
}

export default Login;
