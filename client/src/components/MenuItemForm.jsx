import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-hot-toast";

const MenuItemForm = ({ itemToEdit, onFormSubmit, clearEdit, categories }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    allergens: "",
    image: null,
    imageUrl: "",
  });
  const [variants, setVariants] = useState([{ name: "Standard", price: "" }]);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || "",
        description: itemToEdit.description || "",
        category: itemToEdit.category || "",
        allergens: itemToEdit.allergens || "",
        image: null,
        imageUrl: itemToEdit.imageUrl || "",
      });
      setVariants(itemToEdit.variants && itemToEdit.variants.length > 0 ? JSON.parse(JSON.stringify(itemToEdit.variants)) : [{ name: "Standard", price: "" }]);
      setImagePreview(itemToEdit.imageUrl || "");
    } else {
      setFormData({
        name: "",
        description: "",
        allergens: "",
        image: null,
        imageUrl: "",
        category: categories && categories.length > 0 ? categories[0] : "",
      });
      setVariants([{ name: "Standard", price: "" }]);
      setImagePreview("");
    }
  }, [itemToEdit, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    setVariants((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants[index] = { ...newVariants[index], [name]: value };
      return newVariants;
    });
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", price: "" }]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) {
      toast.error("Deve esserci almeno una variante.");
      return;
    }
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
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
    data.append("category", formData.category);
    data.append("allergens", formData.allergens);
    data.append("variants", JSON.stringify(variants));
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
      toast.error(error.response?.data?.message || "Errore durante l'operazione.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">{itemToEdit ? "Modifica Piatto" : "Aggiungi Nuovo Piatto"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Nome Piatto</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Categoria</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded bg-white" required>
              <option value="" disabled>
                Seleziona una categoria
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-semibold">Descrizione</label>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descrizione del piatto" className="w-full p-2 border rounded" rows="3"></textarea>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Prezzi e Varianti</label>
          <div className="space-y-2">
            {variants.map((variant, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  name="name"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, e)}
                  placeholder="Nome variante (es. Piccola 0.2L)"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, e)}
                  placeholder="Prezzo (€)"
                  className="w-1/3 p-2 border rounded"
                  step="0.01"
                  required
                />
                <button type="button" onClick={() => removeVariant(index)} className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 disabled:opacity-50" disabled={variants.length <= 1}>
                  &times;
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addVariant} className="mt-2 text-sm text-blue-600 hover:underline font-semibold">
            + Aggiungi variante
          </button>
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

        <div>
          <label className="block text-gray-700 mb-1 font-semibold">Immagine</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
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
