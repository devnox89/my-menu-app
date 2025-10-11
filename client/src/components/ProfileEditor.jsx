import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-hot-toast";
import SubscriptionManager from "./SubscriptionManager";
import QRCodeGenerator from "./QRCodeGenerator";

const ProfileEditor = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        restaurantName: user.restaurantName || "",
        username: user.username || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      error: (err) => err.response?.data?.message || "Errore durante l'aggiornamento.",
    });
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("restaurant-qr-code");
    if (!svg) {
      toast.error("Impossibile trovare il QR Code da scaricare.");
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `${user.slug}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
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
        <h2 className="text-2xl font-bold mb-4">Il tuo Profilo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Nome Ristorante</label>
            <input type="text" name="restaurantName" value={formData.restaurantName} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Nuova Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Lascia vuoto per non cambiare" />
          </div>
          <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Salva Modifiche
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;
