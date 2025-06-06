import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

type RegisterProps = {
  onBackToLogin: () => void;
};

function Register({ onBackToLogin }: RegisterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Button
        mode="outlined"
        onPress={onBackToLogin}
        style={styles.backButton}
        labelStyle={styles.backButtonText}
      >
        Back to Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  backButton: {
    marginTop: 20,
    borderColor: "#007AFF",
  },
  backButtonText: {
    color: "#007AFF",
  },
});

export default Register;
