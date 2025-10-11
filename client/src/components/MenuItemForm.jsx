import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-hot-toast";

const MenuItemForm = ({ itemToEdit, onFormSubmit, clearEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    allergens: "", // Should be a string
    image: null,
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || "",
        description: itemToEdit.description || "",
        price: itemToEdit.price || "",
        category: itemToEdit.category || "",
        allergens: itemToEdit.allergens || "",
        image: null,
        imageUrl: itemToEdit.imageUrl || "",
      });
      setImagePreview(itemToEdit.imageUrl || "");
    } else {
      setFormData({ name: "", description: "", price: "", category: "", allergens: "", image: null, imageUrl: "" });
      setImagePreview("");
    }
  }, [itemToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(formData.imageUrl || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("allergens", formData.allergens); // Append the string directly
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      let response;
      if (itemToEdit) {
        response = await api.put(`/menu/${itemToEdit._id}`, data);
        toast.success("Piatto aggiornato!");
      } else {
        response = await api.post("/menu", data);
        toast.success("Piatto aggiunto!");
      }
      onFormSubmit(response.data);
      clearEdit();
    } catch (error) {
      toast.error(error.response?.data?.message || "Errore.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">{itemToEdit ? "Modifica Piatto" : "Aggiungi Nuovo Piatto"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome Piatto" className="w-full p-2 border rounded" required />
          <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Categoria" className="w-full p-2 border rounded" required />
        </div>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descrizione" className="w-full p-2 border rounded" rows="3"></textarea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Prezzo (€)" className="w-full p-2 border rounded" step="0.01" required />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-semibold">Allergeni</label>
          <input
            type="text"
            name="allergens"
            value={formData.allergens}
            onChange={handleChange}
            placeholder="Es: Glutine, Lattosio, può contenere tracce di..."
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          {itemToEdit && (
            <button type="button" onClick={clearEdit} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-semibold">
              Annulla
            </button>
          )}
          <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-semibold" disabled={isSubmitting}>
            {isSubmitting ? "Salvataggio..." : itemToEdit ? "Salva Modifiche" : "Aggiungi Piatto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuItemForm;
