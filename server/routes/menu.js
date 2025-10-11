const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");

// Tutte le rotte in questo file sono protette e richiedono il login.

// GET per ottenere i piatti dell'utente, già ordinati
router.get("/", protect, menuController.getMyMenuItems);

// POST per creare un nuovo piatto
router.post("/", protect, upload.single("image"), menuController.createMenuItem);

// PUT per aggiornare l'ordine di tutti i piatti (DRAG-AND-DROP)
// Questa è probabilmente la riga 16 che causava l'errore.
router.put("/update-order", protect, menuController.updateMenuItemsOrder);

// PUT per aggiornare un singolo piatto
router.put("/:id", protect, upload.single("image"), menuController.updateMenuItem);

// DELETE per eliminare un piatto
router.delete("/:id", protect, menuController.deleteMenuItem);

// PATCH per cambiare lo stato di disponibilità
router.patch("/:id/toggle", protect, menuController.toggleAvailability);

module.exports = router;
