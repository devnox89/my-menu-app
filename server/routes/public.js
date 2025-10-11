// server/routes/public.js
const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

router.get("/menu/:slug", publicController.getPublicMenu);

module.exports = router;
