import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-hot-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { username, password });

      // CONTROLLO DI SICUREZZA: Assicurati che i dati essenziali siano presenti
      if (data && data.token && data.user) {
        // Se tutto è ok, procedi
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("storage"));
        toast.success("Login effettuato con successo!");

        if (data.user.subscriptionStatus === "active") {
          navigate("/dashboard");
        } else {
          navigate("/dashboard/account");
        }
      } else {
        // Se i dati sono incompleti, genera un errore per andare nel blocco catch
        throw new Error("Risposta del server non valida.");
      }
    } catch (error) {
      // Mostra l'errore specifico del server se disponibile, altrimenti un messaggio generico
      const errorMessage = error.response?.data || "Credenziali errate o errore imprevisto.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center mt-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Il tuo username"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="La tua password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-yellow-500 text-white p-3 rounded font-bold hover:bg-yellow-600 transition-colors duration-200">
          Accedi
        </button>
      </form>
    </div>
  );
};

export default Login;
