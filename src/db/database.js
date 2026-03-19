import { Platform } from "react-native";

let db = null;

export const initDB = async () => {
  if (Platform.OS === "web") {
    console.log("Web platform detected — using localStorage");
    if (!localStorage.getItem("products"))
      localStorage.setItem("products", JSON.stringify([]));
    if (!localStorage.getItem("sales"))
      localStorage.setItem("sales", JSON.stringify([]));
    if (!localStorage.getItem("expenses"))
      localStorage.setItem("expenses", JSON.stringify([]));
    if (!localStorage.getItem("stock_logs"))
      localStorage.setItem("stock_logs", JSON.stringify([]));
    if (!localStorage.getItem("users"))
      localStorage.setItem("users", JSON.stringify([]));
    console.log("Web database initialized successfully");
    return;
  }

  const SQLite = require("expo-sqlite");
  db = SQLite.openDatabaseSync("shopmanager.db");

  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      pin TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      buy_price REAL NOT NULL,
      sell_price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT DEFAULT (datetime('now', 'localtime')),
      total REAL NOT NULL,
      cashier TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      price REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT DEFAULT (datetime('now', 'localtime')),
      amount REAL NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS stock_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      change INTEGER NOT NULL,
      reason TEXT,
      date TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  console.log("Mobile database initialized successfully");
};

export const getCurrentDateTime = () => {
  return new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default db;
