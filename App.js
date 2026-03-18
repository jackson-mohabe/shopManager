import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import store from "./src/store/index";
import { initDB } from "./src/db/database";

export default function App() {
  useEffect(() => {
    initDB();
    console.log("Database initialized successfully");
  }, []);

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Text>Shop Manager App</Text>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
