import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Penguin,
  PenguinCreateData,
  PenguinUpdateData,
  useCreatePenguin,
  useDeletePenguin,
  useInfinitePenguins,
  useUpdatePenguin,
} from "../lib/penguinApi"; // Adjust path if needed

/**
 * Performance Best Practice:
 * By wrapping our list item in React.memo, we prevent it from re-rendering
 * unless its own props (the `item` object) change. This directly addresses
 * the advice in the VirtualizedList warning.
 */
const PenguinItem = React.memo(({ item }: { item: Penguin }) => {
  // Get mutation hooks for this specific item
  const { mutate: deletePenguin, isPending: isDeleting } = useDeletePenguin();
  const { mutate: updatePenguin, isPending: isUpdating } = useUpdatePenguin();

  // Local state for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editSpecies, setEditSpecies] = useState(item.species);
  const [editIsland, setEditIsland] = useState(item.island);

  // Combined pending state for operations on this item
  const isOperationPending = isDeleting || isUpdating;

  const handleUpdate = () => {
    if (!editSpecies.trim() || !editIsland.trim()) {
      Alert.alert("Validation Error", "Species and Island cannot be empty.");
      return;
    }
    const updateData: PenguinUpdateData = {
      species: editSpecies.trim(),
      island: editIsland.trim(),
    };
    updatePenguin({ id: item.id, penguinData: updateData });
    // Assume success and close edit mode immediately; React Query will refetch and update
    // if there was an actual change, the item will re-render with the new data.
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${item.species} from ${item.island}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deletePenguin(item.id),
        },
      ]
    );
  };

  return (
    <View style={styles.itemContainer}>
      {isEditing ? (
        <View style={styles.editForm}>
          <TextInput
            style={styles.editInput}
            value={editSpecies}
            onChangeText={setEditSpecies}
            placeholder="Species"
            editable={!isUpdating} // Disable input while updating
          />
          <TextInput
            style={styles.editInput}
            value={editIsland}
            onChangeText={setEditIsland}
            placeholder="Island"
            editable={!isUpdating} // Disable input while updating
          />
          <View style={styles.editButtons}>
            <Button
              title={isUpdating ? "Saving..." : "Save"}
              onPress={handleUpdate}
              disabled={isUpdating || !editSpecies.trim() || !editIsland.trim()}
            />
            <Button
              title="Cancel"
              onPress={() => setIsEditing(false)}
              disabled={isUpdating}
            />
          </View>
        </View>
      ) : (
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>
            {item.species} - Island: {item.island}
          </Text>
          <Text style={styles.itemDetail}>
            Beak Length: {item.beakLengthMm ?? "N/A"} mm
          </Text>
          <Text style={styles.itemDetail}>
            Body Mass: {item.bodyMassG ?? "N/A"} g
          </Text>
        </View>
      )}

      <View style={styles.itemActions}>
        {isOperationPending && (
          <ActivityIndicator
            size="small"
            color="#0000ff"
            style={styles.actionSpinner}
          />
        )}
        {!isEditing && (
          <Button
            title="Edit"
            onPress={() => {
              setEditSpecies(item.species);
              setEditIsland(item.island);
              setIsEditing(true);
            }}
            disabled={isOperationPending}
          />
        )}
        {!isEditing && (
          <Button
            title={isDeleting ? "Deleting..." : "Delete"}
            color="tomato"
            onPress={handleDelete}
            disabled={isOperationPending}
          />
        )}
      </View>
    </View>
  );
});

const PenguinManager = () => {
  // Use the infinite query hook for listing
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePenguins();

  // Use the create mutation hook
  const {
    mutate: createPenguin,
    isPending: isCreating,
    error: createError,
  } = useCreatePenguin();

  // Flatten the paginated data for FlatList
  const penguins = data?.pages.flatMap((page) => page.penguins) ?? [];

  // Local state for the create form
  const [newSpecies, setNewSpecies] = useState("");
  const [newIsland, setNewIsland] = useState("");

  const handleAddPenguin = () => {
    if (newSpecies.trim() && newIsland.trim()) {
      const newPenguinData: PenguinCreateData = {
        species: newSpecies.trim(),
        island: newIsland.trim(),
        // Assign default/null values for other properties as they are not input fields
        beakLengthMm: null,
        beakDepthMm: null,
        flipperLengthMm: null,
        bodyMassG: null,
        sex: null,
        name: "",
      };
      createPenguin(newPenguinData);
      setNewSpecies("");
      setNewIsland("");
    } else {
      Alert.alert(
        "Validation Error",
        "Please fill in all fields (Species and Island)."
      );
    }
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Error handling for create operation
  React.useEffect(() => {
    if (createError) {
      Alert.alert("Creation Error", createError.message);
    }
  }, [createError]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading penguins...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Penguin Directory</Text>

      {/* Create Form */}
      <View style={styles.createForm}>
        <TextInput
          style={styles.input}
          placeholder="Species"
          value={newSpecies}
          onChangeText={setNewSpecies}
          editable={!isCreating} // Disable input while creating
        />
        <TextInput
          style={styles.input}
          placeholder="Island"
          value={newIsland}
          onChangeText={setNewIsland}
          editable={!isCreating} // Disable input while creating
        />
        <Button
          title={isCreating ? "Adding..." : "Add Penguin"}
          onPress={handleAddPenguin}
          disabled={isCreating || !newSpecies.trim() || !newIsland.trim()} // Disable if creating or inputs empty
        />
      </View>

      <FlatList
        data={penguins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PenguinItem item={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={{ marginVertical: 20 }} />
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No penguins found. Add one!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  // Item Styles
  itemContainer: {
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 14,
    color: "#555",
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  actionSpinner: {
    marginRight: 10,
  },
  // Create Form Styles
  createForm: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 1,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  // Edit Form Styles
  editForm: {
    flex: 1,
    marginRight: 10,
  },
  editInput: {
    height: 40,
    borderColor: "#a0a0a0",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 8,
    paddingHorizontal: 8,
    fontSize: 15,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
});

export default PenguinManager;
