import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const CORRECT_PIN = "1234";
const MAX_ATTEMPTS = 4;
const LOCK_TIME = 30;

export default function LoginScreen({ navigation }) {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timer, setTimer] = useState(0);
  const [role, setRole] = useState("Cashier");

  useEffect(() => {
    let interval;
    if (locked && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [locked, timer]);

  const handleLogin = () => {
    if (locked) return;

    if (pin === CORRECT_PIN) {
      setAttempts(0);
      setPin("");
      navigation.navigate("Dashboard", { role });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin("");

      if (newAttempts >= MAX_ATTEMPTS) {
        setLocked(true);
        setTimer(LOCK_TIME);
        Alert.alert(
          "App Locked",
          `Too many failed attempts. Try again in ${LOCK_TIME} seconds.`,
        );
      } else {
        Alert.alert(
          "Wrong PIN",
          `Incorrect PIN. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`,
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop Manager</Text>
      <Text style={styles.subtitle}>Select Role</Text>

      <View style={styles.roleContainer}>
        {["Owner", "Manager", "Cashier"].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleBtn, role === r && styles.roleActive]}
            onPress={() => setRole(r)}
          >
            <Text
              style={[styles.roleText, role === r && styles.roleTextActive]}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter PIN"
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
        value={pin}
        onChangeText={setPin}
        editable={!locked}
      />

      {locked && (
        <Text style={styles.lockText}>
          App locked. Try again in {timer} seconds.
        </Text>
      )}

      {attempts > 0 && !locked && (
        <Text style={styles.errorText}>
          Wrong PIN. {MAX_ATTEMPTS - attempts} attempts remaining.
        </Text>
      )}

      <TouchableOpacity
        style={[styles.loginBtn, locked && styles.loginBtnDisabled]}
        onPress={handleLogin}
        disabled={locked}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 20,
  },
  roleContainer: {
    flexDirection: "row",
    marginBottom: 30,
    gap: 10,
  },
  roleBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2c3e50",
  },
  roleActive: {
    backgroundColor: "#2c3e50",
  },
  roleText: {
    color: "#2c3e50",
    fontWeight: "600",
  },
  roleTextActive: {
    color: "#fff",
  },

  input: {
    width: "80%",
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    backgroundColor: "#fff",
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: 8,
  },
  lockText: {
    color: "#e74c3c",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "600",
  },
  errorText: {
    color: "#e67e22",
    fontSize: 14,
    marginBottom: 10,
  },
  loginBtn: {
    width: "80%",
    height: 55,
    backgroundColor: "#2c3e50",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  loginBtnDisabled: {
    backgroundColor: "#95a5a6",
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
