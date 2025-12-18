import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import { DataTable } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Navbar from "./Navbar";

const OrderDetails = ({ route }) => {
  const { orderId } = route.params;

  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId]);

  const fetchOrder = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/v4/deliver/order/${id}`
      );
      const data = await response.json();
      setOrder(data.order);
      setOrderStatus(data.order.paymentInfo.orderStatus);
    } catch (error) {
      console.log("Fetch order error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (status) => {
    if (status === orderStatus) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/v4/deliver/order/${order._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderStatus: status }),
        }
      );

      if (response.ok) {
        Toast.show({ type: "success", text1: "Order updated successfully" });
        setOrderStatus(status);
        fetchOrder(order._id);
      } else {
        Toast.show({
          type: "error",
          text1: "Order already delivered",
        });
      }
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  if (loading || !order) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fb5c42" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <Toast />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ImageBackground
          source={require("./images/delivery.jpg")}
          style={styles.imageBackground}
        >
          <View style={styles.brandView}>
            <Icon name="truck" style={styles.brandIcon} />
            <Text style={styles.brandText}>DropSell</Text>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.title}>Invoice #{order._id}</Text>

          {/* Invoice Info */}
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text>
              {new Date(order.paymentInfo.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {/* Status Picker */}
          <Text style={styles.subtitle}>Change Order Status</Text>
          <Picker
            selectedValue={orderStatus}
            onValueChange={(value) => updateOrderStatus(value)}
          >
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Delivered" value="Delivered" />
            <Picker.Item label="Cancelled" value="Cancelled" />
          </Picker>

          {/* Customer Info */}
          <Text style={styles.subtitle}>Customer Information</Text>
          <InfoRow label="Name" value={order.user.name} />
          <InfoRow label="Email" value={order.user.email} />
          <InfoRow label="Phone" value={order.shippingInfo.phoneNumber} />
          <InfoRow label="Address" value={order.shippingInfo.adress} />
          <InfoRow label="City" value={order.shippingInfo.city} />
          <InfoRow label="Status" value={order.paymentInfo.orderStatus} />

          {/* Items */}
          <Text style={styles.subtitle}>Invoice Items</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Item</DataTable.Title>
              <DataTable.Title>Qty</DataTable.Title>
              <DataTable.Title numeric>Total</DataTable.Title>
            </DataTable.Header>

            {order.orderItems.map((item) => (
              <DataTable.Row key={item._id}>
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell>
                  {item.quantity} × {item.price}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {item.quantity * item.price} DT
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>

          {/* Payment */}
          <Text style={styles.subtitle}>Payment</Text>
          <InfoRow
            label="Shipping"
            value={`${order.paymentInfo.shippingPrice} DT`}
          />
          <InfoRow label="Total" value={`${order.paymentInfo.totalPrice} DT`} />
        </View>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}:</Text>
    <Text>{value}</Text>
  </View>
);

export default OrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },

  content: {
    padding: 20,
    marginTop: 60,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    backgroundColor: "#fb5c42",
    color: "#fff",
    padding: 10,
    borderRadius: 20,
    textAlign: "center",
    marginVertical: 15,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  label: {
    fontWeight: "bold",
  },
});
