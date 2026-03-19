import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { getCurrentDateTime } from "../db/database";

export default function ExpensesScreen({ navigation, route }) {
  const { role } = route.params;
  const [expenses, setExpenses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [dateTime, setDateTime] = useState("");

  const categories = [
    "General",
    "Rent",
    "Electricity",
    "Water",
    "Salary",
    "Transport",
    "Supplies",
    "Maintenance",
    "Other",
  ];

  useEffect(() => {
    loadExpenses();
    const interval = setInterval(() => {
      setDateTime(getCurrentDateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadExpenses = () => {
    if (Platform.OS === "web") {
      const stored = JSON.parse(localStorage.getItem("expenses") || "[]");
      setExpenses(stored);
    }
  };

  const saveExpenses = (updated) => {
    if (Platform.OS === "web") {
      localStorage.setItem("expenses", JSON.stringify(updated));
      setExpenses(updated);
    }
  };

  const handleSave = () => {
    if (!amount || !description) {
      window.alert("Please fill in amount and description");
      return;
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      window.alert("Amount must be a valid positive number");
      return;
    }

    const expense = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      category,
      date: getCurrentDateTime(),
    };

    const updated = [expense, ...expenses];
    saveExpenses(updated);
    setAmount("");
    setDescription("");
    setCategory("General");
    setModalVisible(false);
    window.alert("Expense recorded successfully");
  };

  const handleDelete = (id) => {
    if (Platform.OS === "web") {
      const confirm = window.confirm(
        "Are you sure you want to delete this expense?",
      );
      if (confirm) {
        const updated = expenses.filter((e) => e.id !== id);
        saveExpenses(updated);
      }
    }
  };

  const getTodayTotal = () => {
    const today = new Date().toLocaleDateString();
    return expenses
      .filter((e) => e.date.includes(today))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getMonthTotal = () => {
    const month = new Date().toLocaleDateString("en-GB", {
      month: "2-digit",
      year: "numeric",
    });
    return expenses
      .filter((e) => e.date.includes(month))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const renderExpense = ({ item }) => (
    <View style={styles.expenseCard}>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseDesc}>{item.description}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
      <View style={styles.expenseRight}>
        <Text style={styles.expenseAmount}>TZS {item.amount}</Text>
        {role !== "Cashier" && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Expenses</Text>
        {role !== "Cashier" && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.dateTime}>{dateTime}</Text>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: "#e74c3c" }]}>
          <Text style={styles.summaryValue}>TZS {getTodayTotal()}</Text>
          <Text style={styles.summaryLabel}>Today</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#8e44ad" }]}>
          <Text style={styles.summaryValue}>TZS {getMonthTotal()}</Text>
          <Text style={styles.summaryLabel}>This Month</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#2c3e50" }]}>
          <Text style={styles.summaryValue}>{expenses.length}</Text>
          <Text style={styles.summaryLabel}>Total Records</Text>
        </View>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderExpense}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No expenses recorded yet.</Text>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Expense</Text>

            <Text style={styles.label}>Amount (TZS) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryRow}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBtn,
                    category === cat && styles.categoryActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
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
  addBtn: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateTime: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  summaryValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  summaryLabel: {
    color: "#fff",
    fontSize: 11,
    marginTop: 2,
    opacity: 0.8,
  },
  expenseCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#e74c3c",
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDesc: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  expenseCategory: {
    fontSize: 12,
    color: "#8e44ad",
    marginTop: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 2,
  },
  expenseRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  deleteText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#7f8c8d",
    marginTop: 40,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 15,
  },
  categoryRow: {
    marginBottom: 15,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2c3e50",
    marginRight: 8,
  },
  categoryActive: {
    backgroundColor: "#2c3e50",
  },
  categoryText: {
    color: "#2c3e50",
    fontSize: 13,
  },
  categoryTextActive: {
    color: "#fff",
  },
  saveBtn: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#7f8c8d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  cancelBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
