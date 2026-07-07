import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/client";

export default function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginValue, setLoginValue] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const destino = location.state?.from?.pathname || "/livros";

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await entrar(loginValue, senha);
      navigate(destino, { replace: true });
    } catch (err) {
      setErro(getErrorMessage(err));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">Acervo</div>
          <div className="brand-sub">Sistema de Biblioteca</div>
        </div>

        {erro && <div className="error-banner">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="login">Usuário</label>
            <input
              id="login"
              type="text"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              autoComplete="username"
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={carregando} style={{ width: "100%", justifyContent: "center" }}>
            {carregando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div className="login-hint">
          Usuários de teste (senha <code>1234</code>): <code>admin</code>, <code>biblio</code>,{" "}
          <code>alunoA</code>, <code>alunoB</code>.
        </div>
      </div>
    </div>
  );
}
