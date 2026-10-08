const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // rupees

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    res.json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not create order" });
  }
});

// Verify payment
router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expected === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});

module.exports = router;