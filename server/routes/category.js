const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, categoryController.getCategories);
router.post("/", protect, categoryController.addCategory);
router.delete("/:name", protect, categoryController.deleteCategory);

module.exports = router;
