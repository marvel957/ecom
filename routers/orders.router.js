const express = require("express");
const orderRoutes = express.Router();
const Order = require("../models/orders.model");
const OrderItem = require("../models/orderitem.model");

orderRoutes.get("/", async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name")
      .sort({ dateOrdered: -1 });
    res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
orderRoutes.get("/get/totalsales", async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);

    res.status(200).json({ "total sales": totalSales.pop().totalSales });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
orderRoutes.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
orderRoutes.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    await order.orderItems.map(async (orderItem) => {
      await OrderItem.findByIdAndDelete(orderItem);
    });
    res.status(200).json({ message: "order successfully deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
orderRoutes.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });
    res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
orderRoutes.post("/", async (req, res) => {
  try {
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );
    const orderItemsIdsResolved = await orderItemsIds;
    const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    const order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });
    await order.save();
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
orderRoutes.get("/get/count", async (req, res) => {
  const ordersCount = await Order.countDocuments();
  return res.status(200).json({ "no of orders": ordersCount });
});
orderRoutes.get("/get/userorders/:userid", async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.params.userid })
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      })
      .sort({ dateOrdered: -1 });
    res.status(200).json(userOrders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = orderRoutes;

// "shippingAddress1": "no 14 salawe street off love all",
// "shippingAddress2": "no 12 salawe street off love all",
// "city": "Ketu" ,
// "zip": "000",
// "country": "Nigeria",
// "phone": "08105140699",
// "user": "67175a2eac52f9ebefccfc1c",
