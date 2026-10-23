import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const setUsuario = useAuthStore((state) => state.setUsuario);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setCargando(true);
    setError("");

    try {
      const response = await api.post(
        `/login?nombre=${encodeURIComponent(nombre)}&password=${encodeURIComponent(password)}`
      );

      if (response.data) {
        setUsuario(response.data);
        navigate("/dashboard");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch {
      setError("Credenciales incorrectas");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          StockApp
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={!nombre || !password || cargando}
            className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cargando ? "Entrando..." : "Iniciar sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}