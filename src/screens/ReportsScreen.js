import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { getCurrentDateTime } from "../db/database";
import * as XLSX from "xlsx";

export default function ReportsScreen({ navigation, route }) {
  const { role } = route.params;
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setDateTime(getCurrentDateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    if (Platform.OS === "web") {
      setSales(JSON.parse(localStorage.getItem("sales") || "[]"));
      setExpenses(JSON.parse(localStorage.getItem("expenses") || "[]"));
      setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
    }
  };

  const getMonthData = () => {
    const month = new Date().toLocaleDateString("en-GB", {
      month: "2-digit",
      year: "numeric",
    });
    const monthlySales = sales.filter((s) => s.date.includes(month));
    const monthlyExpenses = expenses.filter((e) => e.date.includes(month));
    return { monthlySales, monthlyExpenses };
  };

  const getTodaySales = () => {
    const today = new Date().toLocaleDateString();
    return sales.filter((s) => s.date.includes(today));
  };

  const getTotalRevenue = () => {
    const { monthlySales } = getMonthData();
    return monthlySales.reduce((sum, s) => sum + s.total, 0);
  };

  const getTotalCOGS = () => {
    const { monthlySales } = getMonthData();
    return monthlySales.reduce((sum, sale) => {
      return (
        sum +
        sale.items.reduce((itemSum, item) => {
          const product = products.find((p) => p.id === item.id);
          return itemSum + (product ? product.buy_price * item.cartQty : 0);
        }, 0)
      );
    }, 0);
  };

  const getTotalExpenses = () => {
    const { monthlyExpenses } = getMonthData();
    return monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  };

  const getProfit = () => {
    return getTotalRevenue() - getTotalCOGS() - getTotalExpenses();
  };

  const exportToExcel = () => {
    try {
      const { monthlySales, monthlyExpenses } = getMonthData();

      const salesData = monthlySales.map((s) => ({
        Date: s.date,
        Cashier: s.cashier,
        Items: s.items.map((i) => `${i.name}(${i.cartQty})`).join(", "),
        Total: s.total,
      }));

      const expensesData = monthlyExpenses.map((e) => ({
        Date: e.date,
        Description: e.description,
        Category: e.category,
        Amount: e.amount,
      }));

      const stockData = products.map((p) => ({
        Name: p.name,
        Category: p.category,
        "Buy Price": p.buy_price,
        "Sell Price": p.sell_price,
        Quantity: p.quantity,
        Status: p.quantity <= 5 ? "Low Stock" : "OK",
      }));

      const summaryData = [
        { Item: "Total Revenue", Amount: getTotalRevenue() },
        { Item: "Cost of Goods Sold", Amount: getTotalCOGS() },
        { Item: "Total Expenses", Amount: getTotalExpenses() },
        { Item: "Net Profit", Amount: getProfit() },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(salesData),
        "Sales",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(expensesData),
        "Expenses",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(stockData),
        "Stock",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(summaryData),
        "Summary",
      );

      const month = new Date().toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });

      XLSX.writeFile(wb, `ShopReport_${month}.xlsx`);
      window.alert("Report exported successfully");
    } catch (error) {
      window.alert("Export failed: " + error.message);
    }
  };

  const todaySales = getTodaySales();
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
  const profit = getProfit();

  return (
    <View style={styles.wrapper}>
      <div
        style={{
          overflowY: "auto",
          height: "100vh",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          boxSizing: "border-box",
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Reports</Text>
          <TouchableOpacity style={styles.exportBtn} onPress={exportToExcel}>
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.dateTime}>{dateTime}</Text>

        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <View style={styles.summaryRow}>
          <View style={[styles.card, { backgroundColor: "#27ae60" }]}>
            <Text style={styles.cardValue}>TZS {todayTotal}</Text>
            <Text style={styles.cardLabel}>Today's Revenue</Text>
          </View>
          <View style={[styles.card, { backgroundColor: "#3498db" }]}>
            <Text style={styles.cardValue}>{todaySales.length}</Text>
            <Text style={styles.cardLabel}>Transactions</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Monthly Profit Report</Text>
        <View style={styles.profitContainer}>
          <View style={styles.profitRow}>
            <Text style={styles.profitLabel}>Total Revenue</Text>
            <Text style={[styles.profitValue, { color: "#27ae60" }]}>
              TZS {getTotalRevenue()}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.profitRow}>
            <Text style={styles.profitLabel}>Cost of Goods Sold</Text>
            <Text style={[styles.profitValue, { color: "#e74c3c" }]}>
              - TZS {getTotalCOGS()}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.profitRow}>
            <Text style={styles.profitLabel}>Total Expenses</Text>
            <Text style={[styles.profitValue, { color: "#e74c3c" }]}>
              - TZS {getTotalExpenses()}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.profitRow}>
            <Text style={styles.profitLabel}>Net Profit</Text>
            <Text
              style={[
                styles.profitValue,
                styles.profitTotal,
                { color: profit >= 0 ? "#27ae60" : "#e74c3c" },
              ]}
            >
              TZS {profit}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Sales</Text>
        {sales.length === 0 ? (
          <Text style={styles.emptyText}>No sales recorded yet.</Text>
        ) : (
          sales.slice(0, 5).map((sale) => (
            <View key={sale.id} style={styles.saleCard}>
              <Text style={styles.saleDate}>{sale.date}</Text>
              <Text style={styles.saleCashier}>Cashier: {sale.cashier}</Text>
              <Text style={styles.saleItems}>
                Items:{" "}
                {sale.items && sale.items.length > 0
                  ? sale.items.map((i) => `${i.name} x${i.cartQty}`).join(", ")
                  : "No items"}
              </Text>
              <Text style={styles.saleTotal}>Total: TZS {sale.total}</Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Stock Status</Text>
        {products.length === 0 ? (
          <Text style={styles.emptyText}>No products found.</Text>
        ) : (
          products.map((p) => (
            <View
              key={p.id}
              style={[styles.stockCard, p.quantity <= 5 && styles.lowStockCard]}
            >
              <Text style={styles.stockName}>{p.name}</Text>
              <Text
                style={[
                  styles.stockQty,
                  p.quantity <= 5 && styles.lowStockText,
                ]}
              >
                Qty: {p.quantity}
                {p.quantity <= 5 ? " ⚠" : ""}
              </Text>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.exportBtnLarge} onPress={exportToExcel}>
          <Text style={styles.exportBtnText}>Export Full Report to Excel</Text>
        </TouchableOpacity>

        <div style={{ height: "60px" }} />
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
    marginBottom: 10,
  },
  backBtn: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  exportBtn: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateTime: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 15,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
  profitContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
  },
  profitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  profitLabel: {
    fontSize: 15,
    color: "#2c3e50",
  },
  profitValue: {
    fontSize: 15,
    fontWeight: "bold",
  },
  profitTotal: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
  },
  saleCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  saleDate: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  saleCashier: {
    fontSize: 13,
    color: "#2c3e50",
    marginTop: 2,
  },
  saleItems: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 2,
  },
  saleTotal: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#27ae60",
    marginTop: 4,
  },
  stockCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  lowStockCard: {
    borderLeftColor: "#e74c3c",
    backgroundColor: "#fff5f5",
  },
  stockName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  stockQty: {
    fontSize: 14,
    color: "#2c3e50",
  },
  lowStockText: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#7f8c8d",
    marginTop: 10,
    fontSize: 15,
  },
  exportBtnLarge: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  exportBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
