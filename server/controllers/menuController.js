const MenuItem = require("../models/menuItem");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Funzione helper per l'upload
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

// Ottiene i piatti dell'utente, ordinati
exports.getMyMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ user: req.user._id }).sort({ position: 1 });
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crea un nuovo piatto
exports.createMenuItem = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      const result = await streamUpload(req);
      imageUrl = result.secure_url;
    }

    const lastItem = await MenuItem.findOne({ user: req.user._id }).sort({ position: -1 });
    const newPosition = lastItem ? lastItem.position + 1 : 0;

    const menuItem = new MenuItem({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      imageUrl: imageUrl,
      allergens: req.body.allergens || "", // Reads the allergen string directly
      user: req.user._id,
      position: newPosition,
    });

    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Aggiorna un singolo piatto
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Action not authorized" });
    }

    let imageUrl = item.imageUrl;
    if (req.file) {
      const result = await streamUpload(req);
      imageUrl = result.secure_url;
    }

    item.name = req.body.name;
    item.description = req.body.description;
    item.price = req.body.price;
    item.category = req.body.category;
    item.imageUrl = imageUrl;
    item.allergens = req.body.allergens || ""; // Reads the allergen string directly

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Elimina un piatto
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Piatto non trovato" });
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Azione non autorizzata" });
    }
    await item.deleteOne(); // Usa deleteOne() invece di remove() che è deprecato
    res.json({ message: "Piatto eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cambia la disponibilità
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

// Aggiorna l'ordine dei piatti
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
