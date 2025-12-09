const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const {
  createOrderService,
  getSingleOrderService,
  getMyOrdersService,
  getAllOrdersService,
  updateOrderStatusService,
  deleteOrderService,
} = require("../services/order.service");

// =======================
// Create New Order
// =======================
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await createOrderService(req.body, req.user._id);

  res.status(201).json({
    success: true,
    order,
  });
});

// =======================
// Get One Order
// =======================

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await getSingleOrderService(req.params.id);

  res.status(200).json({
    success: true,
    order,
  });
});

// =======================
// Get Orders of Logged User
// =======================
exports.getMyOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await getMyOrdersService(req.user.id);

  res.status(200).json({
    success: true,
    orders,
  });
});

// =======================
// Admin: Get All Orders
// =======================
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const { orders, totalAmount } = await getAllOrdersService();

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// =======================
// Update Order Status
// =======================
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await updateOrderStatusService(
    req.params.id,
    req.body.orderStatus
  );

  res.status(200).json({
    success: true,
    order,
  });
});

// =======================
// Delete Order
// =======================
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  await deleteOrderService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
