// This function extracts the title from a markdown file
export const getTitle = (title: string) => {
  // Usamos una expresión regular para encontrar el primer título (# Title)
  const match = title.match(/^#\s(.+)/m);
  // Si se encuentra un título, devolvemos el texto; si no, devolvemos una cadena vacía
  return match ? match[1].trim() : "Sin título";
};