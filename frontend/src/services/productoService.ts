import api from "./api";

export interface Categoria {
    id: number;
    nombre: string;
}

export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stockActual: number;
    stockMinimo: number;
    categoria: Categoria;
}

export const getProductos = () => api.get<Producto[]>("/productos").then((r) => r.data);

export const getCategorias = () => api.get<Categoria[]>("/categorias").then((r) => r.data);

export const addProducto = (producto: Omit<Producto, "id">) =>
    api.post<Producto>("/productos", producto).then((r) => r.data);

export const updateProducto = (id: number, producto: Omit<Producto, "id">) =>
    api.put<Producto>(`/productos/${id}`, producto).then((r) => r.data);

export const deleteProducto = (id: number) => api.delete(`/productos/${id}`);

