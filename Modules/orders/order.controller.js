import orderModel from "./order.model.js";
import { cartModel } from "../carts/cart.model.js";
import promocodeModel from "../promocodes/promocode.model.js";
import { ROLES } from "../../Constants/roles.js";
import catchError from "../../Middleware/catchError.js";

const createOrder = catchError(async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress, promoCode } = req.body;

  const cart = await cartModel
    .findOne({ user: userId })
    .populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty" });
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    seller: item.product.seller,
    name: item.product.name,
    price: item.price,
    quantity: item.quantity,
    itemStatus: "pending"
  }));

  const subtotal = cart.totalPrice;
  const tax = parseFloat((subtotal * 0.14).toFixed(2));
  const shippingFee = 50;
  let discountAmount = 0;
  let appliedPromo = null;

  if (promoCode) {
    const promo = await promocodeModel.findOne({
      code: promoCode.toUpperCase(),
      isActive: true
    });

    if (!promo) {
      return res.status(400).json({ message: "Invalid or expired promo code" });
    }

    if (promo.expirationDate && promo.expirationDate < new Date()) {
      return res.status(400).json({ message: "Promo code has expired" });
    }

    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return res.status(400).json({ message: "Promo code usage limit reached" });
    }

    discountAmount = parseFloat(
      ((subtotal * promo.discountPercentage) / 100).toFixed(2)
    );
    appliedPromo = promo._id;
    promo.usageCount += 1;
    await promo.save();
  }

  const total = parseFloat(
    (subtotal + tax + shippingFee - discountAmount).toFixed(2)
  );

  const order = await orderModel.create({
    customer: userId,
    items: orderItems,
    shippingAddress,
    appliedPromo,
    discountAmount,
    subtotal,
    tax,
    shippingFee,
    total
  });

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  return res.status(201).json({
    message: "Order created successfully",
    data: order
  });
});


const getOrders = catchError(async (req, res) => {
  let orders;

  if (req.user.role === ROLES.ADMIN) {
    orders = await orderModel
      .find()
      .populate("customer", "name email")
      .populate("items.product", "name")
      .populate("items.seller", "name email");

  } else if (req.user.role === ROLES.CUSTOMER) {
    orders = await orderModel
      .find({ customer: req.user._id })
      .populate("items.product", "name")
      .populate("items.seller", "name email");

    // order.controller.js
  } else if (req.user.role === ROLES.SELLER) {
    orders = await orderModel
      .find({ "items.seller": req.user._id })
      .populate("customer", "name email")
      .populate("items.product", "name");

    const sellerOrders = orders.map((order) => {
      const sellerItems = order.items.filter(
        (item) => item.seller?.toString() === req.user._id.toString()
      );

      return {
        orderId: order._id, 
        orderStatus: order.status,
        items: sellerItems.map((item) => ({
          itemId: item._id,
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          itemStatus: item.itemStatus
        }))
      };
    });

    return res.status(200).json({
      message: "Orders retrieved successfully",
      count: sellerOrders.length,
      data: sellerOrders
    });
  }

  return res.status(200).json({
    message: "Orders retrieved successfully",
    count: orders.length,
    data: orders
  });
});


const getOrderById = catchError(async (req, res) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("customer", "name email")
    .populate("items.product", "name")
    .populate("items.seller", "name email")
    .populate("appliedPromo", "code discountPercentage");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const isCustomer = order.customer._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isCustomer && !isAdmin) {
    return res.status(403).json({ message: "You don't have permission" });
  }

  return res.status(200).json({
    message: "Order retrieved successfully",
    data: order
  });
});


const deriveOverallStatus = (items) => {
  const statuses = items.map((item) => item.itemStatus);

  if (statuses.every((s) => s === "delivered")) return "delivered";
  if (statuses.every((s) => s === "canceled")) return "canceled";
  if (statuses.some((s) => s === "pending")) return "pending";
  if (statuses.some((s) => s === "processing")) return "processing";
  if (statuses.some((s) => s === "shipped")) return "shipped";

  return "pending";
};


const updateOrderStatus = catchError(async (req, res) => {
  const { status } = req.body;

  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  await order.save();

  return res.status(200).json({
    message: "Order status updated successfully",
    data: order
  });
});


const updateItemStatus = catchError(async (req, res) => {
  const { itemId, itemStatus } = req.body;

  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const item = order.items.find((i) => i._id.toString() === itemId);

  if (!item) {
    return res.status(404).json({ message: "Item not found in this order" });
  }

  if (item.seller?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only update your own items" });
  }

  item.itemStatus = itemStatus;
  order.status = deriveOverallStatus(order.items);
  await order.save();

  return res.status(200).json({
    message: "Item status updated successfully",
    data: order
  });
});


export { createOrder, getOrders, getOrderById, updateOrderStatus, updateItemStatus };