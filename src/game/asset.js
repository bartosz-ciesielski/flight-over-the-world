/** Ścieżka do pliku z /public — działa i lokalnie, i na GitHub Pages. */
export const asset = (path) =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\//, "")}`;
