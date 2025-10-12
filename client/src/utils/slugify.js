// client/src/utils/slugify.js
export const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Sostituisce gli spazi con -
    .replace(/[^\w\-]+/g, "") // Rimuove tutti i caratteri non alfanumerici
    .replace(/\-\-+/g, "-") // Sostituisce i doppi -- con un singolo -
    .replace(/^-+/, "") // Rimuove i - iniziali
    .replace(/-+$/, ""); // Rimuove i - finali
};
