import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: "Email and message required" });
  }

  res.status(201).json({
    message: "Message received",
    data: { name, email, phone, message },
  });
});

export default router;
