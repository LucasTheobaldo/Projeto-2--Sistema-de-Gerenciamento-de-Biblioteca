import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RotaProtegida({ children, papeis }) {
  const { autenticado, usuario } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  if (papeis && !papeis.includes(usuario.papel)) {
    return <Navigate to="/livros" replace />;
  }

  return children;
}
