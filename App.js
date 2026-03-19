import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import store from "./src/store/index";
import { initDB } from "./src/db/database";
import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import SalesScreen from "./src/screens/SalesScreen";
import StockScreen from "./src/screens/StockScreen";
import ExpensesScreen from "./src/screens/ExpensesScreen";
import ReportsScreen from "./src/screens/ReportsScreen";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initDB().then(() => {
      console.log("App ready");
    });
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
