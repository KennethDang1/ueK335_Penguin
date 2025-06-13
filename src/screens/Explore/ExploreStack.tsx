import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Penguin } from "../../lib/penguinApi";
import EditPenguin from "./EditPenguin";
import Explore from "./Explore";
import ViewPenguin from "./ViewPenguin";

export type ExploreStackParamList = {
  ExploreDetails: undefined;
  View: { penguin: Penguin };
  Edit: { penguin: Penguin };
};

const Stack = createNativeStackNavigator<ExploreStackParamList>();

/**
 * ExploreStack component defines the navigation stack for the "Explore" tab.
 */
const ExploreStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="ExploreDetails">
      <Stack.Screen
        name="ExploreDetails"
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
      <Stack.Screen
        name="Edit"
        component={EditPenguin}
        options={{ title: "Edit Penguin" }}
      />
    </Stack.Navigator>
  );
};

export default ExploreStack;
