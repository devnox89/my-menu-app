const User = require("../models/User");
const MenuItem = require("../models/menuItem");

exports.getPublicMenu = async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug });
    if (!user) {
      return res.status(404).json({ message: "Ristorante non trovato" });
    }

    if (user.subscriptionStatus !== "active") {
      return res.status(403).json({ message: "Il proprietario di questo menù non ha un abbonamento attivo." });
    }

    const menuItems = await MenuItem.find({ user: user._id, isAvailable: true }).sort({ position: 1 });

    res.json({
      restaurantName: user.restaurantName,
      restaurantDescription: user.restaurantDescription,
      coverCharge: user.coverCharge,
      menu: menuItems,
      theme: user.theme,
    });
  } catch (err) {
    res.status(500).json({ message: "Errore del server" });
  }
};
