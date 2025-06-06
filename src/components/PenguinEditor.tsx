import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, RadioButton, Text, TextInput } from "react-native-paper";
import { Penguin, useCreatePenguin } from "../lib/penguinApi";

interface PenguinEditorProps {
  mode: "create" | "update" | "view";
  penguinData?: Penguin;
  onSave?: (data: any) => void;
}

const PenguinEditor: React.FC<PenguinEditorProps> = ({
  mode,
  penguinData,
  onSave,
}) => {
  const [nickname, setNickname] = React.useState(penguinData?.name || "");
  const [species, setSpecies] = React.useState(penguinData?.species || "");
  const [island, setIsland] = React.useState(penguinData?.island || "");
  const [beakLength, setBeakLength] = React.useState(
    penguinData?.beakLengthMm?.toString() || ""
  );
  const [beakDepth, setBeakDepth] = React.useState(
    penguinData?.beakDepthMm?.toString() || ""
  );
  const [flipperLength, setFlipperLength] = React.useState(
    penguinData?.flipperLengthMm?.toString() || ""
  );
  const [bodyMass, setBodyMass] = React.useState(
    penguinData?.bodyMassG?.toString() || ""
  );
  const [gender, setGender] = React.useState<"male" | "female">(
    penguinData?.sex?.toLowerCase() === "female" ? "female" : "male"
  );

  const isViewMode = mode === "view";
  const { mutateAsync: createPenguin, isPending: isCreating } =
    useCreatePenguin();

  const handleSave = async () => {
    if (onSave) {
      const data = {
        name: nickname,
        species,
        island,
        beakLengthMm: parseFloat(beakLength),
        beakDepthMm: parseFloat(beakDepth),
        flipperLengthMm: parseFloat(flipperLength),
        bodyMassG: parseFloat(bodyMass),
        sex: gender.toUpperCase() as "MALE" | "FEMALE",
      };
      await onSave(data);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Nickname (optional)"
        value={nickname}
        onChangeText={setNickname}
        mode="outlined"
        disabled={isViewMode}
      />
      <TextInput
        label="Species"
        value={species}
        onChangeText={setSpecies}
        mode="outlined"
        disabled={isViewMode}
      />
      <TextInput
        label="Island"
        value={island}
        onChangeText={setIsland}
        mode="outlined"
        disabled={isViewMode}
      />
      <TextInput
        label="Beak Length (mm)"
        value={beakLength}
        onChangeText={setBeakLength}
        mode="outlined"
        keyboardType="numeric"
        disabled={isViewMode}
      />
      <TextInput
        label="Beak Depth (mm)"
        value={beakDepth}
        onChangeText={setBeakDepth}
        mode="outlined"
        keyboardType="numeric"
        disabled={isViewMode}
      />
      <TextInput
        label="Flipper Length (mm)"
        value={flipperLength}
        onChangeText={setFlipperLength}
        mode="outlined"
        keyboardType="numeric"
        disabled={isViewMode}
      />
      <TextInput
        label="Body Mass (g)"
        value={bodyMass}
        onChangeText={setBodyMass}
        mode="outlined"
        keyboardType="numeric"
        disabled={isViewMode}
      />

      <View style={styles.genderContainer}>
        <Text>Gender:</Text>
        <RadioButton.Group
          onValueChange={(value) => setGender(value as "male" | "female")}
          value={gender}
        >
          <View style={styles.radioContainer}>
            <RadioButton value="male" disabled={isViewMode} />
            <Text>Male</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="female" disabled={isViewMode} />
            <Text>Female</Text>
          </View>
        </RadioButton.Group>
      </View>

      {mode !== "view" && (
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isCreating}
          disabled={isCreating}
        >
          {mode === "create" ? "Add and Create Another" : "Update this Penguin"}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default PenguinEditor;
