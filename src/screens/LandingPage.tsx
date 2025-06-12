import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useAuth } from "../lib/AuthProvider";
import { usePenguins } from "../lib/penguinApi";
import { TabsParamList } from "../Tabs";

const LandingPage = () => {
  const { session } = useAuth();
  const navigation = useNavigation<BottomTabNavigationProp<TabsParamList>>();
  const { data } = usePenguins();
  const totalCount = data?.totalCount;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.welcomeText}>
          {session?.user.name || session?.user.email?.split("@")[0]}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <Card
          style={styles.card}
          onPress={() => {
            navigation.navigate("Explore");
          }}
        >
          <Card.Content>
            <View style={styles.cardContent}>
              <View>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Explore up to {totalCount || ""} Penguins
                </Text>
                <Text variant="bodyMedium" style={styles.cardParagraph}>
                  So manny penguins to discover!
                </Text>
              </View>
              <MaterialCommunityIcons
                name="arrow-top-right"
                size={44}
                color="black"
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} onPress={() => navigation.navigate("Create")}>
          <Card.Content>
            <View style={styles.cardContent}>
              <View>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Add your own Penguins
                </Text>
                <Text variant="bodyMedium" style={styles.cardParagraph}>
                  help track these animals!
                </Text>
              </View>
              <MaterialCommunityIcons
                name="arrow-top-right"
                size={44}
                color="black"
              />
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingTop: 100, // Adjusted for better positioning
    paddingHorizontal: 20,
    marginBottom: 40, // Added space below header
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardContainer: {
    width: "90%", // Adjusted width for cards
    alignItems: "center",
  },
  card: {
    width: "100%",
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardParagraph: {
    fontSize: 14,
    color: "gray",
  },
});

export default LandingPage;
