const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, "Email non valida"] },
    password: { type: String, required: true },
    restaurantName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    subscriptionStatus: { type: String, enum: ["active", "inactive", "canceled"], default: "inactive" },
    stripeCustomerId: { type: String },
    categories: {
      type: [String],
      default: [],
    },
    theme: {
      primaryColor: { type: String, default: "#FBBF24" },
      backgroundColor: { type: String, default: "#F9FAFB" },
      cardColor: { type: String, default: "#FFFFFF" },
      textColor: { type: String, default: "#374151" },
      headingColor: { type: String, default: "#111827" },
      borderColor: { type: String, default: "#FBBF24" },
      cardBorderColor: { type: String, default: "#E5E7EB" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
