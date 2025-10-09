const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { vouchers } = require("./vouchers.js");


require("dotenv").config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fullomyself.github.io"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/send-order", async (req, res) => {
  const { items, total, email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Customer email is required." });
  }
  try {
    // 1. Send order notification to business
    await transporter.sendMail({
      from: `"Tassel Shop" <${process.env.SMTP_USER}>`,
      to: process.env.ORDER_RECEIVER,
      subject: "New Tassel Shop Order",
      text: `Order from: ${email}\n\nItems:\n${items
        .map((i) => `${i.name} x${i.quantity} (R${i.price})`)
        .join("\n")}\n\nTotal: R${total}`,
    });

    // 2. Send confirmation to customer
    await transporter.sendMail({
      from: `"Tassel Shop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Tassel Shop Order Confirmation",
      text: `Thank you for your order!\n\nOrder details:\n${items
        .map((i) => `${i.name} x${i.quantity} (R${i.price})`)
        .join("\n")}\n\nTotal: R${total}\n\nWe'll be in touch soon!`,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ✅ Secure Voucher Validation Endpoint
app.post("/api/validate-voucher", (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ valid: false, message: "Invalid request." });
  }

  // Find active voucher
  const voucher = vouchers.find(
    (v) => v.code.toUpperCase() === code.toUpperCase() && v.active
  );

  if (!voucher) {
    return res.status(404).json({ valid: false, message: "Invalid or expired code." });
  }

  // Only send safe voucher info (no need to expose backend logic)
  return res.json({
    valid: true,
    voucher: {
      code: voucher.code,
      type: voucher.type,
      value: voucher.value,
      description: voucher.description,
    },
  });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Email server running on ${PORT}`));