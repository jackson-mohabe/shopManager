import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function DashboardScreen({ navigation, route }) {
  const { role } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Shop Manager</Text>
      <Text style={styles.role}>Logged in as: {role}</Text>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  role: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 30,
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
