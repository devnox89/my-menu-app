import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableMenuItem = ({ item, onEdit, onDelete, onToggleAvailability }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center justify-between p-4 border rounded-lg bg-white ${!item.isAvailable ? "bg-gray-100 opacity-60" : ""} ${isDragging ? "shadow-2xl" : "shadow-sm"}`}
    >
      <div {...listeners} className="cursor-grab text-gray-400 mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </svg>
      </div>

      <div className="flex items-center gap-4 flex-grow">
        <img src={item.imageUrl || "/no-image-placeholder.png"} alt={item.name} className="w-16 h-16 object-cover rounded" />
        <div>
          <p className="font-bold">{item.name}</p>
          <p className="text-sm text-gray-500">{item.category}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          onClick={() => onToggleAvailability(item._id)}
          className={`px-3 py-1 rounded text-sm text-white ${item.isAvailable ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}`}
        >
          {item.isAvailable ? "Togli" : "Aggiungi"}
        </button>
        <button onClick={onEdit} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
          Modifica
        </button>
        <button onClick={() => onDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
          Elimina
        </button>
      </div>
    </div>
  );
};
