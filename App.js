import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Provider } from "react-redux";
import store from "./src/store/index";
import { initDB } from "./src/db/database";
import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import SalesScreen from "./src/screens/SalesScreen";
import StockScreen from "./src/screens/StockScreen";
import ExpensesScreen from "./src/screens/ExpensesScreen";
import ReportsScreen from "./src/screens/ReportsScreen";

// Fix React Navigation web style issue
import { StyleSheet as RNStyleSheet } from "react-native";
const _create = RNStyleSheet.create.bind(RNStyleSheet);
RNStyleSheet.create = (styles) => {
  Object.keys(styles).forEach((key) => {
    if (styles[key] && typeof styles[key] === "object") {
      Object.keys(styles[key]).forEach((prop) => {
        if (Array.isArray(styles[key][prop])) {
          styles[key][prop] = styles[key][prop].join(" ");
        }
      });
    }
  });
  return _create(styles);
};

const Stack = createNativeStackNavigator();

const autoBackup = () => {
  try {
    const data = {
      products: localStorage.getItem("products") || "[]",
      sales: localStorage.getItem("sales") || "[]",
      expenses: localStorage.getItem("expenses") || "[]",
      backup_time: new Date().toLocaleString(),
    };
    localStorage.setItem("auto_backup", JSON.stringify(data));
    console.log("Auto backup saved at", data.backup_time);
  } catch (error) {
    console.error("Auto backup failed:", error);
  }
};

export default function App() {
  useEffect(() => {
    initDB().then(() => {
      console.log("App ready");
    });

    autoBackup();
    const backupInterval = setInterval(autoBackup, 5 * 60 * 1000);
    return () => clearInterval(backupInterval);
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Sales"
            component={SalesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Stock"
            component={StockScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Expenses"
            component={ExpensesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Reports"
            component={ReportsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
