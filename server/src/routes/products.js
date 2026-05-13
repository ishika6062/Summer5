import express from "express";
import Product from "../models/Product.js";
import { requireAuth, requireAdmin } from "./auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { q, category, status, sort = "createdAt", order = "desc" } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    const sortDir = order === "asc" ? 1 : -1;
    const sortField = ["name", "price", "status", "createdAt"].includes(sort)
      ? sort
      : "createdAt";

    const products = await Product.find(filter).sort({ [sortField]: sortDir });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to load products" });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const list = await Product.find({ category: req.params.category });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Failed to load products" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to load product" });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    res.status(400).json({ message: "Failed to create product" });
  }
});

router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    res.status(400).json({ message: "Failed to update product" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete product" });
  }
});

export default router;
