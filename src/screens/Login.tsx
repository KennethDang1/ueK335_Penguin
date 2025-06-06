import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../lib/AuthProvider";

function Login() {
  // We call the login mutation from the context
  const { login: performLogin, isLoggingIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // To get the error state, we can track it locally
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = () => {
    setLoginError(null); // Clear previous errors
    Promise.resolve(performLogin({ email, password })).catch((error: Error) => {
      setLoginError(error.message);
    });
  };

  return (
    <View style={{ padding: 20, paddingTop: 100 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loginError && <Text style={{ color: "red" }}>{loginError}</Text>}
      <Button onPress={handleLogin} disabled={isLoggingIn}>
        {isLoggingIn ? "Logging in..." : "Login"}
      </Button>
    </View>
  );
}

export default Login;
