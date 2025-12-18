import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { DataTable } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "./Navbar";

const Order = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const response = await fetch(
        `http://localhost:4000/api/v4/deliver/orders?deliverUserId=${userId}`
      );

      const data = await response.json();
      setOrders(data?.orders || []);
    } catch (error) {
      console.log("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRowStyle = (status) => {
    if (status === "Delivered") return styles.deliveredRow;
    if (status === "Cancelled") return styles.cancelledRow;
    return styles.defaultRow;
  };

  const handleOrderPress = (orderId) => {
    navigation.navigate("OrderDetails", { orderId });
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image */}
        <ImageBackground
          source={require("./images/delivery.jpg")}
          style={styles.imageBackground}
        >
          <View style={styles.brandView}>
            <Icon name="dropbox" style={styles.brandIcon} />
            <Text style={styles.brandText}>DropSell</Text>
          </View>
        </ImageBackground>

        {/* Orders Table */}
        <DataTable style={styles.table}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>Address</DataTable.Title>
            <DataTable.Title>Phone</DataTable.Title>
            <DataTable.Title numeric>Total</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
            <DataTable.Title>View</DataTable.Title>
          </DataTable.Header>

          {orders.length === 0 && !loading && (
            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.emptyText}>No orders found</Text>
              </DataTable.Cell>
            </DataTable.Row>
          )}

          {orders.map((order) => (
            <TouchableOpacity
              key={order._id}
              onPress={() => handleOrderPress(order._id)}
            >
              <DataTable.Row
                style={getRowStyle(order.paymentInfo?.orderStatus)}
              >
                <DataTable.Cell>
                  {order.shippingInfo?.adress || "-"}
                </DataTable.Cell>
                <DataTable.Cell>
                  {order.shippingInfo?.phoneNumber || "-"}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {order.paymentInfo?.totalPrice} $
                </DataTable.Cell>
                <DataTable.Cell>
                  {order.paymentInfo?.orderStatus}
                </DataTable.Cell>
                <DataTable.Cell>
                  <Icon name="eye" size={18} />
                </DataTable.Cell>
              </DataTable.Row>
            </TouchableOpacity>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  contentContainer: {
    marginTop: 60, // Navbar height
  },

  imageBackground: {
    height: Dimensions.get("window").height / 2.5,
  },

  brandView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  brandIcon: {
    color: "#ffffff",
    fontSize: 90,
  },

  brandText: {
    color: "#ffffff",
    fontSize: 38,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  table: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  tableHeader: {
    backgroundColor: "#e0e0e0",
  },

  defaultRow: {
    backgroundColor: "#ffffff",
  },

  deliveredRow: {
    backgroundColor: "#198754",
  },

  cancelledRow: {
    backgroundColor: "#dc3545",
  },

  emptyText: {
    color: "#888",
    fontStyle: "italic",
  },
});
