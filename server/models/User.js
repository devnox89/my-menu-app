const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Per favore, inserisci un'email valida"],
    },
    password: { type: String, required: true },
    restaurantName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "canceled"],
      default: "inactive",
    },
    stripeCustomerId: { type: String },
    theme: {
      primaryColor: { type: String, default: "#FBBF24" }, // Giallo (accenti, bordi)
      backgroundColor: { type: String, default: "#F9FAFB" }, // Grigio chiaro (sfondo pagina)
      cardColor: { type: String, default: "#FFFFFF" }, // Bianco (sfondo delle card)
      textColor: { type: String, default: "#374151" }, // Grigio (testo principale)
      headingColor: { type: String, default: "#111827" }, // Nero/Grigio scurissimo (titoli)
      borderColor: { type: String, default: "#FBBF24" },
      cardBorderColor: { type: String, default: "#E5E7EB" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
