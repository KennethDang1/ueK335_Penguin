import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";

const LandingPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, Florian</Text>
      </View>

      <View style={styles.cardContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContent}>
              <View>
                <Title style={styles.cardTitle}>
                  Explore up to 30 Penguins
                </Title>
                <Paragraph style={styles.cardParagraph}>
                  from island 30 different islands.
                </Paragraph>
              </View>
              <MaterialCommunityIcons
                name="arrow-top-right"
                size={24}
                color="black"
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContent}>
              <View>
                <Title style={styles.cardTitle}>Add your own Penguins</Title>
                <Paragraph style={styles.cardParagraph}>
                  help track these animals!
                </Paragraph>
              </View>
              <MaterialCommunityIcons
                name="arrow-top-right"
                size={24}
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
