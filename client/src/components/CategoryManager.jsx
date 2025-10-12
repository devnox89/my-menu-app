import React, { useState } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-hot-toast";

const CategoryManager = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setIsLoading(true);
    try {
      const { data } = await api.post("/categories", { name: newCategory });
      setCategories(data);
      setNewCategory("");
      toast.success("Categoria aggiunta!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Errore durante l'aggiunta.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (window.confirm(`Sei sicuro di voler eliminare la categoria "${categoryName}"? Questa azione non può essere annullata.`)) {
      try {
        const { data } = await api.delete(`/categories/${encodeURIComponent(categoryName)}`);
        setCategories(data);
        toast.success("Categoria eliminata!");
      } catch (error) {
        toast.error("Errore durante l'eliminazione.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Gestisci Categorie</h2>
      <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
        <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nuova categoria (es. Pizze)" className="w-full p-2 border rounded" />
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-semibold whitespace-nowrap" disabled={isLoading}>
          {isLoading ? "Aggiungo..." : "Aggiungi"}
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
            <span>{category}</span>
            <button onClick={() => handleDeleteCategory(category)} className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg leading-none">
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
