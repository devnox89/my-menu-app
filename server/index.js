require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require("./routes/auth");
const menuRouter = require("./routes/menu");
const publicRouter = require("./routes/public");
const paymentRouter = require("./routes/payment");
const categoryRouter = require("./routes/category"); // <-- NUOVO

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("./models/User");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

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
      console.log(`✅ Abbonamento attivato per l'utente: ${user.username}`);
    }
  }
  res.status(200).json({ received: true });
});

app.use(express.json());

// ## NUOVA ROTTA PER HEALTH CHECK ##
// Risponde alla rotta principale (/)
app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connesso al Database"))
  .catch((err) => console.error("Errore di connessione", err));

app.use("/api/auth", authRouter);
app.use("/api/menu", menuRouter);
app.use("/api/public", publicRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/categories", categoryRouter); // <-- NUOVO

app.listen(port, () => console.log(`Server avviato sulla porta ${port}`));
