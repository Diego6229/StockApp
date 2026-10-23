import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getMasVendidos, getTotalRecaudado, getStockBajo, ProductoVendido, ProductoStockBajo } from "../services/estadisticasService";

export default function EstadisticasPage() {
  const navigate = useNavigate();
  const usuario = useAuthStore((s) => s.usuario);
  const setUsuario = useAuthStore((s) => s.setUsuario);
  const [masVendidos, setMasVendidos] = useState<ProductoVendido[]>([]);
  const [totalRecaudado, setTotalRecaudado] = useState(0);
  const [stockBajo, setStockBajo] = useState<ProductoStockBajo[]>([]);

  useEffect(() => {
    getMasVendidos().then(setMasVendidos);
    getTotalRecaudado().then(setTotalRecaudado);
    getStockBajo().then(setStockBajo);
  }, []);

  const top5 = masVendidos.slice(0, 5);
  const masVendido = masVendidos[0];
  const menosVendido = masVendidos[masVendidos.length - 1];
  const cerrarSesion = () => { setUsuario(null); navigate("/login"); };

  const COLORES = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

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
        
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors">
          <span>🏠</span> Inicio
        </button>
        <button onClick={() => navigate("/productos")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors"><span>📦</span> Productos</button>
        <button onClick={() => navigate("/categorias")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors"><span>🏷️</span> Categorías</button>
        <button onClick={() => navigate("/usuarios")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors"><span>👤</span> Usuarios</button>
        <button onClick={() => navigate("/estadisticas")} className="flex items-center gap-2 bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm font-medium"><span>📊</span> Estadísticas</button>
        
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
          <h2 className="text-xl font-bold text-slate-800">Estadísticas</h2>
          <p className="text-xs text-slate-400">Resumen del mes actual</p>
        </div>

        <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
          {/* Tarjetas resumen */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-3">🏆 Más vendido</p>
              {masVendido ? (
                <>
                  <p className="text-2xl font-bold leading-tight">{masVendido.nombre}</p>
                  <p className="text-sm opacity-80 mt-1">{masVendido.unidades} unidades</p>
                </>
              ) : <p className="text-lg opacity-70">Sin datos</p>}
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-3">📉 Menos vendido</p>
              {menosVendido && menosVendido !== masVendido ? (
                <>
                  <p className="text-2xl font-bold leading-tight">{menosVendido.nombre}</p>
                  <p className="text-sm opacity-80 mt-1">{menosVendido.unidades} unidades</p>
                </>
              ) : <p className="text-lg opacity-70">Sin datos</p>}
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-3">💰 Total recaudado</p>
              <p className="text-3xl font-bold">{totalRecaudado.toFixed(2)}€</p>
              <p className="text-sm opacity-80 mt-1">Este mes</p>
            </div>
          </div>

          {/* Gráfica y tabla */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {/* Gráfica de barras */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Top 5 productos más vendidos</h3>
              {top5.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={top5} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: "#64748b" }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                    <Tooltip formatter={(value) => [`${value} uds`, "Vendidas"]} />
                    <Bar dataKey="unidades" radius={[6, 6, 0, 0]}>
                      {top5.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-52 flex items-center justify-center text-slate-400 text-sm">Sin ventas este mes</div>
              )}
            </div>

            {/* Tabla stock bajo */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-700">⚠️ Productos con stock bajo</h3>
                <p className="text-xs text-slate-400">{stockBajo.length} productos por reponer</p>
              </div>
              <div className="overflow-auto max-h-64">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actual</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mínimo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stockBajo.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-medium text-slate-800">{p.nombre}</td>
                        <td className="px-4 py-2 text-red-500 font-semibold">{p.stockActual}</td>
                        <td className="px-4 py-2 text-slate-500">{p.stockMinimo}</td>
                      </tr>
                    ))}
                    {stockBajo.length === 0 && (
                      <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-400 text-sm">✓ Todo el stock está al día</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
