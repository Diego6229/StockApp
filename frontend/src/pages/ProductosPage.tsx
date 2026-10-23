import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";
import { Trash2 } from "lucide-react";
import { getProductos, getCategorias, addProducto, updateProducto, deleteProducto, Producto, Categoria } from "../services/productoService";

const productoVacio = { nombre: "", precio: 0, stockActual: 0, stockMinimo: 0, categoria: { id: 0, nombre: "" } };

export default function ProductosPage() {
  const navigate = useNavigate();
  const usuario = useAuthStore((s) => s.usuario);
  const setUsuario = useAuthStore((s) => s.setUsuario);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  const [modal, setModal] = useState<"añadir" | "editar" | null>(null);
  const [form, setForm] = useState(productoVacio);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState(0);
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroPrecioMax, setFiltroPrecioMax] = useState("");

  useEffect(() => { getProductos().then(setProductos); getCategorias().then(setCategorias); }, []);

  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === 0 || p.categoria?.id === filtroCategoria;
    const coincidePrecioMin = filtroPrecioMin === "" || p.precio >= parseFloat(filtroPrecioMin);
    const coincidePrecioMax = filtroPrecioMax === "" || p.precio <= parseFloat(filtroPrecioMax);
    return coincideNombre && coincideCategoria && coincidePrecioMin && coincidePrecioMax;
  });
  const filtrosActivos = filtroCategoria !== 0 || filtroPrecioMin !== "" || filtroPrecioMax !== "";
  const stockBajo = productos.filter(p => p.stockActual < p.stockMinimo).length;

  const abrirAñadir = () => { setForm(productoVacio); setModal("añadir"); };
  const abrirEditar = () => {
    if (!seleccionado) return;
    setForm({ nombre: seleccionado.nombre, precio: seleccionado.precio, stockActual: seleccionado.stockActual, stockMinimo: seleccionado.stockMinimo, categoria: seleccionado.categoria });
    setModal("editar");
  };
  const vender = async () => {
    if (!seleccionado || seleccionado.stockActual === 0) return;
    await api.post(`/venta/${seleccionado.id}?idUsuario=${usuario?.id}`);
    const actualizados = await getProductos();
    setProductos(actualizados);
    const productoActualizado = actualizados.find(p => p.id === seleccionado.id);
    if (productoActualizado) setSeleccionado(productoActualizado);
  };
  const guardar = async () => {
    if (modal === "añadir") await addProducto(form);
    else if (modal === "editar" && seleccionado) await updateProducto(seleccionado.id, form);
    setProductos(await getProductos());
    setModal(null); setSeleccionado(null);
  };
  const eliminar = async () => {
    if (!seleccionado) return;
    await deleteProducto(seleccionado.id);
    setProductos(await getProductos());
    setSeleccionado(null);
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
        <button onClick={() => navigate("/productos")} className="flex items-center gap-2 bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm font-medium">
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
          {stockBajo > 0 && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2 mb-3 text-xs text-red-300">
              ⚠️ {stockBajo} producto{stockBajo > 1 ? "s" : ""} con stock bajo
            </div>
          )}
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
            <h2 className="text-xl font-bold text-slate-800">Productos</h2>
            <p className="text-xs text-slate-400">{productos.length} productos en inventario</p>
          </div>
          <div className="flex gap-2">
            <button onClick={abrirAñadir} className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">＋ Añadir</button>
            <button onClick={vender} disabled={!seleccionado || seleccionado.stockActual === 0} className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">💰 Vender</button>
            <button onClick={abrirEditar} disabled={!seleccionado} className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">✏️ Editar</button>
            <button onClick={() => seleccionado && setModalEliminar(true)} disabled={!seleccionado} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
              <Trash2 size={16} /> Eliminar
            </button>          
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex gap-2">
                <input type="text" placeholder="🔍  Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${filtrosActivos ? "bg-blue-500 text-white border-blue-500" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                  ⚙️ Filtros {filtrosActivos && <span className="text-blue-500 rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold"></span>}
                </button>
              </div>
              {mostrarFiltros && (
                <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-36">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Categoría</label>
                    <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(parseInt(e.target.value))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value={0}>Todas</option>
                      {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Precio mín.</label>
                      <input type="number" placeholder="0" value={filtroPrecioMin} onChange={(e) => setFiltroPrecioMin(e.target.value)}
                        className="w-28 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                    <span className="text-slate-400 pb-2">—</span>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Precio máx.</label>
                      <input type="number" placeholder="∞" value={filtroPrecioMax} onChange={(e) => setFiltroPrecioMax(e.target.value)}
                        className="w-28 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                  </div>
                  <button onClick={() => { setFiltroCategoria(0); setFiltroPrecioMin(""); setFiltroPrecioMax(""); }}
                    className="px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-200 transition-colors border border-slate-200 bg-white">
                    Limpiar
                  </button>
                </div>
              )}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock actual</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mínimo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productosFiltrados.map((p) => {
                  const bajo = p.stockActual < p.stockMinimo;
                  const activo = p.id === seleccionado?.id;
                  return (
                    <tr key={p.id} onClick={() => setSeleccionado(activo ? null : p)}
                      className={`cursor-pointer transition-colors ${activo ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-slate-50"}`}>
                      <td className="px-4 py-3 font-medium text-slate-800">{p.nombre}</td>
                      <td className="px-4 py-3 text-slate-600">{p.precio.toFixed(2)} €</td>
                      <td className="px-4 py-3"><span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{p.categoria?.nombre}</span></td>
                      <td className={`px-4 py-3 font-semibold ${bajo ? "text-red-500" : "text-slate-700"}`}>{p.stockActual}</td>
                      <td className="px-4 py-3 text-slate-500">{p.stockMinimo}</td>
                      <td className="px-4 py-3">
                        {bajo ? <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">⚠️ Stock bajo</span>
                              : <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-1 rounded-full font-medium">✓ Stock correcto</span>}
                      </td>
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
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              {modal === "añadir" ? "✨ Añadir nuevo producto" : "✏️ Editar producto"}
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Precio (€)</label>
                  <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Categoría</label>
                  <select value={form.categoria.id} onChange={(e) => { const cat = categorias.find((c) => c.id === parseInt(e.target.value)); if (cat) setForm({ ...form, categoria: cat }); }}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={0}>Seleccionar categoría</option>
                    {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock actual</label>
                  <input type="number" value={form.stockActual} onChange={(e) => setForm({ ...form, stockActual: parseInt(e.target.value) })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock mínimo</label>
                  <input type="number" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: parseInt(e.target.value) })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
              <button onClick={guardar} className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-colors">Guardar producto</button>
            </div>
          </div>
        </div>
      )}
      {modalEliminar && seleccionado && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-red-100 rounded-full p-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">¿Eliminar producto?</h3>
              <p className="text-slate-500 text-sm">
                Vas a eliminar <span className="font-semibold text-slate-700">"{seleccionado.nombre}"</span>. Esta acción no se puede deshacer.
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