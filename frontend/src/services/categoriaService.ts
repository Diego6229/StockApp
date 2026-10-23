import api from "./api";

export interface Categoria {
  id: number;
  nombre: string;
}

export const getCategorias = () =>
  api.get<Categoria[]>("/categorias").then((r) => r.data);

export const addCategoria = (categoria: { nombre: string }) =>
  api.post<Categoria>("/categorias", categoria).then((r) => r.data);

export const updateCategoria = (id: number, categoria: { nombre: string }) =>
  api.put<Categoria>(`/categorias/${id}`, categoria).then((r) => r.data);

export const deleteCategoria = (id: number) =>
  api.delete(`/categorias/${id}`);
