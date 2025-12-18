import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [logoScale] = useState(new Animated.Value(1));

  useEffect(() => {
    checkLoggedIn();
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Logo pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade and slide in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        navigation.navigate("Orders");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    // try {
    //   const response = await fetch("http://localhost:4000/api/v3/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });
    //   const data = await response.json();

    //   if (data.success) {
    //     Toast.show({
    //       type: "success",
    //       text1: "Login successful",
    //     });
    //     await AsyncStorage.setItem("token", data.token);
    //     await AsyncStorage.setItem("userId", data.user._id);
    //     navigation.navigate("Orders");
    //   } else {
    //     Toast.show({
    //       type: "error",
    //       text1: "Login failed",
    //     });
    //     console.log(data.error);
    //   }
    // } catch (error) {
    //   console.log(error);
    //   Toast.show({
    //     type: "error",
    //     text1: "Connection error",
    //   });
    // } finally {
    //   setLoading(false);
    // }

    navigation.navigate("Orders");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0f172a" }}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={require("../images/delivery.jpg")}
        style={styles.imageBackground}
      >
        <View style={styles.overlay} />
        <Animated.View
          style={[
            styles.brandView,
            {
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Icon name="truck" style={styles.brandIcon} />
          </View>
          <Text style={styles.brandViewText}>DropSell</Text>
          <Text style={styles.brandSubtext}>Fast & Reliable Delivery</Text>
        </Animated.View>
      </ImageBackground>

      <Animated.View
        style={[
          styles.bottomView,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.contentContainer}>
          <View style={styles.welcomeHeader}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.welcomeSubtext}>
              Sign in to continue your journey
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputLabel}>
                <Icon name="envelope" style={styles.labelIcon} />
                <Text style={styles.labelText}>Email Address</Text>
              </View>
              <View style={styles.inputContainer}>
                <Icon name="at" style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  style={styles.textInput}
                  placeholder="your@email.com"
                  placeholderTextColor="#94a3b8"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
                {email.length > 0 && (
                  <Icon name="check-circle" style={styles.validIcon} />
                )}
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputLabel}>
                <Icon name="lock" style={styles.labelIcon} />
                <Text style={styles.labelText}>Password</Text>
              </View>
              <View style={styles.inputContainer}>
                <Icon name="key" style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Icon
                    name={showPassword ? "eye" : "eye-slash"}
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <Animated.View style={styles.loadingDot} />
                <Text style={styles.loginBtnText}>Signing in...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.loginBtnText}>Sign In</Text>
                <Icon name="arrow-right" style={styles.arrowIcon} />
              </>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
}

export default Login;

const styles = StyleSheet.create({
  imageBackground: {
    height: Dimensions.get("window").height / 2.5,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
  },
  brandView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(251, 92, 66, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(251, 92, 66, 0.5)",
  },
  brandIcon: {
    color: "#fb5c42",
    fontSize: 50,
  },
  brandViewText: {
    color: "white",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 2,
  },
  bottomView: {
    flex: 1.5,
    backgroundColor: "#ffffff",
    marginTop: -50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  contentContainer: {
    padding: 32,
  },
  welcomeHeader: {
    marginBottom: 32,
  },
  welcomeText: {
    color: "#0f172a",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  welcomeSubtext: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "400",
  },
  formContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  labelIcon: {
    color: "#fb5c42",
    fontSize: 14,
    marginRight: 8,
  },
  labelText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  inputIcon: {
    color: "#94a3b8",
    fontSize: 18,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#0f172a",
    paddingVertical: 8,
  },
  validIcon: {
    color: "#10b981",
    fontSize: 18,
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    color: "#64748b",
    fontSize: 18,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  forgotPasswordText: {
    color: "#fb5c42",
    fontSize: 14,
    fontWeight: "600",
  },
  loginBtn: {
    backgroundColor: "#fb5c42",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fb5c42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 8,
  },
  loginBtnDisabled: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0.1,
  },
  loginBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  arrowIcon: {
    color: "white",
    fontSize: 18,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginRight: 12,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signupText: {
    color: "#64748b",
    fontSize: 15,
  },
  signupLink: {
    color: "#fb5c42",
    fontSize: 15,
    fontWeight: "700",
  },
});
