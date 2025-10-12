import React, { useState } from "react";

const MenuItemModal = ({ item, onClose }) => {
  const [isAllergensOpen, setIsAllergensOpen] = useState(false);

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative flex flex-col" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-4xl font-light z-10">
          &times;
        </button>

        <img src={item.imageUrl ? item.imageUrl : "/no-image-placeholder.png"} alt={item.name} className="w-full h-64 object-cover" />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{item.name}</h1>

          {/* Lista delle Varianti di Prezzo */}
          <div className="my-4 space-y-2 border-t border-b py-4">
            {item.variants.map((variant, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{variant.name}</span>
                <span className="font-semibold text-yellow-600">€{variant.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-700 my-6">{item.description}</p>

          {/* Sezione Allergeni a Tendina */}
          {item.allergens && item.allergens.trim() !== "" && (
            <div className="border-t pt-4">
              <button onClick={() => setIsAllergensOpen(!isAllergensOpen)} className="w-full flex justify-between items-center text-left font-bold text-yellow-800">
                <span>Informazioni su Allergeni</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${isAllergensOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isAllergensOpen ? "max-h-96 mt-2" : "max-h-0"}`}>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mt-2">
                  <p className="text-yellow-700">{item.allergens}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;
