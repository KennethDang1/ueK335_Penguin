import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../lib/AuthProvider";

const Profile = () => {
  const { logout, session } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.separator} />

      <View style={styles.profileInfo}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{session?.user?.name}</Text>

        <Text style={styles.label}>E-Mail</Text>
        <Text style={styles.value}>{session?.user?.email}</Text>
      </View>

      <View style={styles.separator} />

      <Button
        mode="contained"
        onPress={() => logout()}
        style={styles.logoutButton}
        labelStyle={styles.logoutButtonText}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
    textAlign: "center",
  },
  value: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  separator: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    width: "80%",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#ffc107",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
  logoutButtonText: {
    color: "black",
  },
});

export default Profile;
