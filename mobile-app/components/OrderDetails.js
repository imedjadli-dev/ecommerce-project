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
  ActivityIndicator,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import Icon from "react-native-vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import Navbar from "./Naverbar";
import Toast from "react-native-toast-message";
import { DataTable } from "react-native-paper";

const OrderDetails = ({ navigation, route }) => {
  const [orderStatus, setOrderStatus] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Animations
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    const { orderId } = route.params;
    fetchInvoiceData(orderId);
  }, [route.params.orderId]);

  useEffect(() => {
    if (invoiceData) {
      startAnimations();
    }
  }, [invoiceData]);

  const staticInvoice = {
    _id: "STATIC1234",
    paymentInfo: {
      orderStatus: "Processing",
      totalPrice: 120.5,
      shippingPrice: 10,
      createdAt: new Date().toISOString(),
    },
    shippingInfo: {
      adress: "123 Demo Street",
      city: "Demo City",
      phoneNumber: "1234567890",
    },
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    orderItems: [
      { name: "Product A", quantity: 2, price: 30 },
      { name: "Product B", quantity: 1, price: 60.5 },
    ],
  };

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchInvoiceData = async (orderId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/v4/deliver/order/${orderId}`
      );

      if (response.ok) {
        const jsonData = await response.json();
        const { order } = jsonData;
        if (order) {
          setInvoiceData({ ...order, orderId: order._id });
          setOrderStatus(order.paymentInfo.orderStatus);
        } else {
          console.log("No order data, using static invoice");
          setInvoiceData(staticInvoice);
          setOrderStatus(staticInvoice.paymentInfo.orderStatus);
        }
      } else {
        console.log("Error fetching invoice data, using static invoice");
        setInvoiceData(staticInvoice);
        setOrderStatus(staticInvoice.paymentInfo.orderStatus);
      }
    } catch (error) {
      console.log("Connection error, using static invoice:", error);
      setInvoiceData(staticInvoice);
      setOrderStatus(staticInvoice.paymentInfo.orderStatus);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const requestPayload = {
      orderStatus: newStatus,
    };

    try {
      const deliverResponse = await fetch(
        `http://localhost:4000/api/v4/deliver/order/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        }
      );

      if (deliverResponse.ok) {
        Toast.show({
          type: "success",
          text1: "Status Updated Successfully",
        });
        fetchInvoiceData(orderId);
        setShowStatusModal(false);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to update status",
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Connection error",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#10b981";
      case "Cancelled":
        return "#ef4444";
      case "Processing":
        return "#f59e0b";
      case "Shipped":
        return "#3b82f6";
      default:
        return "#6b7280";
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

  if (loading || !invoiceData) {
    return (
      <View style={styles.loadingContainer}>
        <Navbar />
        <ActivityIndicator size="large" color="#fb5c42" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  const totalItems = invoiceData.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <Navbar />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require("../images/delivery.jpg")}
          style={styles.imageBackground}
        >
          <View style={styles.overlay} />
          <View style={styles.brandView}>
            <View style={styles.iconContainer}>
              <Icon name="file-text" style={styles.brandIcon} />
            </View>
            <Text style={styles.brandViewText}>Order Details</Text>
            <Text style={styles.brandSubtext}>Invoice & Tracking</Text>
          </View>
        </ImageBackground>

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Order ID Header */}
          <View style={styles.orderIdCard}>
            <View style={styles.orderIdHeader}>
              <Icon name="hashtag" style={styles.orderIdIcon} />
              <Text style={styles.orderIdText}>
                {invoiceData._id.slice(-8).toUpperCase()}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColor(
                    invoiceData.paymentInfo.orderStatus
                  ),
                },
              ]}
            >
              <Icon
                name={getStatusIcon(invoiceData.paymentInfo.orderStatus)}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>
                {invoiceData.paymentInfo.orderStatus}
              </Text>
            </View>
          </View>

          {/* Quick Info Cards */}
          <View style={styles.quickInfoGrid}>
            <View style={styles.quickInfoCard}>
              <Icon name="calendar" style={styles.quickInfoIcon} />
              <Text style={styles.quickInfoLabel}>Order Date</Text>
              <Text style={styles.quickInfoValue}>
                {new Date(
                  invoiceData.paymentInfo.createdAt
                ).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.quickInfoCard}>
              <Icon name="shopping-bag" style={styles.quickInfoIcon} />
              <Text style={styles.quickInfoLabel}>Total Items</Text>
              <Text style={styles.quickInfoValue}>{totalItems}</Text>
            </View>
          </View>

          {/* Update Status Button */}
          <TouchableOpacity
            style={styles.updateStatusButton}
            onPress={() => setShowStatusModal(true)}
          >
            <Icon name="refresh" style={styles.updateStatusIcon} />
            <Text style={styles.updateStatusText}>Update Order Status</Text>
            <Icon name="chevron-right" style={styles.chevronIcon} />
          </TouchableOpacity>

          {/* Customer Information */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="user" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Customer Information</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Icon name="user-circle" style={styles.infoIcon} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{invoiceData.user.name}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Icon name="envelope" style={styles.infoIcon} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{invoiceData.user.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Icon name="phone" style={styles.infoIcon} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>
                  {invoiceData.shippingInfo.phoneNumber}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Icon name="map-marker" style={styles.infoIcon} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Delivery Address</Text>
                <Text style={styles.infoValue}>
                  {invoiceData.shippingInfo.adress}
                </Text>
                <Text style={styles.infoSubValue}>
                  {invoiceData.shippingInfo.city}
                </Text>
              </View>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="shopping-cart" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Order Items</Text>
            </View>

            {invoiceData.orderItems.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemTotal}>
                    {(item.quantity * item.price).toFixed(2)} DT
                  </Text>
                </View>
                <View style={styles.itemDetails}>
                  <View style={styles.itemQuantity}>
                    <Icon name="cube" style={styles.itemQuantityIcon} />
                    <Text style={styles.itemQuantityText}>
                      Qty: {item.quantity}
                    </Text>
                  </View>
                  <View style={styles.itemPrice}>
                    <Icon name="tag" style={styles.itemPriceIcon} />
                    <Text style={styles.itemPriceText}>
                      {item.price} DT each
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Payment Summary */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="credit-card" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Payment Summary</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping Fee</Text>
              <Text style={styles.summaryValue}>
                {invoiceData.paymentInfo.shippingPrice} DT
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>
                {invoiceData.paymentInfo.totalPrice} DT
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Order Status</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Icon name="times" style={styles.modalCloseIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Select New Status:</Text>
              <Picker
                selectedValue={orderStatus}
                style={styles.picker}
                onValueChange={(value) => {
                  setOrderStatus(value);
                  updateOrderStatus(invoiceData.orderId, value);
                }}
              >
                <Picker.Item
                  label={invoiceData.paymentInfo.orderStatus}
                  value={invoiceData.paymentInfo.orderStatus}
                />
                <Picker.Item label="Processing" value="Processing" />
                <Picker.Item label="Shipped" value="Shipped" />
                <Picker.Item label="Delivered" value="Delivered" />
                <Picker.Item label="Cancelled" value="Cancelled" />
              </Picker>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
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
  brandViewText: {
    color: "white",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 1,
  },
  brandSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 4,
    letterSpacing: 1.5,
  },
  contentContainer: {
    padding: 16,
    marginTop: -30,
  },
  orderIdCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderIdHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderIdIcon: {
    color: "#94a3b8",
    fontSize: 18,
    marginRight: 8,
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 6,
    color: "white",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    color: "white",
  },
  quickInfoGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  quickInfoIcon: {
    fontSize: 24,
    color: "#fb5c42",
    marginBottom: 8,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 4,
  },
  quickInfoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  updateStatusButton: {
    backgroundColor: "#fb5c42",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#fb5c42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  updateStatusIcon: {
    color: "white",
    fontSize: 18,
    marginRight: 8,
  },
  updateStatusText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  chevronIcon: {
    color: "white",
    fontSize: 16,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#f1f5f9",
  },
  sectionIcon: {
    fontSize: 20,
    color: "#fb5c42",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoIcon: {
    color: "#fb5c42",
    fontSize: 18,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "600",
  },
  infoSubValue: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  itemCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fb5c42",
  },
  itemDetails: {
    flexDirection: "row",
    gap: 16,
  },
  itemQuantity: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemQuantityIcon: {
    fontSize: 14,
    color: "#64748b",
    marginRight: 6,
  },
  itemQuantityText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  itemPrice: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemPriceIcon: {
    fontSize: 14,
    color: "#64748b",
    marginRight: 6,
  },
  itemPriceText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 24,
    color: "#fb5c42",
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },
  modalCloseIcon: {
    fontSize: 24,
    color: "#64748b",
  },
  modalBody: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
    textAlign: "center",
  },
  picker: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
});
