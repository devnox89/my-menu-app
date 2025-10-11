const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Estrai il token dall'header
      token = req.headers.authorization.split(" ")[1];

      // Verifica il token usando il segreto dal file .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Trova l'utente nel database tramite l'ID contenuto nel token e allega l'utente alla richiesta
      // .select('-password') esclude il campo della password dalla risposta
      req.user = await User.findById(decoded.userId).select("-password");

      // Se per qualche motivo l'utente non viene trovato (es. cancellato), nega l'accesso
      if (!req.user) {
        return res.status(401).json({ message: "Non autorizzato, utente non trovato" });
      }

      next(); // L'utente è valido, procedi alla prossima funzione
    } catch (error) {
      // Se jwt.verify fallisce (es. token scaduto o manipolato), invia un errore specifico
      res.status(401).json({ message: "Non autorizzato, sessione scaduta o token non valido" });
    }
  }

  // Se non c'è nessun token nell'header
  if (!token) {
    res.status(401).json({ message: "Non autorizzato, nessun token fornito" });
  }
};

// Il middleware per l'admin non necessita di modifiche
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Accesso negato, privilegi di admin richiesti" });
  }
};

module.exports = { protect, admin };
