import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  View,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        navigation.replace("Orders");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Email and password are required",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/v3/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userId", data.user._id);

        Toast.show({
          type: "success",
          text1: "Login successful",
        });

        navigation.replace("Orders");
      } else {
        Toast.show({
          type: "error",
          text1: data.message || "Login failed",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Server error",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={require("./images/delivery.jpg")}
        style={{ height: Dimensions.get("window").height / 2.5 }}
      >
        <View style={styles.brandView}>
          <Icon name="user-circle-o" style={styles.icon} />
          <Text style={styles.brandViewText}>DropSell</Text>
        </View>
      </ImageBackground>

      <View style={styles.bottomView}>
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>

          <View style={{ marginTop: 40 }}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholder="Enter your email"
              />
              <Icon name="check" style={styles.checkIcon} />
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
              />
              <Icon name="eye" style={styles.checkIcon} />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.loginBtn}
              loading={loading}
              onPress={handleLogin}
            >
              Login
            </Button>
          </View>
        </View>
      </View>

      <Toast />
    </ScrollView>
  );
};

export default Login;
