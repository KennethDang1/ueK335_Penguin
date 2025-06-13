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
import { Penguin, useUpdatePenguin } from "../../lib/penguinApi";

/**
 * @param {object} props - The component props.
 * @param {object} props.route - The route object containing parameters, specifically `penguin`.
 * @param {object} props.navigation - The navigation object for navigating back.
 */
export default function EditPenguin({ route, navigation }: any) {
  const { penguin }: { penguin: Penguin } = route.params;

  const [species, setSpecies] = useState(penguin.species);
  const [island, setIsland] = useState(penguin.island);
  const [beakLengthMm, setBeakLengthMm] = useState(
    penguin.beakLengthMm?.toString() ?? ""
  );
  const [beakDepthMm, setBeakDepthMm] = useState(
    penguin.beakDepthMm?.toString() ?? ""
  );
  const [flipperLengthMm, setFlipperLengthMm] = useState(
    penguin.flipperLengthMm?.toString() ?? ""
  );
  const [bodyMassG, setBodyMassG] = useState(
    penguin.bodyMassG?.toString() ?? ""
  );
  const [sex, setSex] = useState<"MALE" | "FEMALE" | "">(penguin.sex ?? "");
  const [name, setName] = useState(penguin.name ?? "");

  const { mutate: updatePenguin, isPending } = useUpdatePenguin({
    onSuccess: () => {
      Alert.alert("Penguin updated successfully!");
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert("Error updating penguin", error.message);
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

    updatePenguin({
      id: penguin.id,
      penguinData: {
        name: name || null,
        species,
        island,
        beakLengthMm: Number(beakLengthMm),
        beakDepthMm: Number(beakDepthMm),
        flipperLengthMm: Number(flipperLengthMm),
        bodyMassG: Number(bodyMassG),
        sex,
      },
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

      <TextInput
        label="Name (optional)"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
        theme={{
          colors: { text: "black", primary: "black", placeholder: "gray" },
        }}
      />

      <TextInput
        label="Species"
        value={species}
        onChangeText={setSpecies}
        style={styles.input}
        mode="outlined"
        theme={{
          colors: { text: "black", primary: "black", placeholder: "gray" },
        }}
      />

      <TextInput
        label="Island"
        value={island}
        onChangeText={setIsland}
        style={styles.input}
        mode="outlined"
        theme={{
          colors: { text: "black", primary: "black", placeholder: "gray" },
        }}
      />

      <TextInput
        label="Beak Length (mm)"
        value={beakLengthMm}
        onChangeText={setBeakLengthMm}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        theme={{
          colors: { text: "black", primary: "black", placeholder: "gray" },
        }}
      />

      <TextInput
        label="Beak Depth (mm)"
        value={beakDepthMm}
        onChangeText={setBeakDepthMm}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        theme={{
          colors: { text: "black", primary: "black", placeholder: "gray" },
        }}
      />

      <TextInput
        label="Flipper Length (mm)"
        value={flipperLengthMm}
        onChangeText={setFlipperLengthMm}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        theme={{
          colors: { text: "black", primary: "black", placeholder: "gray" },
        }}
      />

      <TextInput
        label="Body Mass (g)"
        value={bodyMassG}
        onChangeText={setBodyMassG}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        theme={{
          colors: { text: "black", primary: "black", placeholder: "gray" },
        }}
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
        style={[styles.createButton, { marginBottom: 20 }]}
        onPress={handleSubmit}
        disabled={isPending}
      >
        <Text style={styles.createButtonText}>
          {isPending ? "Saving..." : "Update Penguin"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
