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

  const handleViewPenguin = (penguin: Penguin) => {
    navigation.navigate("View", { penguin });
  };

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
      />
      <SegmentedButtons
        value={genderFilter}
        onValueChange={(value) => {
          setGenderFilter(value);
          setPage(1);
        }}
        buttons={[
          { value: "ALL", label: "All" },
          { value: "MALE", label: "Male" },
          { value: "FEMALE", label: "Female" },
        ]}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {data?.penguins?.map((item: Penguin) => (
          <Card
            key={item.id}
            style={[styles.listItem, { backgroundColor: "#F8F8FF" }]}
          >
            <Card.Title
              title={item.species + (item.name ? ` (${item.name})` : "")}
              titleStyle={{ color: "#4B0082" }}
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
});

export default Explore;
