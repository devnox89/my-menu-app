const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const slugify = require("slugify");
const { protect } = require("../middleware/authMiddleware");

// ROTTA DI REGISTRAZIONE PUBBLICA: POST /api/auth/register
router.post("/register", async (req, res) => {
  const { username, email, password, restaurantName } = req.body;

  if (!username || !email || !password || !restaurantName) {
    return res.status(400).json({ message: "Per favore, compila tutti i campi." });
  }

  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    return res.status(400).json({ message: "Username o Email già esistente." });
  }

  const slug = slugify(restaurantName, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });

  const slugExists = await User.findOne({ slug });
  if (slugExists) {
    return res.status(400).json({ message: "Nome del ristorante già registrato. Scegline un altro." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    restaurantName,
    slug,
  });

  await user.save();
  res.status(201).json({ message: "Utente registrato con successo" });
});

// ROTTA PER IL LOGIN: POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send("Credenziali non valide");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Credenziali non valide");
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      restaurantName: user.restaurantName,
      slug: user.slug,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
    },
  });
});

// ROTTA PER OTTENERE I DATI DELL'UTENTE LOGGATO: GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: "Utente non trovato" });
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      // Controllo duplicati
      if (req.body.username || req.body.email) {
        const userExists = await User.findOne({
          $or: [{ username: req.body.username }, { email: req.body.email }],
          _id: { $ne: user._id },
        });
        if (userExists) {
          return res.status(400).json({ message: "Username o Email già in uso." });
        }
      }

      // Aggiornamento campi
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;

      // Aggiorna i nuovi campi
      user.restaurantDescription = req.body.restaurantDescription;
      user.coverCharge = req.body.coverCharge;

      // Aggiornamento slug se il nome del ristorante cambia
      if (req.body.restaurantName && req.body.restaurantName !== user.restaurantName) {
        const newSlug = slugify(req.body.restaurantName, { lower: true, strict: true });
        const slugExists = await User.findOne({ slug: newSlug, _id: { $ne: user._id } });
        if (slugExists) {
          return res.status(400).json({ message: "Un altro ristorante sta già usando un nome molto simile." });
        }
        user.restaurantName = req.body.restaurantName;
        user.slug = newSlug;
      }

      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
      }
      if (req.body.theme) {
        user.theme = { ...user.theme, ...req.body.theme };
        user.markModified("theme");
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "Utente non trovato" });
    }
  } catch (error) {
    res.status(400).json({ message: "Errore durante l'aggiornamento del profilo." });
  }
});

module.exports = router;
