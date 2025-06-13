import React, { useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../lib/AuthProvider";

interface RegisterProps {
  onBackToLogin: () => void;
}

/**
 * @param {RegisterProps} { onBackToLogin } - Callback function to navigate back to the login screen.
 */
function Register({ onBackToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const { register: performRegister, isRegistering } = useAuth();

  /**
   * @returns void
   */
  const handleRegister = async () => {
    setRegisterError(null);
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Registration Error", "Please fill all fields.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Registration Error", "Please enter a valid email.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Registration Error",
        "Password must be at least 8 characters."
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Registration Error", "Passwords do not match.");
      return;
    }

    try {
      await performRegister({ name, email, password });
      onBackToLogin();
    } catch (error: any) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PenguCruxSnow</Text>
      <Image source={require("../../assets/penguin.png")} style={styles.logo} />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />
        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      {registerError && <Text style={styles.errorText}>{registerError}</Text>}

      <Button
        mode="contained"
        onPress={handleRegister}
        disabled={isRegistering}
        style={[styles.registerButton, styles.registerButtonBorder]}
        labelStyle={styles.registerButtonText}
      >
        {isRegistering ? "Registering..." : "Register"}
      </Button>

      <View style={styles.loginContainer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={onBackToLogin}>
          <Text style={styles.loginLink}>Login</Text>
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
  registerButton: {
    width: "100%",
    backgroundColor: "#FFCC00",
    marginBottom: 20,
    borderRadius: 5,
  },
  registerButtonBorder: {
    borderWidth: 1,
    borderColor: "black",
  },
  registerButtonText: {
    color: "black",
  },
  loginContainer: {
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
  },
  loginLink: {
    color: "#007AFF",
  },
});

export default Register;
