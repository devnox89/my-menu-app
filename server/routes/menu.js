const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // Importa il middleware per l'upload

// Tutte le rotte in questo file sono protette

// GET per ottenere i piatti dell'utente
router.get("/", protect, menuController.getMyMenuItems);

// POST per creare un nuovo piatto (CON UPLOAD IMMAGINE)
router.post("/", protect, upload.single("image"), menuController.createMenuItem);

// PUT per aggiornare l'ordine
router.put("/update-order", protect, menuController.updateMenuItemsOrder);

// PUT per aggiornare un singolo piatto (CON UPLOAD IMMAGINE)
router.put("/:id", protect, upload.single("image"), menuController.updateMenuItem);

// DELETE per eliminare un piatto
router.delete("/:id", protect, menuController.deleteMenuItem);

// PATCH per cambiare lo stato di disponibilità
router.patch("/:id/toggle", protect, menuController.toggleAvailability);

module.exports = router;
