import React, { useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { TextInput, Text, Divider } from "react-native-paper";
import { Penguin } from "../../lib/penguinApi";

const ViewPenguin: React.FC<{
  route: { params: { penguin: Penguin } };
}> = ({ route }) => {
  const { penguin } = route.params;
  const [isEditable, setIsEditable] = useState(false);
  const [name, setName] = useState(penguin.name ?? "");
  const [sex, setSex] = useState<"MALE" | "FEMALE" | "">(penguin.sex ?? "");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Name"
        value={name}
        mode="outlined"
        editable={isEditable}
        style={styles.input}
        theme={{ colors: { text: "black", placeholder: "gray", background: "#f5f5f5" } }}
      />

      <Divider bold={true} />

      <TextInput
        label="Species"
        value={penguin.species}
        mode="outlined"
        editable={isEditable}
        style={styles.input}
        theme={{ colors: { text: "black", placeholder: "gray", background: "#f5f5f5" } }}
      />

      <TextInput
        label="Island"
        value={penguin.island}
        mode="outlined"
        editable={isEditable}
        style={styles.input}
        theme={{ colors: { text: "black", placeholder: "gray", background: "#f5f5f5" } }}
      />

      <TextInput
        label="Beak Depth (mm)"
        value={penguin.beakDepthMm?.toString() ?? ""}
        mode="outlined"
        editable={isEditable}
        style={styles.input}
        theme={{ colors: { text: "black", placeholder: "gray", background: "#f5f5f5" } }}
      />
      <TextInput
        label="Beak Length (mm)"
        value={penguin.beakLengthMm?.toString() ?? ""}
        mode="outlined"
        editable={isEditable}
        style={styles.input}
        theme={{ colors: { text: "black", placeholder: "gray", background: "#f5f5f5" } }}
      />
      <TextInput
        label="Flipper Length (mm)"
        value={penguin.flipperLengthMm?.toString() ?? ""}
        mode="outlined"
        editable={isEditable}
        style={styles.input}
        theme={{ colors: { text: "black", placeholder: "gray", background: "#f5f5f5" } }}
      />
      <TextInput
        label="Body Mass (g)"
        value={penguin.bodyMassG?.toString() ?? ""}
        mode="outlined"
        editable={isEditable}
        style={styles.input}
        theme={{ colors: { text: "black", placeholder: "gray", background: "#f5f5f5" } }}
      />

      <View style={styles.sexToggle}>
        <TouchableOpacity
          style={[styles.sexButton, sex === "MALE" && styles.sexButtonActive]}
        >
          <Text>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sexButton, sex === "FEMALE" && styles.sexButtonActive]}
        >
          <Text>Female</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  sexToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    overflow: "hidden",
    marginBottom: 15,
  },
  sexButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  sexButtonActive: {
    backgroundColor: "#FFD700",
  },
});

export default ViewPenguin;
