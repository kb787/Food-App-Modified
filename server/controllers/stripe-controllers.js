const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

let orders = [];
let totalPriceForPaymentSheet = 0;

const handlePaymentCheckout = () => {
  const { cart, totalPrice } = req.body;
  console.log("Received cart:", cart);
  console.log("Total Price:", totalPrice);
  totalPriceForPaymentSheet = totalPrice;
  orders.push({ cart, totalPrice });
  res.status(200).json({ message: "Checkout successful!", totalPrice });
};

const handleIntentCreation = async (req, res) => {
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-04-10" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPriceForPaymentSheet * 100,
      currency: "inr",
      customer: customer.id,
      description: "Test payment for developer",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error("Error during payment:", error);
    res.status(400).json({ error: error.message });
  }
};

const express = require("express");
const stripeRouter = express.Router();
stripeRouter.post("/checkout", handlePaymentCheckout);
stripeRouter.post("/payment-sheet", handleIntentCreation);

module.exports = { stripeRouter };
