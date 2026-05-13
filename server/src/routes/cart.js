import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { requireAuth } from "./auth.js";

const router = express.Router();

const formatCartItems = (cartItems) =>
  cartItems.map((item) => {
    const product = item.product || {};
    const productId = product._id || item.product;

    return {
      product: {
        id: productId,
        name: product.name || item.nameAtAdd,
        price: product.price ?? item.priceAtAdd,
        image: product.image || item.imageAtAdd,
        slug: product.slug || item.slugAtAdd,
        status: product.status,
        originalPrice: product.originalPrice,
      },
      quantity: item.quantity,
    };
  });

router.get("/", requireAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate(
      "items.product"
    );

    if (!cart) {
      return res.json({ items: [] });
    }

    return res.json({ items: formatCartItems(cart.items) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load cart" });
  }
});

router.put("/", requireAuth, async (req, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];

    if (items.length === 0) {
      const cart = await Cart.findOneAndUpdate(
        { user: req.userId },
        { user: req.userId, items: [] },
        { new: true, upsert: true }
      );
      return res.json({ items: formatCartItems(cart.items) });
    }

    const ids = items.map((item) => item.productId).filter(Boolean);
    const quantities = new Map(
      items.map((item) => [String(item.productId), Number(item.quantity) || 1])
    );

    const products = await Product.find({ _id: { $in: ids } });

    if (products.length === 0) {
      return res.status(404).json({ message: "Products not found." });
    }

    const cartItems = products.map((product) => ({
      product: product._id,
      quantity: Math.max(1, quantities.get(String(product._id)) || 1),
      priceAtAdd: product.price,
      nameAtAdd: product.name,
      imageAtAdd: product.image,
      slugAtAdd: product.slug,
    }));

    const cart = await Cart.findOneAndUpdate(
      { user: req.userId },
      { user: req.userId, items: cartItems },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("items.product");

    return res.json({ items: formatCartItems(cart.items) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save cart" });
  }
});

export default router;
