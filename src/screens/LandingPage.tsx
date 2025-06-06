import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../lib/AuthProvider";

function LandingPage() {
  const autContext = useAuth();
  const { login, isLoggingIn, isLoginError, loginError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLoginError && loginError) {
      Alert.alert("Login Failed", loginError.message);
    }
  }, [isLoginError, loginError]);

  const handleLogin = async () => {
    if (isLoggingIn) return;

    try {
      await login({ email, password });
      Alert.alert("Success", "You are now logged in!");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.message || "Please check your credentials."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text>LandingPage</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {isLoginError && (
        <Text style={styles.errorText}>
          {loginError?.message || "An unknown error occurred."}
        </Text>
      )}
      <Button onPress={handleLogin} disabled={isLoggingIn}>
        {isLoggingIn ? "Logging in..." : "Login"}
      </Button>
      <Button onPress={() => autContext.logout()}>Logout</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    /* ... your styles ... */
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default LandingPage;
