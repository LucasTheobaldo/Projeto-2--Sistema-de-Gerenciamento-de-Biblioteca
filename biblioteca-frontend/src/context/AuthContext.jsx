import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { login as loginRequest } from "../api/services";

export const PAPEL = {
  ADMINISTRADOR: 1,
  BIBLIOTECARIO: 2,
  LEITOR: 3,
};

export const PAPEL_LABEL = {
  1: "Administrador",
  2: "Bibliotecário",
  3: "Leitor",
};

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem("acervo_usuario");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("acervo_token"));

  const entrar = useCallback(async (login, senha) => {
    const data = await loginRequest(login, senha);
    localStorage.setItem("acervo_token", data.token);
    localStorage.setItem("acervo_usuario", JSON.stringify(data.usuario));
    setToken(data.token);
    setUsuario(data.usuario);
    return data.usuario;
  }, []);

  const sair = useCallback(() => {
    localStorage.removeItem("acervo_token");
    localStorage.removeItem("acervo_usuario");
    setToken(null);
    setUsuario(null);
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      token,
      autenticado: Boolean(token && usuario),
      isAdmin: usuario?.papel === PAPEL.ADMINISTRADOR,
      isBibliotecario: usuario?.papel === PAPEL.BIBLIOTECARIO,
      isLeitor: usuario?.papel === PAPEL.LEITOR,
      podeGerenciarAcervo:
        usuario?.papel === PAPEL.ADMINISTRADOR || usuario?.papel === PAPEL.BIBLIOTECARIO,
      entrar,
      sair,
    }),
    [usuario, token, entrar, sair]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
