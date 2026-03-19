import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { getCurrentDateTime } from "../db/database";

export default function SalesScreen({ navigation, route }) {
  const { role } = route.params;
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [search, setSearch] = useState("");
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
      const storedProducts = JSON.parse(
        localStorage.getItem("products") || "[]",
      );
      const storedSales = JSON.parse(localStorage.getItem("sales") || "[]");
      setProducts(storedProducts);
      setSales(storedSales);
    }
  };

  const addToCart = (product) => {
    if (product.quantity <= 0) {
      window.alert("This product is out of stock");
      return;
    }
    const existing = cart.find((c) => c.id === product.id);
    if (existing) {
      if (existing.cartQty >= product.quantity) {
        window.alert("Not enough stock available");
        return;
      }
      setCart(
        cart.map((c) =>
          c.id === product.id ? { ...c, cartQty: c.cartQty + 1 } : c,
        ),
      );
    } else {
      setCart([...cart, { ...product, cartQty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const updateCartQty = (id, qty) => {
    const product = products.find((p) => p.id === id);
    if (qty > product.quantity) {
      window.alert("Not enough stock available");
      return;
    }
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map((c) => (c.id === id ? { ...c, cartQty: qty } : c)));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.sell_price * item.cartQty, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      window.alert("Cart is empty — add products first");
      return;
    }

    const confirm = window.confirm(`Confirm sale of TZS ${getTotal()}?`);
    if (!confirm) return;

    const updatedProducts = products.map((p) => {
      const cartItem = cart.find((c) => c.id === p.id);
      if (cartItem) {
        return { ...p, quantity: p.quantity - cartItem.cartQty };
      }
      return p;
    });

    const sale = {
      id: Date.now(),
      date: getCurrentDateTime(),
      items: cart,
      total: getTotal(),
      cashier: role,
    };

    const updatedSales = [sale, ...sales];

    if (Platform.OS === "web") {
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      localStorage.setItem("sales", JSON.stringify(updatedSales));
    }

    setProducts(updatedProducts);
    setSales(updatedSales);
    setCart([]);
    setModalVisible(false);
    window.alert("Sale recorded successfully");
  };

  const getTodaySales = () => {
    const today = new Date().toLocaleDateString();
    return sales.filter((s) => s.date.includes(today));
  };

  const getTodayTotal = () => {
    return getTodaySales().reduce((sum, s) => sum + s.total, 0);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[styles.productCard, item.quantity <= 0 && styles.outOfStock]}
      onPress={() => addToCart(item)}
    >
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productCategory}>{item.category}</Text>
      <Text style={styles.productPrice}>TZS {item.sell_price}</Text>
      <Text
        style={[
          styles.productQty,
          item.quantity <= 5 && styles.lowStock,
          item.quantity <= 0 && styles.outOfStockText,
        ]}
      >
        {item.quantity <= 0 ? "Out of Stock" : `Stock: ${item.quantity}`}
      </Text>
    </TouchableOpacity>
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartInfo}>
        <Text style={styles.cartName}>{item.name}</Text>
        <Text style={styles.cartPrice}>
          TZS {item.sell_price} x {item.cartQty} = TZS{" "}
          {item.sell_price * item.cartQty}
        </Text>
      </View>
      <View style={styles.cartControls}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateCartQty(item.id, item.cartQty - 1)}
        >
          <Text style={styles.qtyBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.cartQty}>{item.cartQty}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateCartQty(item.id, item.cartQty + 1)}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => removeFromCart(item.id)}
        >
          <Text style={styles.removeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSale = ({ item }) => (
    <View style={styles.saleCard}>
      <Text style={styles.saleDate}>{item.date}</Text>
      <Text style={styles.saleCashier}>Cashier: {item.cashier}</Text>
      <Text style={styles.saleItems}>
        Items: {item.items.map((i) => `${i.name}(${i.cartQty})`).join(", ")}
      </Text>
      <Text style={styles.saleTotal}>Total: TZS {item.total}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Sales</Text>
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => setHistoryVisible(true)}
        >
          <Text style={styles.historyText}>History</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.dateTime}>{dateTime}</Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>TZS {getTodayTotal()}</Text>
          <Text style={styles.summaryLabel}>Today's Sales</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{getTodaySales().length}</Text>
          <Text style={styles.summaryLabel}>Transactions</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{cart.length}</Text>
          <Text style={styles.summaryLabel}>In Cart</Text>
        </View>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No products found. Add products in Stock first.
          </Text>
        }
      />

      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.cartBtnText}>
            View Cart ({cart.length}) — TZS {getTotal()}
          </Text>
        </TouchableOpacity>
      )}

      {/* Cart Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cart</Text>
            <FlatList
              data={cart}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderCartItem}
              style={{ maxHeight: 300 }}
            />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>TZS {getTotal()}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>
                Confirm Sale — TZS {getTotal()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sales History Modal */}
      <Modal visible={historyVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sales History</Text>
            <FlatList
              data={sales}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderSale}
              style={{ maxHeight: 400 }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No sales recorded yet.</Text>
              }
            />
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setHistoryVisible(false)}
            >
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
          </View>
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
  historyBtn: {
    backgroundColor: "#8e44ad",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  historyText: {
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
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#2c3e50",
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  summaryValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  summaryLabel: {
    color: "#bdc3c7",
    fontSize: 11,
    marginTop: 2,
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: {
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    width: "48%",
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  outOfStock: {
    borderLeftColor: "#bdc3c7",
    opacity: 0.6,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  productCategory: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    color: "#27ae60",
    fontWeight: "bold",
    marginTop: 4,
  },
  productQty: {
    fontSize: 12,
    color: "#2c3e50",
    marginTop: 2,
  },
  lowStock: {
    color: "#e67e22",
  },
  outOfStockText: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
  cartBtn: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cartBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    marginBottom: 15,
    textAlign: "center",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cartInfo: {
    flex: 1,
  },
  cartName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  cartPrice: {
    fontSize: 12,
    color: "#27ae60",
    marginTop: 2,
  },
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  qtyBtn: {
    backgroundColor: "#2c3e50",
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cartQty: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: {
    backgroundColor: "#e74c3c",
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#27ae60",
  },
  checkoutBtn: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#7f8c8d",
    marginTop: 20,
    fontSize: 15,
  },
  saleCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
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
});
