import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Modal,
  ScrollView,
  Platform,
} from "react-native";

export default function StockScreen({ navigation, route }) {
  const { role } = route.params;
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    if (Platform.OS === "web") {
      const stored = JSON.parse(localStorage.getItem("products") || "[]");
      setProducts(stored);
    }
  };

  const saveProducts = (updatedProducts) => {
    if (Platform.OS === "web") {
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    }
  };

  const handleSave = () => {
    if (!name || !buyPrice || !sellPrice || !quantity) {
      if (Platform.OS === "web") {
        window.alert("Please fill in all required fields");
      } else {
        Alert.alert("Error", "Please fill in all required fields");
      }
      return;
    }

    if (isNaN(buyPrice) || isNaN(sellPrice) || isNaN(quantity)) {
      if (Platform.OS === "web") {
        window.alert("Price and quantity must be numbers");
      } else {
        Alert.alert("Error", "Price and quantity must be numbers");
      }
      return;
    }

    if (parseFloat(sellPrice) < parseFloat(buyPrice)) {
      if (Platform.OS === "web") {
        window.alert("Selling price cannot be less than buying price");
      } else {
        Alert.alert("Error", "Selling price cannot be less than buying price");
      }
      return;
    }

    if (parseInt(quantity) < 0) {
      if (Platform.OS === "web") {
        window.alert("Quantity cannot be negative");
      } else {
        Alert.alert("Error", "Quantity cannot be negative");
      }
      return;
    }

    const product = {
      id: editProduct ? editProduct.id : Date.now(),
      name,
      category,
      buy_price: parseFloat(buyPrice),
      sell_price: parseFloat(sellPrice),
      quantity: parseInt(quantity),
      updated_at: new Date().toLocaleString(),
    };

    if (editProduct) {
      const updated = products.map((p) =>
        p.id === editProduct.id ? product : p,
      );
      saveProducts(updated);
      if (Platform.OS === "web") {
        window.alert("Product updated successfully");
      } else {
        Alert.alert("Success", "Product updated successfully");
      }
    } else {
      const updated = [...products, product];
      saveProducts(updated);
      if (Platform.OS === "web") {
        window.alert("Product added successfully");
      } else {
        Alert.alert("Success", "Product added successfully");
      }
    }

    clearForm();
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    if (Platform.OS === "web") {
      const confirm = window.confirm(
        "Are you sure you want to delete this product?",
      );
      if (confirm) {
        const updated = products.filter((p) => p.id !== id);
        saveProducts(updated);
      }
    } else {
      Alert.alert(
        "Delete Product",
        "Are you sure you want to delete this product?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              const updated = products.filter((p) => p.id !== id);
              saveProducts(updated);
            },
          },
        ],
      );
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setName(product.name);
    setCategory(product.category);
    setBuyPrice(String(product.buy_price));
    setSellPrice(String(product.sell_price));
    setQuantity(String(product.quantity));
    setModalVisible(true);
  };

  const clearForm = () => {
    setEditProduct(null);
    setName("");
    setCategory("");
    setBuyPrice("");
    setSellPrice("");
    setQuantity("");
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderProduct = ({ item }) => (
    <View
      style={[styles.productCard, item.quantity <= 5 && styles.lowStockCard]}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>
          Buy: TZS {item.buy_price} | Sell: TZS {item.sell_price}
        </Text>
        <Text
          style={[styles.productQty, item.quantity <= 5 && styles.lowStockText]}
        >
          Qty: {item.quantity}
          {item.quantity <= 5 ? " ⚠ Low Stock" : ""}
        </Text>
      </View>
      {role !== "Cashier" && (
        <View style={styles.productActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Stock Management</Text>
        {role !== "Cashier" && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              clearForm();
              setModalVisible(true);
            }}
          >
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.statsRow}>
        <Text style={styles.statText}>Total Products: {products.length}</Text>
        <Text style={[styles.statText, { color: "#e74c3c" }]}>
          Low Stock: {products.filter((p) => p.quantity <= 5).length}
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderProduct}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No products found. Add your first product.
          </Text>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editProduct ? "Edit Product" : "Add New Product"}
            </Text>

            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category"
              value={category}
              onChangeText={setCategory}
            />

            <Text style={styles.label}>Buying Price (TZS) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter buying price"
              value={buyPrice}
              onChangeText={setBuyPrice}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Selling Price (TZS) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter selling price"
              value={sellPrice}
              onChangeText={setSellPrice}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Quantity *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>
                {editProduct ? "Update Product" : "Save Product"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                clearForm();
                setModalVisible(false);
              }}
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
    marginBottom: 15,
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
    backgroundColor: "#27ae60",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  lowStockCard: {
    borderLeftColor: "#e74c3c",
    backgroundColor: "#fff5f5",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  productCategory: {
    fontSize: 13,
    color: "#7f8c8d",
    marginTop: 2,
  },
  productPrice: {
    fontSize: 13,
    color: "#27ae60",
    marginTop: 4,
  },
  productQty: {
    fontSize: 13,
    color: "#2c3e50",
    marginTop: 2,
  },
  lowStockText: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
  productActions: {
    flexDirection: "column",
    gap: 6,
  },
  editBtn: {
    backgroundColor: "#3498db",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  editText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontSize: 13,
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
  saveBtn: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#e74c3c",
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
