import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import MenuItemModal from "./MenuItemModal";
import { slugify } from "../utils/slugify"; // <-- Assicurati che questo import sia presente

const PublicMenu = () => {
  const { slug } = useParams();
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    description: "",
    coverCharge: 0,
    menu: [],
    theme: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get(`/public/menu/${slug}`)
      .then((res) => {
        const menuItems = res.data.menu.filter((item) => item.isAvailable);
        setRestaurantData({
          name: res.data.restaurantName,
          description: res.data.restaurantDescription,
          coverCharge: res.data.coverCharge,
          menu: menuItems,
          theme: res.data.theme,
        });

        if (menuItems.length > 0) {
          const firstCategory = menuItems[0].category || "Varie";
          setOpenCategory(firstCategory);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Impossibile caricare il menu.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Questo hook gestisce lo scroll
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    if (openCategory) {
      const categoryId = slugify(openCategory);
      const element = document.getElementById(categoryId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 500);
      }
    }
  }, [openCategory]);

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

  const toggleCategory = (category) => {
    setOpenCategory((prevOpenCategory) => (prevOpenCategory === category ? null : category));
  };

  return (
    <div style={themeStyles} className="bg-[var(--color-background)] text-[var(--color-text)] min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-heading)]">Il {restaurantData.name}</h1>
          {restaurantData.description && <p className="text-lg text-[var(--color-text)] mt-2 max-w-2xl mx-auto">{restaurantData.description}</p>}
          <p className="text-2xl font-light mt-4 text-[var(--color-text)]">Menù</p>
          {restaurantData.coverCharge > 0 && <p className="text-sm text-gray-500 italic mt-2">Coperto: €{restaurantData.coverCharge.toFixed(2)} a persona</p>}
        </div>

        <div className="space-y-4">
          {Object.keys(groupedMenu).map((category) => (
            <div
              key={category}
              id={slugify(category)} // Questo ID è l'ancora
              className="bg-[var(--color-card)] rounded-lg shadow-md overflow-hidden border border-[var(--color-card-border)] scroll-mt-8"
            >
              <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center p-4">
                <h2 className="text-2xl font-semibold text-[var(--color-heading)]">{category}</h2>
                <svg
                  className={`w-6 h-6 text-[var(--color-primary)] transition-transform duration-300 ${openCategory === category ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <div className={`transition-all duration-500 ease-in-out grid ${openCategory === category ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="p-4 border-t border-[var(--color-border)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {groupedMenu[category].map((item) => {
                        const lowestPrice = item.variants && item.variants.length > 0 ? Math.min(...item.variants.map((v) => v.price)) : 0;

                        return (
                          <div
                            key={item._id}
                            onClick={() => handleOpenModal(item)}
                            className="bg-[var(--color-card)] rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-[var(--color-primary)]"
                          >
                            <img src={item.imageUrl || "/no-image-placeholder.png"} alt={item.name} className="w-full h-48 object-cover" />
                            <div className="p-6 flex flex-col flex-grow">
                              <h3 className="text-xl font-bold text-[var(--color-heading)]">{item.name}</h3>
                              <p className="text-[var(--color-text)] my-2 flex-grow">{item.description ? item.description.substring(0, 60) + "..." : ""}</p>

                              {item.allergens && (
                                <div className="mt-auto pt-2 border-t border-dashed">
                                  <p className="text-xs text-gray-500 italic">
                                    <span className="font-semibold">Info Allergeni:</span> {item.allergens}
                                  </p>
                                </div>
                              )}

                              <div className="flex justify-end items-center mt-2">
                                <strong className="text-lg text-[var(--color-primary)]">
                                  {item.variants.length > 1 ? "Da " : ""}€{lowestPrice.toFixed(2)}
                                </strong>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedItem && <MenuItemModal item={selectedItem} onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default PublicMenu;
