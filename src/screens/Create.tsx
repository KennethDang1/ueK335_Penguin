import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useCreatePenguin } from "../lib/penguinApi";

/**
 * CreatePenguin component for adding new penguin entries.
 */
export default function CreatePenguin() {
  const [species, setSpecies] = useState("");
  const [island, setIsland] = useState("");
  const [beakLengthMm, setBeakLengthMm] = useState("");
  const [beakDepthMm, setBeakDepthMm] = useState("");
  const [flipperLengthMm, setFlipperLengthMm] = useState("");
  const [bodyMassG, setBodyMassG] = useState("");
  const [sex, setSex] = useState<"MALE" | "FEMALE" | "">("MALE");
  const [name, setName] = useState("");

  const { mutate: createPenguin, isPending } = useCreatePenguin({
    onSuccess: () => {
      Alert.alert("Penguin created successfully!");
      setSpecies("");
      setIsland("");
      setBeakLengthMm("");
      setBeakDepthMm("");
      setFlipperLengthMm("");
      setBodyMassG("");
      setSex("");
      setName("");
    },
    onError: (error) => {
      Alert.alert("Error creating penguin", error.message);
    },
  });

  /**
   * @returns void
   */
  const handleSubmit = () => {
    if (
      !species ||
      !island ||
      !beakLengthMm ||
      !beakDepthMm ||
      !flipperLengthMm ||
      !bodyMassG ||
      !sex
    ) {
      Alert.alert("Please fill in all required fields");
      return;
    }

    createPenguin({
      name: name || null,
      species,
      island,
      beakLengthMm: Number(beakLengthMm) || null,
      beakDepthMm: Number(beakDepthMm) || null,
      flipperLengthMm: Number(flipperLengthMm) || null,
      bodyMassG: Number(bodyMassG) || null,
      sex: sex,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: 60,
        paddingHorizontal: 30,
        paddingBottom: 30,
      }}
    >
      <Text style={styles.heading}>Add A Penguin</Text>

      <TextInput
        label="Name (optional)"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { text: "black", primary: "black" } }}
      />

      <TextInput
        label="Species"
        value={species}
        onChangeText={setSpecies}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { text: "black", primary: "black" } }}
      />

      <TextInput
        label="Island"
        value={island}
        onChangeText={setIsland}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { text: "black", primary: "black" } }}
      />

      <TextInput
        label="Beak Length (mm)"
        value={beakLengthMm}
        onChangeText={setBeakLengthMm}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        theme={{ colors: { text: "black", primary: "black" } }}
      />

      <TextInput
        label="Beak Depth (mm)"
        value={beakDepthMm}
        onChangeText={setBeakDepthMm}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        theme={{ colors: { text: "black", primary: "black" } }}
      />

      <TextInput
        label="Flipper Length (mm)"
        value={flipperLengthMm}
        onChangeText={setFlipperLengthMm}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        theme={{ colors: { text: "black", primary: "black" } }}
      />

      <TextInput
        label="Body Mass (g)"
        value={bodyMassG}
        onChangeText={setBodyMassG}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        theme={{ colors: { text: "black", primary: "black" } }}
      />

      <View style={styles.sexToggle}>
        <TouchableOpacity
          style={[styles.sexButton, sex === "MALE" && styles.sexButtonActive]}
          onPress={() => setSex("MALE")}
        >
          <Text>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sexButton, sex === "FEMALE" && styles.sexButtonActive]}
          onPress={() => setSex("FEMALE")}
        >
          <Text>Female</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleSubmit}
        disabled={isPending}
      >
        <Text style={styles.createButtonText}>
          {isPending ? "Submitting..." : "Create Penguin"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
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
  createButton: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
