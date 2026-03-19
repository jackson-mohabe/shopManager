import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getCurrentDateTime } from "../db/database";

export default function DashboardScreen({ navigation, route }) {
  const { role } = route.params;
  const [dateTime, setDateTime] = useState("");
  const [todaySales, setTodaySales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getCurrentDateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hello, {role}</Text>
          <Text style={styles.dateTime}>{dateTime}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Today's Summary</Text>
      <View style={styles.summaryRow}>
        <View style={[styles.card, { backgroundColor: "#2ecc71" }]}>
          <Text style={styles.cardValue}>TZS {todaySales}</Text>
          <Text style={styles.cardLabel}>Today's Sales</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#3498db" }]}>
          <Text style={styles.cardValue}>{totalProducts}</Text>
          <Text style={styles.cardLabel}>Total Products</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#e74c3c" }]}>
          <Text style={styles.cardValue}>{lowStock}</Text>
          <Text style={styles.cardLabel}>Low Stock</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Modules</Text>
      <View style={styles.modulesGrid}>
        <TouchableOpacity
          style={[styles.moduleBtn, { backgroundColor: "#2c3e50" }]}
          onPress={() => navigation.navigate("Sales", { role })}
        >
          <Text style={styles.moduleIcon}>🛒</Text>
          <Text style={styles.moduleText}>Sales</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.moduleBtn, { backgroundColor: "#8e44ad" }]}
          onPress={() => navigation.navigate("Stock", { role })}
        >
          <Text style={styles.moduleIcon}>📦</Text>
          <Text style={styles.moduleText}>Stock</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.moduleBtn, { backgroundColor: "#e67e22" }]}
          onPress={() => navigation.navigate("Expenses", { role })}
        >
          <Text style={styles.moduleIcon}>💰</Text>
          <Text style={styles.moduleText}>Expenses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.moduleBtn, { backgroundColor: "#27ae60" }]}
          onPress={() => navigation.navigate("Reports", { role })}
        >
          <Text style={styles.moduleIcon}>📊</Text>
          <Text style={styles.moduleText}>Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  dateTime: {
    fontSize: 13,
    color: "#7f8c8d",
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 12,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  cardLabel: {
    fontSize: 11,
    color: "#fff",
    marginTop: 4,
    textAlign: "center",
  },
  modulesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moduleBtn: {
    width: "47%",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  moduleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  moduleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
