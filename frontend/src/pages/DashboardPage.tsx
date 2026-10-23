import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";

interface DashboardData {
  totalProductos: number;
  totalCategorias: number;
  totalUsuarios: number;
  totalRecaudado: number;
  stockBajo: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const usuario = useAuthStore((s) => s.usuario);
  const setUsuario = useAuthStore((s) => s.setUsuario);
  const [datos, setDatos] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((r) => setDatos(r.data));
  }, []);

  const cerrarSesion = () => { setUsuario(null); navigate("/login"); };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-56 bg-slate-900 text-white flex flex-col py-6 px-4 gap-1 shadow-xl">
        <div className="flex items-center gap-3 mb-8 px-2">
          <img src="/Logo.png" alt="Logo" className="w-10 h-10 rounded-xl shadow" />
          <div>
            <h1 className="text-base font-bold leading-tight">StockApp</h1>
            <p className="text-xs text-slate-400">Gestión de inventario</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-widest px-2 mb-2">Menú</p>
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm font-medium">
          <span>🏠</span> Inicio
        </button>
        <button onClick={() => navigate("/productos")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors">
          <span>📦</span> Productos
        </button>
        <button onClick={() => navigate("/categorias")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors">
          <span>🏷️</span> Categorías
        </button>
        {usuario?.rol === "ADMIN" && (
          <button onClick={() => navigate("/usuarios")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors">
            <span>👤</span> Usuarios
          </button>
        )}
        {usuario?.rol === "ADMIN" && (
          <button onClick={() => navigate("/estadisticas")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors">
            <span>📊</span> Estadísticas
          </button>
        )}
        <div className="mt-auto">
          <div className="border-t border-slate-700 pt-3">
            <p className="text-xs text-slate-500 px-2 mb-1">{usuario?.nombre}</p>
            <p className="text-xs text-slate-600 px-2 mb-3">{usuario?.rol}</p>
            <button onClick={cerrarSesion} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-2.5 text-sm w-full transition-colors">Cerrar sesión</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Bienvenido, {usuario?.nombre} 👋</h2>
          <p className="text-xs text-slate-400">Resumen general del negocio</p>
        </div>

        <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
          {/* Tarjetas */}
          <div className="grid grid-cols-2 gap-4">
            <div onClick={() => navigate("/productos")} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Productos</p>
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-4xl font-bold text-slate-800">{datos?.totalProductos ?? "—"}</p>
              <p className="text-xs text-slate-400 mt-1">productos en inventario</p>
            </div>

            <div onClick={() => navigate("/categorias")} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Categorías</p>
                <span className="text-2xl">🏷️</span>
              </div>
              <p className="text-4xl font-bold text-slate-800">{datos?.totalCategorias ?? "—"}</p>
              <p className="text-xs text-slate-400 mt-1">categorías activas</p>
            </div>

            {usuario?.rol === "ADMIN" && (
              <div onClick={() => navigate("/usuarios")} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Usuarios</p>
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-4xl font-bold text-slate-800">{datos?.totalUsuarios ?? "—"}</p>
                <p className="text-xs text-slate-400 mt-1">usuarios registrados</p>
              </div>
            )}

            {usuario?.rol === "ADMIN" && (
              <div onClick={() => navigate("/estadisticas")} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recaudado este mes</p>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-4xl font-bold text-slate-800">{datos ? `${datos.totalRecaudado.toFixed(2)}€` : "—"}</p>
                <p className="text-xs text-slate-400 mt-1">ingresos del mes actual</p>
              </div>
            )}
          </div>

          {/* Alerta stock bajo */}
          {datos && datos.stockBajo > 0 && (
            <div onClick={() => navigate("/productos")} className="bg-red-50 border border-red-200 rounded-xl p-5 cursor-pointer hover:bg-red-100 transition-colors flex items-center gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-700">{datos.stockBajo} producto{datos.stockBajo > 1 ? "s" : ""} con stock bajo</p>
                <p className="text-xs text-red-500 mt-0.5">Haz clic para ver los productos que necesitan reposición</p>
              </div>
            </div>
          )}

          {datos && datos.stockBajo === 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4">
              <span className="text-3xl">✅</span>
              <div>
                <p className="font-semibold text-emerald-700">Todo el stock está al día</p>
                <p className="text-xs text-emerald-500 mt-0.5">No hay productos por debajo del stock mínimo</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}