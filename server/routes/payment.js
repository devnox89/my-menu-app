const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Crea una sessione di checkout di Stripe e reindirizza l'utente
router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.restaurantName,
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: user.stripeCustomerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/dashboard?payment_success=true`,
      cancel_url: `http://localhost:3000/dashboard?payment_canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Errore nella creazione della sessione di checkout:", error.message);
    res.status(500).json({ message: "Impossibile avviare il processo di pagamento." });
  }
});

// ## NUOVA ROTTA: CREA SESSIONE PER IL PORTALE CLIENTI ##
router.post("/create-portal-session", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ message: "Cliente non trovato o non abbonato." });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `http://localhost:3000/dashboard`, // Dove l'utente torna dopo aver gestito l'abbonamento
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error("Errore nella creazione della sessione del portale:", error.message);
    res.status(500).json({ message: "Impossibile accedere alla gestione dell'abbonamento." });
  }
});

// La rotta webhook è stata rimossa da qui e spostata in index.js

module.exports = router;
