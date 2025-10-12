const User = require("../models/User");

// GET /api/categories -> Ottiene le categorie dell'utente loggato
exports.getCategories = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.categories);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero delle categorie." });
  }
};

// POST /api/categories -> Aggiunge una nuova categoria
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Il nome della categoria è richiesto." });

    const user = await User.findById(req.user.id);
    if (user.categories.map((c) => c.toLowerCase()).includes(name.toLowerCase())) {
      return res.status(400).json({ message: "Categoria già esistente." });
    }
    user.categories.push(name.trim());
    await user.save();
    res.status(201).json(user.categories);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiunta della categoria." });
  }
};

// DELETE /api/categories/:name -> Rimuove una categoria
exports.deleteCategory = async (req, res) => {
  try {
    const categoryName = decodeURIComponent(req.params.name);
    const user = await User.findById(req.user.id);
    user.categories = user.categories.filter((cat) => cat !== categoryName);
    await user.save();
    res.json(user.categories);
  } catch (error) {
    res.status(500).json({ message: "Errore nella rimozione della categoria." });
  }
};
