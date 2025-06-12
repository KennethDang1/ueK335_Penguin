import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Penguin } from "../../lib/penguinApi";
import Explore from "./Explore";

export type ExploreStackParamList = {
  Explore: undefined;
  View: { penguin: Penguin };
};

const Stack = createNativeStackNavigator<ExploreStackParamList>();

const ExploreStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Explore">
      <Stack.Screen
        name="Explore"
        component={Explore}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="View"
        component={ViewPenguin}
        options={({ route }) => ({
          title: route.params.penguin.name
            ? "Viewing: " +
              route.params.penguin.species +
              " - " +
              route.params.penguin.name
            : "Viewing: " + route.params.penguin.species,
        })}
      />
    </Stack.Navigator>
  );
};

const ViewPenguin: React.FC<{
  route: { params: { penguin: Penguin } };
}> = ({ route }) => {
  const { penguin } = route.params;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{penguin.name}</Text>
      <Text>Species: {penguin.species}</Text>
      <Text>Island: {penguin.island}</Text>
      <Text style={{ marginTop: 8, color: "gray" }}>
        {penguin.beakDepthMm || "No description available."}
      </Text>
    </View>
  );
};

export default ExploreStack;
