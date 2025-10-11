require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routers
const authRouter = require("./routes/auth");
const menuRouter = require("./routes/menu");
const publicRouter = require("./routes/public");
const paymentRouter = require("./routes/payment");

// Imports for Stripe Webhook
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("./models/User");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// Stripe Webhook endpoint
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const user = await User.findOne({ stripeCustomerId: session.customer });
    if (user) {
      user.subscriptionStatus = "active";
      await user.save();
      console.log(`✅ Subscription activated for user: ${user.username}`);
    }
  }
  res.status(200).json({ received: true });
});

app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("Connection error", err));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/menu", menuRouter);
app.use("/api/public", publicRouter);
app.use("/api/payments", paymentRouter);

// Start Server
app.listen(port, () => console.log(`Server started on port ${port}`));
