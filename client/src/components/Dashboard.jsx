import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-hot-toast";

// Componente per la singola card del piatto
const MenuItemCard = ({ item }) => {
  // Calcola il prezzo più basso dalle varianti
  const lowestPrice = item.variants && item.variants.length > 0 ? Math.min(...item.variants.map((v) => v.price)) : 0;

  return (
    <div className={`bg-[var(--color-card)] rounded-lg shadow-md overflow-hidden border-2 border-[var(--color-card-border)] ${!item.isAvailable ? "opacity-50" : ""}`}>
      <img src={item.imageUrl ? item.imageUrl : "/no-image-placeholder.png"} alt={item.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg truncate text-[var(--color-heading)]">{item.name}</h3>
        <p className="text-[var(--color-text)] text-sm mb-2 h-10">{item.description ? item.description.substring(0, 40) + "..." : ""}</p>
        <div className="flex justify-between items-center">
          {/* Mostra il prezzo più basso e "Da" se ci sono più varianti */}
          <span className="font-bold text-[var(--color-primary)]">
            {item.variants && item.variants.length > 1 ? "Da " : ""}€{lowestPrice.toFixed(2)}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {item.isAvailable ? "Disponibile" : "Esaurito"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Il componente Dashboard (Anteprima Menù)
const Dashboard = () => {
  const { user } = useOutletContext();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      api
        .get("/menu")
        .then((res) => {
          setMenuItems(res.data);
          const uniqueCategories = ["All", ...new Set(res.data.map((item) => item.category))];
          setCategories(uniqueCategories);
        })
        .catch(() => toast.error("Impossibile caricare il menù."))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const filteredItems = activeCategory === "All" ? menuItems : menuItems.filter((item) => item.category === activeCategory);

  const themeStyles = user?.theme
    ? {
        "--color-primary": user.theme.primaryColor,
        "--color-background": user.theme.backgroundColor,
        "--color-card": user.theme.cardColor,
        "--color-text": user.theme.textColor,
        "--color-heading": user.theme.headingColor,
        "--color-border": user.theme.borderColor,
        "--color-card-border": user.theme.cardBorderColor,
      }
    : {};

  if (loading || !user) {
    return <div>Caricamento anteprima menù...</div>;
  }

  return (
    <div style={themeStyles}>
      <h1 className="text-3xl font-bold mb-6 text-[var(--color-heading)]">Anteprima Menù</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4 -mb-px overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`py-3 px-4 font-semibold text-sm whitespace-nowrap ${
                activeCategory === category ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <MenuItemCard key={item._id} item={item} />
        ))}
        {filteredItems.length === 0 && <p className="col-span-full text-center text-[var(--color-text)]">Nessun piatto in questa categoria.</p>}
      </div>
    </div>
  );
};

export default Dashboard;
