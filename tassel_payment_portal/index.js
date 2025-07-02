const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fullomyself.github.io"
  ],
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

app.post("/create-order", async (req, res) => {
  const { items, total, email } = req.body;
  try {
    // Create a Yoco payment link
    const response = await axios.post(
      "https://api.yoco.com/checkout/v1/payment_links",
      {
        amount: total * 100, // Yoco expects cents
        currency: "ZAR",
        reference: `TasselOrder-${Date.now()}`,
        customer: { email },
        line_items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          amount: item.price * 100,
        })),
      },
      {
        headers: {
          "X-Auth-Secret-Key": process.env.YOCO_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ paymentUrl: response.data.payment_link_url });
  } catch (err) {
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Payment portal running on ${PORT}`));