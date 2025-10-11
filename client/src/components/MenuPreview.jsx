import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-hot-toast";

// Componente per la singola card del piatto
const MenuItemCard = ({ item }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${!item.isAvailable ? "opacity-50" : ""}`}>
    <img src={item.imageUrl ? item.imageUrl : "https://via.placeholder.com/400x200.png?text=No+Image"} alt={item.name} className="w-full h-40 object-cover" />
    <div className="p-4">
      <h3 className="font-bold text-lg truncate">{item.name}</h3>
      <p className="text-gray-500 text-sm mb-2 h-10">{item.description ? item.description.substring(0, 40) + "..." : ""}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold text-yellow-600">€{item.price.toFixed(2)}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {item.isAvailable ? "Disponibile" : "Esaurito"}
        </span>
      </div>
    </div>
  </div>
);

const MenuPreview = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const filteredItems = activeCategory === "All" ? menuItems : menuItems.filter((item) => item.category === activeCategory);

  if (loading) return <div>Caricamento anteprima menù...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Anteprima Menù</h1>
      <div className="mb-6 border-b">
        <nav className="flex space-x-4 -mb-px overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`py-3 px-4 font-semibold text-sm whitespace-nowrap ${activeCategory === category ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500 hover:text-gray-700"}`}
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
        {filteredItems.length === 0 && <p>Nessun piatto in questa categoria.</p>}
      </div>
    </div>
  );
};

export default MenuPreview;
