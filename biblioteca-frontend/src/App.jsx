import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, PAPEL } from "./context/AuthContext";
import RotaProtegida from "./components/RotaProtegida";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Livros from "./pages/livros/Livros";
import Leitores from "./pages/leitores/Leitores";
import Emprestimos from "./pages/emprestimos/Emprestimos";
import Usuarios from "./pages/usuarios/Usuarios";

function RaizRedirecionamento() {
  const { autenticado } = useAuth();
  return <Navigate to={autenticado ? "/livros" : "/login"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <RotaProtegida>
                <Layout />
              </RotaProtegida>
            }
          >
            <Route path="/livros" element={<Livros />} />
            <Route
              path="/leitores"
              element={
                <RotaProtegida papeis={[PAPEL.ADMINISTRADOR, PAPEL.BIBLIOTECARIO]}>
                  <Leitores />
                </RotaProtegida>
              }
            />
            <Route path="/emprestimos" element={<Emprestimos />} />
            <Route
              path="/usuarios"
              element={
                <RotaProtegida papeis={[PAPEL.ADMINISTRADOR]}>
                  <Usuarios />
                </RotaProtegida>
              }
            />
          </Route>

          <Route path="/" element={<RaizRedirecionamento />} />
          <Route path="*" element={<RaizRedirecionamento />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
