import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Trash2 } from "lucide-react";
import { getCategorias, addCategoria, updateCategoria, deleteCategoria, Categoria } from "../services/categoriaService";

export default function CategoriasPage() {
  const navigate = useNavigate();
  const usuario = useAuthStore((s) => s.usuario);
  const setUsuario = useAuthStore((s) => s.setUsuario);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [seleccionada, setSeleccionada] = useState<Categoria | null>(null);
  const [modal, setModal] = useState<"añadir" | "editar" | null>(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [nombre, setNombre] = useState("");

  useEffect(() => { getCategorias().then(setCategorias); }, []);

  const abrirAñadir = () => { setNombre(""); setModal("añadir"); };
  const abrirEditar = () => {
    if (!seleccionada) return;
    setNombre(seleccionada.nombre);
    setModal("editar");
  };
  const guardar = async () => {
    if (modal === "añadir") await addCategoria({ nombre });
    else if (modal === "editar" && seleccionada) await updateCategoria(seleccionada.id, { nombre });
    setCategorias(await getCategorias());
    setModal(null); setSeleccionada(null);
  };
  const eliminar = async () => {
    if (!seleccionada) return;
    await deleteCategoria(seleccionada.id);
    setCategorias(await getCategorias());
    setSeleccionada(null);
    setModalEliminar(false);
  };
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
        
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors">
          <span>🏠</span> Inicio
        </button>
        <button onClick={() => navigate("/productos")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors">
          <span>📦</span> Productos
        </button>
        <button onClick={() => navigate("/categorias")} className="flex items-center gap-2 bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm font-medium">
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
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Categorías</h2>
            <p className="text-xs text-slate-400">{categorias.length} categorías</p>
          </div>
          <div className="flex gap-2">
            <button onClick={abrirAñadir} className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">＋ Añadir</button>
            <button onClick={abrirEditar} disabled={!seleccionada} className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">✏️ Editar</button>
            <button onClick={() => seleccionada && setModalEliminar(true)} disabled={!seleccionada} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"><Trash2 size={16} /> Eliminar</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categorias.map((c) => {
                  const activa = c.id === seleccionada?.id;
                  return (
                    <tr key={c.id} onClick={() => setSeleccionada(activa ? null : c)}
                      className={`cursor-pointer transition-colors ${activa ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-slate-50"}`}>
                      <td className="px-4 py-3 font-medium text-slate-800">{c.nombre}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              {modal === "añadir" ? "✨ Añadir categoría" : "✏️ Editar categoría"}
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
              <button onClick={guardar} disabled={!nombre.trim()} className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white shadow-sm transition-colors">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {modalEliminar && seleccionada && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-red-100 rounded-full p-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">¿Eliminar categoría?</h3>
              <p className="text-slate-500 text-sm">
                Vas a eliminar <span className="font-semibold text-slate-700">"{seleccionada.nombre}"</span> y todos sus productos. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalEliminar(false)} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
              <button onClick={eliminar} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white shadow-sm transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
