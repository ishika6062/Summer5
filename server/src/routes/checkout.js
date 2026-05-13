import express from "express";
import Stripe from "stripe";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { requireAuth } from "./auth.js";

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.warn("Missing STRIPE_SECRET_KEY. Checkout endpoints will fail.");
}

const stripe = new Stripe(stripeSecretKey || "", {
  apiVersion: "2024-06-20",
});

router.post("/session", requireAuth, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const ids = items.map((item) => item.productId).filter(Boolean);
    const quantities = new Map(
      items.map((item) => [String(item.productId), Number(item.quantity) || 1])
    );

    const products = await Product.find({ _id: { $in: ids } });

    if (products.length === 0) {
      return res.status(404).json({ message: "Products not found." });
    }

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: product.image ? [product.image] : [],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: Math.max(1, quantities.get(String(product._id)) || 1),
    }));

    const orderItems = products.map((product) => ({
      product: product._id,
      name: product.name,
      image: product.image,
      slug: product.slug,
      price: product.price,
      quantity: Math.max(1, quantities.get(String(product._id)) || 1),
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${clientOrigin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientOrigin}/checkout/cancel`,
    });

    await Order.create({
      user: req.userId,
      items: orderItems,
      totalAmount,
      currency: "usd",
      status: "pending",
      stripeSessionId: session.id,
      stripePaymentStatus: session.payment_status,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({ message: "Failed to create checkout session." });
  }
});

router.post("/confirm", requireAuth, async (req, res) => {
  try {
    const sessionId = req.body?.sessionId || req.query?.session_id;
    if (!sessionId) {
      return res.status(400).json({ message: "Missing session id" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentStatus = session.payment_status || "unpaid";

    const order = await Order.findOne({
      user: req.userId,
      stripeSessionId: sessionId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (paymentStatus === "paid" && order.status !== "paid") {
      order.status = "paid";
      await Cart.findOneAndUpdate(
        { user: req.userId },
        { items: [] },
        { new: true }
      );
    }

    order.stripePaymentStatus = paymentStatus;
    await order.save();

    return res.json({ order });
  } catch (error) {
    console.error("Stripe confirmation error:", error);
    return res.status(500).json({ message: "Failed to confirm payment." });
  }
});

export default router;
