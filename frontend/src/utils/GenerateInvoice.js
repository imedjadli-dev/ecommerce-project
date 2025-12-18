import React from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  Document,
  StyleSheet,
  View,
  Image,
} from "@react-pdf/renderer";
import logo from "../../logo.png";

const GenerateInvoice = ({ order }) => (
  <Document>
    <Page style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dropSellText}>DropSell Invoice</Text>
        <Image source={logo} style={styles.logo} />
      </View>

      {/* Customer & Order Info */}
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.col9}>
            <Text style={styles.invoiceId}>Invoice ID: {order._id}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col8}>
            <Text style={styles.addressHeading}>To: {order.user?.name}</Text>
            <Text style={styles.address}>City: {order.shippingInfo?.city}</Text>
            <Text style={styles.address}>
              Address: {order.shippingInfo?.address}
            </Text>
            <Text style={styles.address}>
              Phone: {order.shippingInfo?.phoneNumber}
            </Text>
          </View>

          <View style={styles.col4}>
            <Text style={styles.invoiceDetails}>
              <Text style={styles.circle}></Text>Creation Date:{" "}
              {order.paymentInfo?.createdAt?.substring(0, 10)}
            </Text>
            <Text style={styles.invoiceDetails}>
              <Text style={styles.circle}></Text>Delivered At:{" "}
              {order.paymentInfo?.deliveredAt?.substring(0, 10)}
            </Text>
            <Text style={styles.invoiceDetails}>
              <Text style={styles.circle}></Text>Status:{" "}
              <Text style={styles.badge}>Payment on delivery</Text>
            </Text>
          </View>
        </View>

        {/* Products Table */}
        <View style={styles.row}>
          <View style={styles.col}>
            <View style={styles.table}>
              <View style={styles.tableRowHeader}>
                <Text style={styles.tableHeader}>#</Text>
                <Text style={styles.tableHeader}>Product</Text>
                <Text style={styles.tableHeader}>Qty</Text>
                <Text style={styles.tableHeader}>Unit Price</Text>
                <Text style={styles.tableHeader}>Amount</Text>
              </View>
              {order.orderItems?.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                  <Text style={styles.tableCell}>{item.name}</Text>
                  <Text style={styles.tableCell}>{item.quantity}</Text>
                  <Text style={styles.tableCell}>{item.price} DT</Text>
                  <Text style={styles.tableCell}>
                    {item.quantity * item.price} DT
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.row}>
          <View style={styles.col3}>
            <Text style={styles.shipping}>
              Shipping: {order.paymentInfo?.shippingPrice} DT
            </Text>
            <Text style={styles.total}>
              Total Amount: {order.paymentInfo?.totalPrice} DT
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.row}>
          <View style={styles.col9}>
            <Text style={styles.thankYou}>Thank you for your purchase</Text>
          </View>
          <View style={styles.col3}>
            <Text style={styles.payNow}>Client signature</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// Styles
const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 12, padding: 40 },
  container: { borderWidth: 1, borderColor: "#000", padding: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  col: { flex: 1 },
  col9: { flex: 0.9 },
  col8: { flex: 0.8 },
  col4: { flex: 0.4 },
  col3: { flex: 0.3 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dropSellText: { fontSize: 20, marginLeft: 10 },
  logo: { width: 50, height: 50, marginRight: 10, alignSelf: "flex-end" },
  invoiceId: { color: "#7e8d9f", fontSize: 20 },
  addressHeading: { color: "#5d9fc5", fontSize: 12, marginBottom: 5 },
  address: { color: "#000", fontSize: 12, marginBottom: 2 },
  invoiceDetails: { color: "#000", fontSize: 12, marginBottom: 2 },
  circle: {
    width: 8,
    height: 8,
    backgroundColor: "#84B0CA",
    borderRadius: 50,
    marginRight: 5,
  },
  badge: {
    backgroundColor: "#f0ad4e",
    color: "#000",
    fontWeight: "bold",
    padding: 3,
  },
  table: { borderCollapse: "collapse", width: "100%" },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#84B0CA",
    color: "#fff",
    fontWeight: "bold",
    padding: 5,
  },
  tableHeader: { flex: 1, padding: 5 },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    padding: 5,
  },
  tableCell: { flex: 1, padding: 5 },
  shipping: { fontSize: 12, marginBottom: 5 },
  total: { fontSize: 12 },
  thankYou: { fontSize: 12, marginLeft: 10 },
  payNow: { fontSize: 12 },
});

// Wrapper component for PDF download
export const InvoiceDownload = ({ order }) => (
  <PDFDownloadLink
    document={<GenerateInvoice order={order} />}
    fileName="invoice.pdf"
  >
    {({ loading }) => (loading ? "Loading document..." : "Download Invoice")}
  </PDFDownloadLink>
);

export default GenerateInvoice;
