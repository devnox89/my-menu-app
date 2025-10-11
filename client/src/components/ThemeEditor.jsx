import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-hot-toast";

const ColorInput = ({ label, value, onChange }) => (
  <div>
    <label className="block text-gray-700 mb-1 font-semibold">{label}</label>
    <div className="flex items-center gap-4 p-2 border rounded-lg">
      <input type="color" value={value || ""} onChange={onChange} className="w-10 h-10 border-none p-0 rounded cursor-pointer" />
      <span className="text-gray-600 font-mono uppercase">{value}</span>
    </div>
  </div>
);

const ThemeEditor = ({ user, setUser }) => {
  const [theme, setTheme] = useState(user.theme);

  useEffect(() => {
    setTheme(user.theme);
  }, [user]);

  const handleChange = (e, colorName) => {
    setTheme({ ...theme, [colorName]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.promise(api.put("/auth/profile", { theme }), {
      loading: "Salvataggio tema...",
      success: (res) => {
        setUser(res.data);
        return "Tema salvato con successo!";
      },
      error: "Errore durante il salvataggio.",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Personalizza Colori Menù</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ColorInput label="Colore Principale" value={theme.primaryColor} onChange={(e) => handleChange(e, "primaryColor")} />
          <ColorInput label="Colore Bordo Categorie" value={theme.borderColor} onChange={(e) => handleChange(e, "borderColor")} />
          <ColorInput label="Colore Bordo Card" value={theme.cardBorderColor} onChange={(e) => handleChange(e, "cardBorderColor")} />
          <ColorInput label="Colore Titoli" value={theme.headingColor} onChange={(e) => handleChange(e, "headingColor")} />
          <ColorInput label="Colore Testo" value={theme.textColor} onChange={(e) => handleChange(e, "textColor")} />
          <ColorInput label="Sfondo Pagina" value={theme.backgroundColor} onChange={(e) => handleChange(e, "backgroundColor")} />
          <ColorInput label="Sfondo Card" value={theme.cardColor} onChange={(e) => handleChange(e, "cardColor")} />
        </div>
        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-yellow-600">
            Salva Tema
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThemeEditor;
