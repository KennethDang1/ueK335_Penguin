import { getHeaderTitle } from "@react-navigation/elements";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Appbar, Button } from "react-native-paper";

export function HomeScreen({ navigation }) {
  React.useEffect(() => {
    const checkCredentials = async () => {
      const credentials = await SecureStore.getItemAsync("exampleCredentials");
      if (!credentials) {
        navigation.navigate("Details");
      }
    };

    checkCredentials();
  }, [navigation]);

  return (
    <View style={style.container}>
      <Text>Home Screen</Text>
      <Button mode="contained" onPress={() => navigation.navigate("Details")}>
        Go to details
      </Button>

      <Button
        mode="contained"
        onPress={async () => {
          const exampleCredentials = {
            email: "example@example.com",
            password: "password123",
          };
          await SecureStore.setItemAsync(
            "exampleCredentials",
            JSON.stringify(exampleCredentials)
          );
        }}
      >
        Save Example Credentials
      </Button>
      <Button
        mode="contained"
        onPress={async () => {
          await SecureStore.deleteItemAsync("exampleCredentials");
        }}
      >
        Clear Example Credentials
      </Button>
    </View>
  );
}

export function DetailsScreen() {
  return (
    <View style={style.container}>
      <Text>Details Screen</Text>
    </View>
  );
}

export const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export function CustomNavigationBar({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) {
  const title = getHeaderTitle(options, route.name);

  return back ? (
    <Appbar.Header>
      <Appbar.BackAction onPress={navigation.goBack} />
    </Appbar.Header>
  ) : null;
}
