import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RutaProtegida from "./components/RutaProtegida";
import LoginPage from "./pages/LoginPage";
import ProductosPage from "./pages/ProductosPage";
import CategoriasPage from "./pages/CategoriasPage";
import UsuariosPage from "./pages/UsuariosPage";
import EstadisticasPage from "./pages/EstadisticasPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/productos" element={<RutaProtegida><ProductosPage /></RutaProtegida>} />
        <Route path="/categorias" element={<RutaProtegida><CategoriasPage /></RutaProtegida>} />
        <Route path="/usuarios" element={<RutaProtegida soloAdmin><UsuariosPage /></RutaProtegida>} />
        <Route path="/estadisticas" element={<RutaProtegida soloAdmin><EstadisticasPage /></RutaProtegida>} />
        <Route path="/dashboard" element={<RutaProtegida><DashboardPage /></RutaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;