import api from "./api";

export interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  foto?: string;
}

export const getUsuarios = () =>
  api.get<Usuario[]>("/usuarios").then((r) => r.data);

export const addUsuario = (usuario: { nombre: string; rol: string; contraseña: string; foto?: string }) =>
  api.post<Usuario>("/usuarios", usuario).then((r) => r.data);

export const updateUsuario = (id: number, usuario: { nombre: string; rol: string; contraseña?: string; foto?: string }) =>
  api.put<Usuario>(`/usuarios/${id}`, usuario).then((r) => r.data);

export const deleteUsuario = (id: number) =>
  api.delete(`/usuarios/${id}`);
