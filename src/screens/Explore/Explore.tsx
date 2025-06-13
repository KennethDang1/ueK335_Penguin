import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Card,
  IconButton,
  Searchbar,
  SegmentedButtons,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Penguin, useDeletePenguin, usePenguins } from "../../lib/penguinApi";
import { ExploreStackParamList } from "./ExploreStack";

/**
 * Explore component displays a list of penguins with filtering, sorting, and pagination capabilities.
 */
const Explore = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExploreStackParamList>>();
  const [searchText, setSearchText] = useState("");
  const [genderFilter, setGenderFilter] = useState<"ALL" | "MALE" | "FEMALE">(
    "ALL"
  );
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { data, error, isLoading, refetch } = usePenguins({
    filters: {
      searchQuery: searchText,
      gender: genderFilter,
    },
    sort: {
      field: "species",
      direction: "asc",
    },
    pagination: {
      page: page,
      pageSize: 10,
    },
  });

  const { mutate: deletePenguin } = useDeletePenguin();

  /**
   * @param penguin - The penguin object to be deleted.
   */
  const handleDeletePenguin = async (penguin: Penguin) => {
    Alert.alert(
      "Delete Penguin",
      `Are you sure you want to delete ${penguin.species}${
        penguin.name ? ` (${penguin.name})` : ""
      }?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePenguin(penguin.id);
              console.log("Penguin deleted successfully:", penguin.id);
              await refetch();
            } catch (error) {
              console.error("Failed to delete penguin:", error);
            }
          },
        },
      ]
    );
  };

  /**
   * Handles the refresh action triggered by pull-to-refresh.
   */
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    try {
      await refetch();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * @param penguin - The penguin object to view.
   */
  const handleViewPenguin = (penguin: Penguin) => {
    navigation.navigate("View", { penguin });
  };

  const segmentedButtons = [
    {
      value: "ALL" as "ALL" | "MALE" | "FEMALE",
      label: "All",
      checkedColor: "#000",
      uncheckedColor: "#000",
      style:
        genderFilter === "ALL"
          ? styles.checkedButtonStyle
          : styles.uncheckedButtonStyle,
      labelStyle:
        genderFilter === "ALL"
          ? styles.checkedTextStyle
          : styles.uncheckedTextStyle,
    },
    {
      value: "MALE" as "ALL" | "MALE" | "FEMALE",
      label: "Male",
      checkedColor: "#000",
      uncheckedColor: "#000",
      style:
        genderFilter === "MALE"
          ? styles.checkedButtonStyle
          : styles.uncheckedButtonStyle,
      labelStyle:
        genderFilter === "MALE"
          ? styles.checkedTextStyle
          : styles.uncheckedTextStyle,
    },
    {
      value: "FEMALE" as "ALL" | "MALE" | "FEMALE",
      label: "Female",
      checkedColor: "#000",
      uncheckedColor: "#000",
      style:
        genderFilter === "FEMALE"
          ? styles.checkedButtonStyle
          : styles.uncheckedButtonStyle,
      labelStyle:
        genderFilter === "FEMALE"
          ? styles.checkedTextStyle
          : styles.uncheckedTextStyle,
    },
  ];

  if (isLoading && !refreshing) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, gap: 10 }}>
      <Searchbar
        placeholder="Search"
        onChangeText={(text) => {
          setSearchText(text);
          setPage(1);
        }}
        value={searchText}
        clearTextOnFocus={true}
        onClearIconPress={() => {
          setSearchText("");
          setPage(1);
        }}
        style={styles.searchBar}
      />
      <SegmentedButtons
        value={genderFilter}
        onValueChange={(value: "ALL" | "MALE" | "FEMALE") => {
          setGenderFilter(value);
          setPage(1);
        }}
        buttons={segmentedButtons}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {data?.penguins?.map((item: Penguin) => (
          <Card
            key={item.id}
            style={[styles.listItem, { backgroundColor: "white" }]}
          >
            <Card.Title
              title={item.species + (item.name ? ` (${item.name})` : "")}
              titleStyle={styles.cardTitle}
              subtitle={`from ${item.island}`}
              right={() => (
                <View style={styles.icons}>
                  <IconButton
                    icon="eye-outline"
                    size={42}
                    iconColor="#000000"
                    onPress={() => handleViewPenguin(item)}
                  />
                  <View>
                    <IconButton
                      icon="pencil-outline"
                      size={20}
                      iconColor="#000000"
                      onPress={() =>
                        navigation.navigate("Edit", { penguin: item })
                      }
                    />
                    <IconButton
                      icon="delete-outline"
                      size={20}
                      iconColor="#000000"
                      onPress={() => handleDeletePenguin(item)}
                    />
                  </View>
                </View>
              )}
            />
          </Card>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        <Button
          mode="outlined"
          onPress={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <Text style={styles.pageText}>
          Page {page} of {data?.totalPages || 1}
        </Text>
        <Button
          mode="outlined"
          onPress={() => setPage(page + 1)}
          disabled={page >= (data?.totalPages || 1)}
        >
          Next
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  genderFilter: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  listItem: {
    marginBottom: 10,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  pageText: {
    fontSize: 16,
  },
  checkedButtonStyle: {
    backgroundColor: "#FFCC00",
    borderColor: "black",
    borderWidth: 1,
  },
  uncheckedButtonStyle: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
  },
  checkedTextStyle: {
    color: "black",
  },
  uncheckedTextStyle: {
    color: "black",
  },
  searchBar: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 30,
  },
  cardTitle: {
    color: "black",
  },
});

export default Explore;
