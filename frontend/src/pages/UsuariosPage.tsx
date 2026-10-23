import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Trash2 } from "lucide-react";
import { getUsuarios, addUsuario, updateUsuario, deleteUsuario, Usuario } from "../services/usuarioService";
import api from "../services/api";

export default function UsuariosPage() {
  const [errorPassword, setErrorPassword] = useState("");
  const navigate = useNavigate();
  const usuario = useAuthStore((s) => s.usuario);
  const setUsuario = useAuthStore((s) => s.setUsuario);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [seleccionado, setSeleccionado] = useState<Usuario | null>(null);
  const [modal, setModal] = useState<"añadir" | "editar" | null>(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [form, setForm] = useState({ nombre: "", rol: "EMPLEADO", contraseña: "", foto: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getUsuarios().then(setUsuarios); }, []);

  const abrirAñadir = () => {
    setForm({ nombre: "", rol: "EMPLEADO", contraseña: "", foto: "" });
    setModal("añadir");
  };
  const abrirEditar = () => {
    if (!seleccionado) return;
    setForm({ nombre: seleccionado.nombre, rol: seleccionado.rol, contraseña: "", foto: seleccionado.foto || "" });
    setErrorPassword("");
    setModal("editar");
  };

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, foto: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const guardar = async () => {
  if (modal === "editar" && seleccionado && form.contraseña) {
    const response = await api.post(
      `/usuarios/${seleccionado.id}/verificar-password?password=${encodeURIComponent(form.contraseña)}`
    );
    if (response.data === true) {
      setErrorPassword("La nueva contraseña es igual a la actual.");
      return;
    }
  }
  setErrorPassword("");
  if (modal === "añadir") {
    await addUsuario(form);
  } else if (modal === "editar" && seleccionado) {
    await updateUsuario(seleccionado.id, form);
  }
  setUsuarios(await getUsuarios());
  setModal(null); setSeleccionado(null);
};

  const eliminar = async () => {
    if (!seleccionado) return;
    await deleteUsuario(seleccionado.id);
    setUsuarios(await getUsuarios());
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
        <button onClick={() => navigate("/productos")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors"><span>📦</span> Productos</button>
        <button onClick={() => navigate("/categorias")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors"><span>🏷️</span> Categorías</button>
        <button onClick={() => navigate("/usuarios")} className="flex items-center gap-2 bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm font-medium"><span>👤</span> Usuarios</button>
        <button onClick={() => navigate("/estadisticas")} className="flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition-colors"><span>📊</span> Estadísticas</button>
        
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
            <h2 className="text-xl font-bold text-slate-800">Usuarios</h2>
            <p className="text-xs text-slate-400">{usuarios.length} usuarios</p>
          </div>
          <div className="flex gap-2">
            <button onClick={abrirAñadir} className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">＋ Añadir</button>
            <button onClick={abrirEditar} disabled={!seleccionado} className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">✏️ Editar</button>
            <button onClick={() => seleccionado && setModalEliminar(true)} disabled={!seleccionado} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"><Trash2 size={16} /> Eliminar</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {usuarios.map((u) => {
              const activo = u.id === seleccionado?.id;
              return (
                <div key={u.id} onClick={() => setSeleccionado(activo ? null : u)}
                  className={`bg-white rounded-xl shadow-sm border-2 p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${activo ? "border-blue-500 shadow-blue-100 shadow-md" : "border-slate-200 hover:border-slate-300 hover:shadow-md"}`}>
                  {u.foto ? (
                    <img src={u.foto} alt={u.nombre} className="w-20 h-20 rounded-full object-cover border-2 border-slate-200" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300">
                      <svg viewBox="0 0 24 24" className="w-12 h-12 text-slate-400" fill="currentColor">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                      </svg>
                    </div>
                  )}
                  <p className="font-semibold text-slate-800 text-sm text-center">{u.nombre}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.rol === "ADMIN" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                    {u.rol}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              {modal === "añadir" ? "✨ Añadir usuario" : "✏️ Editar usuario"}
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-3">
                {form.foto ? (
                  <img src={form.foto} alt="Foto" className="w-24 h-24 rounded-full object-cover border-2 border-slate-200" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300">
                    <svg viewBox="0 0 24 24" className="w-14 h-14 text-slate-400" fill="currentColor">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                )}
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFoto} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                  {form.foto ? "Cambiar foto" : "Añadir foto"}
                </button>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rol</label>
                <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="EMPLEADO">EMPLEADO</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {modal === "añadir" ? "Contraseña" : "Nueva contraseña (dejar vacío para no cambiar)"}
                </label>
                <input type="password" value={form.contraseña} onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {errorPassword && (
                  <p className="text-red-500 text-xs mt-1">{errorPassword}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
              <button onClick={guardar} disabled={!form.nombre.trim() || (modal === "añadir" && !form.contraseña)} className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white shadow-sm transition-colors">Guardar</button>
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
              <h3 className="text-xl font-bold text-slate-800">¿Eliminar usuario?</h3>
              <p className="text-slate-500 text-sm">
                Vas a eliminar a <span className="font-semibold text-slate-700">"{seleccionado.nombre}"</span>. Esta acción no se puede deshacer.
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
