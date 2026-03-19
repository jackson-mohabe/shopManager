import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function SalesScreen({ navigation, route }) {
  const { role } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Screen</Text>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: "#2c3e50",
    padding: 12,
    borderRadius: 8,
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
