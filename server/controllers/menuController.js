const MenuItem = require("../models/menuItem");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configura Cloudinary con le tue credenziali dal file .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Funzione helper per caricare un file da un buffer (memoria)
const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

// --- FUNZIONI ESPORTATE PER LE ROTTE ---

// GET /api/menu -> Ottiene i piatti dell'utente, ordinati per posizione
exports.getMyMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ user: req.user._id }).sort({ position: 1 });
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/menu -> Crea un nuovo piatto
exports.createMenuItem = async (req, res) => {
  try {
    let imageUrl = null;
    // Controlla se un file è stato inviato e lo carica
    if (req.file) {
      const result = await streamUpload(req);
      imageUrl = result.secure_url;
    }

    const variants = JSON.parse(req.body.variants);
    if (!variants || variants.length === 0) {
      return res.status(400).json({ message: "Un piatto deve avere almeno una variante." });
    }

    const lastItem = await MenuItem.findOne({ user: req.user._id }).sort({ position: -1 });
    const newPosition = lastItem ? lastItem.position + 1 : 0;

    const menuItem = new MenuItem({
      name: req.body.name,
      description: req.body.description,
      variants: variants,
      category: req.body.category,
      imageUrl: imageUrl, // Salva l'URL ottenuto da Cloudinary
      allergens: req.body.allergens || "",
      user: req.user._id,
      position: newPosition,
    });

    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
  } catch (err) {
    console.error("Errore creazione piatto:", err);
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/menu/:id -> Aggiorna un singolo piatto
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Piatto non trovato." });
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Azione non autorizzata." });
    }

    let imageUrl = item.imageUrl; // Mantiene l'immagine vecchia di default
    // Se viene inviato un nuovo file, lo carica e sostituisce quella vecchia
    if (req.file) {
      const result = await streamUpload(req);
      imageUrl = result.secure_url;
    }

    const variants = JSON.parse(req.body.variants);
    if (!variants || variants.length === 0) {
      return res.status(400).json({ message: "Un piatto deve avere almeno una variante." });
    }

    item.name = req.body.name;
    item.description = req.body.description;
    item.category = req.body.category;
    item.imageUrl = imageUrl;
    item.allergens = req.body.allergens || "";
    item.variants = variants;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    console.error("Errore aggiornamento piatto:", err);
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/menu/:id -> Elimina un piatto
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Piatto non trovato" });
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Azione non autorizzata" });
    }
    await item.deleteOne();
    res.json({ message: "Piatto eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/menu/:id/toggle -> Cambia lo stato di disponibilità
exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Piatto non trovato" });
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Azione non autorizzata" });
    }
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/menu/update-order -> Aggiorna l'ordine di tutti i piatti
exports.updateMenuItemsOrder = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, user: req.user._id },
        update: { $set: { position: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await MenuItem.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Ordine aggiornato con successo" });
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'ordine:", error);
    res.status(500).json({ message: "Errore durante l'aggiornamento dell'ordine." });
  }
};
