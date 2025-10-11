import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import MenuItemModal from "./MenuItemModal";

const PublicMenu = () => {
  const { slug } = useParams();
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    menu: [],
    theme: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get(`/public/menu/${slug}`)
      .then((res) => {
        setRestaurantData({
          name: res.data.restaurantName,
          menu: res.data.menu.filter((item) => item.isAvailable),
          theme: res.data.theme,
        });
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Impossibile caricare il menu.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const groupedMenu = restaurantData.menu.reduce((acc, item) => {
    const category = item.category || "Varie";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const themeStyles = restaurantData.theme
    ? {
        "--color-primary": restaurantData.theme.primaryColor,
        "--color-background": restaurantData.theme.backgroundColor,
        "--color-card": restaurantData.theme.cardColor,
        "--color-text": restaurantData.theme.textColor,
        "--color-heading": restaurantData.theme.headingColor,
        "--color-border": restaurantData.theme.borderColor,
        "--color-card-border": restaurantData.theme.cardBorderColor,
      }
    : {};

  if (loading) return <p className="text-center mt-12">Caricamento...</p>;
  if (error) return <p className="text-center text-red-500 mt-12 font-bold">{error}</p>;

  const handleOpenModal = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);

  return (
    <div style={themeStyles} className="bg-[var(--color-background)] text-[var(--color-text)] min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-heading)]">{restaurantData.name}</h1>
          <p className="text-2xl font-light mt-1 text-[var(--color-text)]">Menù</p>
        </div>

        {Object.keys(groupedMenu).map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-3xl font-semibold text-center mb-8 text-[var(--color-heading)] border-b-2 border-[var(--color-border)] pb-2">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedMenu[category].map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleOpenModal(item)}
                  className="bg-[var(--color-card)] rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-[var(--color-card-border)] hover:border-[var(--color-primary)]"
                >
                  <img src={item.imageUrl || "/no-image-placeholder.png"} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-[var(--color-heading)]">{item.name}</h3>
                    <p className="text-[var(--color-text)] my-2 flex-grow">{item.description ? item.description.substring(0, 60) + "..." : ""}</p>

                    {/* Display allergen info on the card */}
                    {item.allergens && (
                      <div className="mt-auto pt-2 border-t border-dashed">
                        <p className="text-xs text-gray-500 italic">
                          <span className="font-semibold">Info Allergeni:</span> {item.allergens}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end items-center mt-2">
                      <strong className="text-lg text-[var(--color-primary)]">€{item.price.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {selectedItem && <MenuItemModal item={selectedItem} onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default PublicMenu;
