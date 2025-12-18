import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Navbar = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoHome = () => {
    navigation.navigate("Home");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "userId"]);

      const response = await fetch(
        "http://localhost:4000/api/v3/deliver/logout",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Logout successfully",
        });

        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Logout failed",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Server error",
      });
      console.log("Logout error:", error);
    }
  };

  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity onPress={handleGoBack} style={styles.iconButton}>
        <FontAwesome name="arrow-left" size={22} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGoHome} style={styles.iconButton}>
        <FontAwesome name="home" size={22} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
        <FontAwesome name="sign-out" size={22} color="#333" />
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbarContainer: {
    position: "absolute", // ✅ mobile correct (not fixed)
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: "#f0f0f0",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  iconButton: {
    padding: 10,
  },
});
