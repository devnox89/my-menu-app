const multer = require("multer");

// Configura multer per salvare il file in memoria come un buffer
// Questo è il modo più efficiente per passarlo poi a servizi come Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;
