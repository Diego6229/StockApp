import { create } from "zustand";

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

interface AuthState {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  setUsuario: (usuario) => set({ usuario }),
}));
