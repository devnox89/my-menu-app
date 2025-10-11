import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  // Usa la variabile d'ambiente per l'URL base
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor per le richieste in USCITA (aggiunge il token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ## NUOVO INTERCEPTOR PER LE RISPOSTE IN ENTRATA ##
// Gestisce globalmente gli errori, specialmente quelli di autenticazione
api.interceptors.response.use(
  (response) => {
    // Se la risposta è OK, la restituisce senza fare nulla
    return response;
  },
  (error) => {
    // Se la risposta è un errore
    if (error.response && error.response.status === 401) {
      // Se l'errore è '401 Unauthorized'
      localStorage.removeItem("token"); // Rimuove il token non valido
      window.dispatchEvent(new Event("storage")); // Notifica l'app del logout

      // Controlla che non siamo già sulla pagina di login per evitare loop
      if (window.location.pathname !== "/login") {
        toast.error("Sessione scaduta. Effettua nuovamente il login.");
        window.location.href = "/login"; // Reindirizza al login
      }
    }
    // Restituisce l'errore per essere gestito anche localmente se necessario
    return Promise.reject(error);
  }
);

export default api;
