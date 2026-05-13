import express from "express";
import Order from "../models/Order.js";
import { requireAuth } from "./auth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to load orders" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId,
    }).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load order" });
  }
});

export default router;
