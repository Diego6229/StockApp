import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Lock, Eye, EyeOff, CircleAlert, LoaderCircle, ArrowRight,
  Package, ShoppingCart, ChartColumn, TrendingUp, TriangleAlert,
} from "lucide-react";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

const VENTAJAS = [
  { icono: Package, titulo: "Productos y stock", texto: "Controla existencias y recibe avisos de stock bajo" },
  { icono: ShoppingCart, titulo: "Ventas al momento", texto: "Registra cada venta y el stock se actualiza solo" },
  { icono: ChartColumn, titulo: "Estadísticas", texto: "Consulta lo más vendido y lo recaudado en el mes" },
];

// Usuarios que crea DatosDemo.java en una base de datos vacía
const USUARIOS_DEMO = [
  { etiqueta: "Admin", nombre: "admin", password: "admin123" },
  { etiqueta: "Empleado", nombre: "empleado", password: "empleado123" },
];

// Alturas (en %) de la mini gráfica decorativa
const BARRAS = [45, 70, 55, 90, 65, 100, 80];

export default function LoginPage() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const setUsuario = useAuthStore((state) => state.setUsuario);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !password) return;
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
        setError("Usuario o contraseña incorrectos");
      }
    } catch {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  };

  const rellenarDemo = (demo: (typeof USUARIOS_DEMO)[number]) => {
    setNombre(demo.nombre);
    setPassword(demo.password);
    setError("");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Panel izquierdo: presentación de la app */}
      <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 text-white p-12 bajo:py-8">
        <div className="absolute -top-[15%] -left-[15%] w-[55%] aspect-square rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] aspect-square rounded-full bg-indigo-600/25 blur-3xl" />

        {/* Columna centrada que crece con la pantalla */}
        <div className="relative mx-auto w-full max-w-md xl:max-w-lg 2xl:max-w-xl flex flex-col justify-between gap-10 bajo:gap-6">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Logo" className="w-12 h-12 rounded-xl shadow-lg" />
            <div>
              <h1 className="text-lg font-bold leading-tight">StockApp</h1>
              <p className="text-xs text-slate-400">Gestión de inventario</p>
            </div>
          </div>

          <div className="aparecer">
            <h2 className="text-4xl 2xl:text-5xl bajo:text-3xl font-bold leading-tight">
              Controla tu inventario <span className="block text-blue-400">en un solo lugar</span>
            </h2>
            <p className="mt-4 text-slate-400 2xl:text-lg">
              Productos, ventas, usuarios y estadísticas de tu negocio, siempre al día.
            </p>

            <ul className="mt-8 bajo:mt-6 flex flex-col gap-4 bajo:gap-3">
              {VENTAJAS.map(({ icono: Icono, titulo, texto }) => (
                <li key={titulo} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 text-blue-400 shrink-0">
                    <Icono size={20} />
                  </span>
                  <div>
                    <p className="font-medium">{titulo}</p>
                    <p className="text-sm text-slate-400">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Vista previa decorativa de las estadísticas */}
            <div className="mt-10 bajo:mt-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-5 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400">Recaudado este mes</p>
                  <p className="text-2xl font-bold mt-1">2.480,50 €</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-full px-2 py-1">
                  <TrendingUp size={14} /> +12%
                </span>
              </div>
              <div className="mt-4 flex items-end gap-2 h-20 bajo:h-14">
                {BARRAS.map((altura, i) => (
                  <div
                    key={i}
                    style={{ height: `${altura}%` }}
                    className={`flex-1 rounded-t-md ${i === BARRAS.length - 2 ? "bg-blue-500" : "bg-slate-700"}`}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-amber-300 bg-amber-400/10 rounded-lg px-3 py-2">
                <TriangleAlert size={14} /> 2 productos con stock bajo
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">© 2026 StockApp · Diego Muñoz Jiménez</p>
        </div>
      </aside>

      {/* Panel derecho: formulario */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm 2xl:max-w-md aparecer">
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <img src="/Logo.png" alt="Logo" className="w-11 h-11 rounded-xl shadow" />
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">StockApp</h1>
              <p className="text-xs text-slate-400">Gestión de inventario</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">Bienvenido de nuevo 👋</h2>
          <p className="text-sm text-slate-400 mt-1 mb-8">Inicia sesión para continuar</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-slate-700 mb-1.5">Usuario</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="usuario"
                  type="text"
                  placeholder="Usuario"
                  autoComplete="username"
                  autoFocus
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={verPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-11 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setVerPassword((v) => !v)}
                  aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <CircleAlert size={18} className="shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!nombre || !password || cargando}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cargando ? (
                <><LoaderCircle size={18} className="animate-spin" /> Entrando...</>
              ) : (
                <>Iniciar sesión <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Acceso demo</p>
            <p className="text-xs text-slate-400 mt-1 mb-3">Rellena los datos de un usuario de prueba</p>
            <div className="grid grid-cols-2 gap-2">
              {USUARIOS_DEMO.map((demo) => (
                <button
                  key={demo.nombre}
                  type="button"
                  onClick={() => rellenarDemo(demo)}
                  className="text-left rounded-lg border border-slate-200 px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-700">{demo.etiqueta}</p>
                  <p className="text-xs text-slate-400">{demo.nombre} / {demo.password}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
