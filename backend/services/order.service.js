const Order = require("../models/order");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");

/**
 * Create new Order
 */
exports.createOrderService = async (data, userId) => {
  return await Order.create({
    ...data,
    paidAt: Date.now(),
    user: userId,
  });
};

/**
 * Get Single Order
 */
exports.getSingleOrderService = async (orderId) => {
  const order = await Order.findById(orderId).populate("user", "name email");
  if (!order) throw new ErrorHandler("Order not found", 404);
  return order;
};

/**
 * Get My Orders
 */
exports.getMyOrdersService = async (userId) => {
  return await Order.find({ user: userId });
};

/**
 * Get All Orders (Admin)
 */
exports.getAllOrdersService = async () => {
  const orders = await Order.find();

  const totalAmount = orders.reduce((acc, order) => {
    return order.paymentInfo.orderStatus === "Delivered"
      ? acc + order.paymentInfo.totalPrice
      : acc;
  }, 0);

  return { orders, totalAmount };
};

/**
 * Update Order Status
 */
exports.updateOrderStatusService = async (orderId, newStatus) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ErrorHandler("Order not found", 404);

  if (order.paymentInfo.orderStatus === "Delivered") {
    throw new ErrorHandler("Order is already delivered", 400);
  }

  // Update stock
  for (const item of order.orderItems) {
    await updateStock(item.product, item.quantity);
  }

  order.paymentInfo.orderStatus = newStatus;
  order.paymentInfo.deliveredAt = Date.now();

  await order.save();

  return order;
};

/**
 * Delete Order
 */
exports.deleteOrderService = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ErrorHandler("Order not found", 404);

  await order.remove();
  return order;
};

/* -------------------------
    Update Stock 
-------------------------- */
async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) throw new ErrorHandler("Product not found", 404);

  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}
