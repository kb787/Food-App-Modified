const express = require("express");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.razor_pay_key_id,
  key_secret: process.env.razor_pay_secret_key,
});

// const handleCreateOrder = async (req, res) => {
//   try {
//     const { amount, currency = "INR" } = req.body;
//     const options = {
//       amount: amount * 100,
//       currency,
//       receipt: `receipt_${Date.now()}`,
//       payment_capture: 1,
//     };

//     const order = await razorpay.orders.create(options);
//     res.json({
//       orderId: order.id,
//       currency: order.currency,
//       amount: order.amount,
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res
//       .status(500)
//       .json({ message: "Error creating order", error: error.message });
//   }
// };

const handleCreateOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount. Amount must be a positive number.",
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};
const handleVerifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      res.json({ verified: true, payment_id: razorpay_payment_id });
    } else {
      res.status(400).json({ verified: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ message: "Error verifying payment", error: error.message });
  }
};

const handleRazorPayWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    const event = req.body;

    switch (event.event) {
      case "payment.captured":
        // Handle successful payment
        console.log("Payment successful:", event.payload.payment.entity);
        break;

      case "payment.failed":
        // Handle failed payment
        console.log("Payment failed:", event.payload.payment.entity);
        break;
    }

    res.json({ status: "ok" });
  } else {
    res.status(400).json({ status: "invalid signature" });
  }
};

const razorPayRouter = express.Router();
razorPayRouter.post("/create-order", handleCreateOrder);
razorPayRouter.post("/verify-payment", handleVerifyPayment);
razorPayRouter.post("/razorpay-webhook", handleRazorPayWebhook);

module.exports = { razorPayRouter };
