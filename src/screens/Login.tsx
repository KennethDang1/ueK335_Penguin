import React, { useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../lib/AuthProvider";
import Register from "./Register";

/**
 * Login component handles user authentication.
 */
function Login() {
  const [showRegister, setShowRegister] = useState(false);

  const { login: performLogin, isLoggingIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState<string | null>(null);

  if (showRegister) {
    return <Register onBackToLogin={() => setShowRegister(false)} />;
  }

  /**
   * Handles the login button press.
   */
  const handleLogin = () => {
    setLoginError(null);
    Promise.resolve(performLogin({ email, password })).catch((error: Error) => {
      Alert.alert("Login Error", error.message);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PenguCruxSnow</Text>

      <Image source={require("../../assets/penguin.png")} style={styles.logo} />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {loginError && <Text style={styles.errorText}>{loginError}</Text>}

      <Button
        mode="contained"
        onPress={handleLogin}
        disabled={isLoggingIn}
        style={[styles.loginButton, styles.loginButtonBorder]}
        labelStyle={styles.loginButtonText}
      >
        {isLoggingIn ? "Logging in..." : "Login"}
      </Button>

      <View style={styles.registerContainer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => setShowRegister(true)}>
          <Text style={styles.loginLink}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    height: 50,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#FFCC00",
    marginBottom: 20,
    borderRadius: 5,
  },
  loginButtonBorder: {
    borderWidth: 1,
    borderColor: "black",
  },
  loginButtonText: {
    color: "black",
  },
  registerContainer: {
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
  },
  loginLink: {
    color: "#007AFF",
  },
});

export default Login;
