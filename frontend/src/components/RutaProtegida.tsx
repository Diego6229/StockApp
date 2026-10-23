import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface Props {
  children: React.ReactNode;
  soloAdmin?: boolean;
}

export default function RutaProtegida({ children, soloAdmin }: Props) {
  const usuario = useAuthStore((s) => s.usuario);
  if (!usuario) return <Navigate to="/login" replace />;
  if (soloAdmin && usuario.rol !== "ADMIN") return <Navigate to="/productos" replace />;
  return <>{children}</>;
}