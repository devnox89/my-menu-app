import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-hot-toast";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import CategoryManager from "./CategoryManager";
import MenuItemForm from "./MenuItemForm";
import { SortableMenuItem } from "./SortableMenuItem";

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuRes, catRes] = await Promise.all([api.get("/menu"), api.get("/categories")]);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
    } catch (error) {
      toast.error("Impossibile caricare i dati della dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = menuItems.findIndex((item) => item._id === active.id);
      const newIndex = menuItems.findIndex((item) => item._id === over.id);
      const newOrder = arrayMove(menuItems, oldIndex, newIndex);

      setMenuItems(newOrder);

      const orderedIds = newOrder.map((item) => item._id);
      api
        .put("/menu/update-order", { orderedIds })
        .then(() => toast.success("Ordine salvato!"))
        .catch(() => {
          toast.error("Errore nel salvataggio dell'ordine.");
          fetchData();
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo piatto?")) {
      api
        .delete(`/menu/${id}`)
        .then(() => {
          toast.success("Piatto eliminato!");
          fetchData(); // Ricarica i dati per aggiornare la lista
        })
        .catch(() => toast.error("Errore durante l'eliminazione."));
    }
  };

  const handleToggleAvailability = (id) => {
    api
      .patch(`/menu/${id}/toggle`)
      .then(() => {
        toast.success("Disponibilità aggiornata!");
        fetchData(); // Ricarica i dati per aggiornare lo stato
      })
      .catch(() => toast.error("Errore durante l'aggiornamento."));
  };

  const handleFormSubmit = (updatedOrNewItem) => {
    if (editingItem) {
      // Se stavamo modificando, sostituisci l'elemento vecchio con quello nuovo nell'array
      setMenuItems((prevItems) => prevItems.map((item) => (item._id === updatedOrNewItem._id ? updatedOrNewItem : item)));
    } else {
      // Se era un nuovo piatto, aggiungilo in fondo all'array
      setMenuItems((prevItems) => [...prevItems, updatedOrNewItem]);
    }
    setEditingItem(null); // Chiude il form
  };

  if (loading) {
    return <div>Caricamento gestione menù...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Gestione Piatti</h1>

      <CategoryManager categories={categories} setCategories={setCategories} />

      <MenuItemForm itemToEdit={editingItem} onFormSubmit={handleFormSubmit} clearEdit={() => setEditingItem(null)} categories={categories} />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Elenco Piatti</h2>
        <p className="text-sm text-gray-500 mb-4">Clicca e trascina le icone con i puntini per riordinare i piatti.</p>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={menuItems.map((item) => item._id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <SortableMenuItem key={item._id} item={item} onEdit={() => setEditingItem(item)} onDelete={handleDelete} onToggleAvailability={handleToggleAvailability} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default MenuManager;
