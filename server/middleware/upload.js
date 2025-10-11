// server/middleware/upload.js
const multer = require("multer");

// Conserva il file in memoria come un Buffer.
// Questo è efficiente per passare il file direttamente a servizi come Cloudinary.
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;
