import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { getCurrentDateTime } from "../db/database";

export default function DashboardScreen({ navigation, route }) {
  const { role } = route.params;
  const [dateTime, setDateTime] = useState("");
  const [todaySales, setTodaySales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [todayTransactions, setTodayTransactions] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setDateTime(getCurrentDateTime());
      loadData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    if (Platform.OS === "web") {
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const sales = JSON.parse(localStorage.getItem("sales") || "[]");
      const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

      const today = new Date().toLocaleDateString();
      const todaySalesList = sales.filter((s) => s.date.includes(today));
      const todayTotal = todaySalesList.reduce((sum, s) => sum + s.total, 0);

      const month = new Date().toLocaleDateString("en-GB", {
        month: "2-digit",
        year: "numeric",
      });
      const monthlySales = sales.filter((s) => s.date.includes(month));
      const monthlyExpenses = expenses.filter((e) => e.date.includes(month));

      const revenue = monthlySales.reduce((sum, s) => sum + s.total, 0);
      const cogs = monthlySales.reduce((sum, sale) => {
        return (
          sum +
          sale.items.reduce((itemSum, item) => {
            const product = products.find((p) => p.id === item.id);
            return itemSum + (product ? product.buy_price * item.cartQty : 0);
          }, 0)
        );
      }, 0);
      const totalExp = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
      const profit = revenue - cogs - totalExp;

      setTodaySales(todayTotal);
      setTodayTransactions(todaySalesList.length);
      setTotalProducts(products.length);
      setLowStock(products.filter((p) => p.quantity <= 5).length);
      setMonthlyProfit(profit);
    }
  };

  return (
    <View style={styles.wrapper}>
      <div
        style={{
          overflowY: "auto",
          height: "100vh",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          boxSizing: "border-box",
        }}
      >
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
          <View style={[styles.card, { backgroundColor: "#27ae60" }]}>
            <Text style={styles.cardValue}>TZS {todaySales}</Text>
            <Text style={styles.cardLabel}>Today's Sales</Text>
          </View>
          <View style={[styles.card, { backgroundColor: "#3498db" }]}>
            <Text style={styles.cardValue}>{todayTransactions}</Text>
            <Text style={styles.cardLabel}>Transactions</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.card, { backgroundColor: "#8e44ad" }]}>
            <Text style={styles.cardValue}>{totalProducts}</Text>
            <Text style={styles.cardLabel}>Total Products</Text>
          </View>
          <View style={[styles.card, { backgroundColor: "#e74c3c" }]}>
            <Text style={styles.cardValue}>{lowStock}</Text>
            <Text style={styles.cardLabel}>Low Stock</Text>
          </View>
        </View>

        <View style={styles.profitCard}>
          <Text style={styles.profitLabel}>Monthly Profit</Text>
          <Text
            style={[
              styles.profitValue,
              { color: monthlyProfit >= 0 ? "#27ae60" : "#e74c3c" },
            ]}
          >
            TZS {monthlyProfit}
          </Text>
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

        <div style={{ height: "40px" }} />
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
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
    marginBottom: 10,
    gap: 10,
  },
  card: {
    flex: 1,
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
  profitCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  profitLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  profitValue: {
    fontSize: 20,
    fontWeight: "bold",
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
