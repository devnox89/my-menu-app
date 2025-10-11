import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // <-- NUOVO STATO
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Invia anche l'email
      await api.post("/auth/register", { username, email, password, restaurantName });
      toast.success("Registrazione avvenuta con successo! Ora puoi effettuare il login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Errore durante la registrazione.");
    }
  };

  return (
    <div className="flex justify-center items-center mt-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">Crea il tuo Account</h2>

        <div>
          <label className="block text-gray-700 mb-2">Nome Ristorante</label>
          <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 border rounded" />
        </div>

        <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
          Registrati
        </button>
      </form>
    </div>
  );
};

export default Register;
