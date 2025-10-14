import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-hot-toast";
import SubscriptionManager from "./SubscriptionManager";
import QRCodeGenerator from "./QRCodeGenerator";

const ProfileEditor = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    restaurantDescription: "",
    coverCharge: 0,
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        restaurantName: user.restaurantName || "",
        restaurantDescription: user.restaurantDescription || "",
        coverCharge: user.coverCharge || 0,
        username: user.username || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToUpdate = { ...formData };
    if (!dataToUpdate.password) delete dataToUpdate.password;

    toast.promise(api.put("/auth/profile", dataToUpdate), {
      loading: "Salvataggio...",
      success: (res) => {
        setUser(res.data);
        return "Profilo aggiornato con successo!";
      },
      error: (err) => err.response?.data?.message || "Errore.",
    });
  };

  const handleDownloadQR = () => {
    /* ... (logica di download invariata) ... */
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <SubscriptionManager user={user} />
        {user.subscriptionStatus === "active" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Il tuo QR Code</h2>
            <div className="text-center">
              <QRCodeGenerator url={`${window.location.origin}/menu/${user.slug}`} id="restaurant-qr-code" />
            </div>
            <button onClick={handleDownloadQR} className="mt-4 w-full bg-gray-800 text-white font-bold py-3 px-4 rounded hover:bg-black">
              Scarica QR Code (PNG)
            </button>
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Informazioni Ristorante e Profilo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Nome Ristorante</label>
            <input type="text" name="restaurantName" value={formData.restaurantName} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Descrizione Ristorante</label>
            <textarea
              name="restaurantDescription"
              value={formData.restaurantDescription}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Una breve descrizione del tuo locale..."
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Prezzo Coperto (€)</label>
            <input type="number" name="coverCharge" value={formData.coverCharge} onChange={handleChange} className="w-full p-2 border rounded" step="0.50" min="0" />
          </div>
          <hr className="my-4" />
          <h3 className="text-xl font-bold">Dati di Accesso</h3>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Nuova Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Lascia vuoto per non cambiare" />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-yellow-600">
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;
