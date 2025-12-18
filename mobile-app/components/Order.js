import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Animated,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import Navbar from "./Naverbar";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Order({ navigation }) {
  const route = useRoute();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    fetchData();
    startAnimations();
  }, []);

  const staticOrders = [
    {
      _id: "123abc",
      paymentInfo: { orderStatus: "Processing", totalPrice: 49.99 },
      shippingInfo: { adress: "123 Main St, City", phoneNumber: "1234567890" },
      orderItems: [{}, {}],
    },
    {
      _id: "456def",
      paymentInfo: { orderStatus: "Shipped", totalPrice: 89.5 },
      shippingInfo: { adress: "456 Elm St, City", phoneNumber: "0987654321" },
      orderItems: [{}],
    },
  ];

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:4000/api/v4/deliver/orders?deliverUserId=${userId}`
      );

      if (!response.ok) throw new Error("Network response not ok");

      const jsonData = await response.json();
      // If API returns empty array, fallback to static orders
      setData(jsonData.orders.length ? jsonData.orders : staticOrders);
    } catch (error) {
      console.log("API error, showing static orders:", error);
      setData(staticOrders);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return styles.statusDelivered;
      case "Cancelled":
        return styles.statusCancelled;
      case "Processing":
        return styles.statusProcessing;
      case "Shipped":
        return styles.statusShipped;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return "check-circle";
      case "Cancelled":
        return "times-circle";
      case "Processing":
        return "clock-o";
      case "Shipped":
        return "truck";
      default:
        return "info-circle";
    }
  };

  const handleOrderPress = (order) => {
    navigation.navigate("OrderDetails", {
      orderId: order._id,
      orderData: order,
    });
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#fb5c42"]}
          />
        }
      >
        <ImageBackground
          source={require("../images/delivery.jpg")}
          style={styles.imageBackground}
        >
          <View style={styles.overlay} />
          <View style={styles.brandView}>
            <View style={styles.iconContainer}>
              <Icon name="dropbox" style={styles.brandIcon} />
            </View>
            <Text style={styles.brandText}>DropSell</Text>
            <Text style={styles.brandSubtext}>Order Management</Text>
          </View>
        </ImageBackground>

        <Animated.View
          style={[
            styles.ordersContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.headerTitle}>Your Orders</Text>
              <Text style={styles.headerSubtitle}>
                {data.length} {data.length === 1 ? "order" : "orders"} found
              </Text>
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter" style={styles.filterIcon} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fb5c42" />
              <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
          ) : data.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="inbox" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No orders yet</Text>
              <Text style={styles.emptySubtext}>
                Your orders will appear here
              </Text>
            </View>
          ) : (
            data.map((order, index) => (
              <TouchableOpacity
                key={order._id}
                style={styles.orderCard}
                onPress={() => handleOrderPress(order)}
                activeOpacity={0.7}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderIdSection}>
                    <Icon name="hashtag" style={styles.orderIdIcon} />
                    <Text style={styles.orderIdText}>
                      Order #{order._id.slice(-6).toUpperCase()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      getStatusStyle(order.paymentInfo.orderStatus),
                    ]}
                  >
                    <Icon
                      name={getStatusIcon(order.paymentInfo.orderStatus)}
                      style={styles.statusIcon}
                    />
                    <Text style={styles.statusText}>
                      {order.paymentInfo.orderStatus}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconWrapper}>
                      <Icon name="map-marker" style={styles.detailIcon} />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Delivery Address</Text>
                      <Text style={styles.detailValue}>
                        {order.shippingInfo.adress}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailIconWrapper}>
                      <Icon name="phone" style={styles.detailIcon} />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Phone Number</Text>
                      <Text style={styles.detailValue}>
                        {order.shippingInfo.phoneNumber}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailIconWrapper}>
                      <Icon name="shopping-bag" style={styles.detailIcon} />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Items</Text>
                      <Text style={styles.detailValue}>
                        {order.orderItems?.length || 0} item(s)
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.orderFooter}>
                  <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Total Amount</Text>
                    <Text style={styles.priceValue}>
                      ${order.paymentInfo.totalPrice}
                    </Text>
                  </View>
                  <View style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                    <Icon name="arrow-right" style={styles.viewButtonIcon} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  contentContainer: {
    flex: 1,
    marginTop: 60,
  },
  imageBackground: {
    height: Dimensions.get("window").height / 3.5,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
  },
  brandView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(251, 92, 66, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "rgba(251, 92, 66, 0.5)",
  },
  brandIcon: {
    color: "#fb5c42",
    fontSize: 40,
  },
  brandText: {
    color: "white",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 4,
    letterSpacing: 1.5,
  },
  ordersContainer: {
    padding: 16,
    marginTop: -30,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fb5c42",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fb5c42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  filterIcon: {
    color: "white",
    fontSize: 18,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 64,
    color: "#cbd5e1",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8",
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderIdSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderIdIcon: {
    color: "#94a3b8",
    fontSize: 14,
    marginRight: 6,
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDelivered: {
    backgroundColor: "#dcfce7",
  },
  statusCancelled: {
    backgroundColor: "#fee2e2",
  },
  statusProcessing: {
    backgroundColor: "#fef3c7",
  },
  statusShipped: {
    backgroundColor: "#dbeafe",
  },
  statusDefault: {
    backgroundColor: "#f1f5f9",
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 16,
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  detailIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailIcon: {
    color: "#fb5c42",
    fontSize: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "600",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fb5c42",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fb5c42",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#fb5c42",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  viewButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 6,
  },
  viewButtonIcon: {
    color: "white",
    fontSize: 14,
  },
});
