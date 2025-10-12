const mongoose = require("mongoose");

// Sotto-schema per le varianti
const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Es. "Piccola 0.2L", "Media 0.4L"
  price: { type: Number, required: true },
});

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    variants: [variantSchema], // Array di varianti
    category: { type: String, required: true },
    imageUrl: { type: String },
    isAvailable: { type: Boolean, default: true },
    allergens: { type: String, default: "" },
    position: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);
