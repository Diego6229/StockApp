import api from "./api";

export interface ProductoVendido {
  nombre: string;
  unidades: number;
  precio: number;
}

export interface ProductoStockBajo {
  id: number;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  categoria: { id: number; nombre: string };
}

export const getMasVendidos = () =>
  api.get<ProductoVendido[]>("/estadisticas/mas-vendidos").then((r) => r.data);

export const getTotalRecaudado = () =>
  api.get<number>("/estadisticas/total-recaudado").then((r) => r.data);

export const getStockBajo = () =>
  api.get<ProductoStockBajo[]>("/estadisticas/stock-bajo").then((r) => r.data);
