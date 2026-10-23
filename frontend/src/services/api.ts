import axios from "axios";

// Ruta relativa: la web la sirve el propio backend (o el proxy de Vite en desarrollo)
const api = axios.create({
  baseURL: "/api",
});

export default api;
