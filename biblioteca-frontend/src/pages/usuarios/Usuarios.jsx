import { useEffect, useState, useCallback } from "react";
import { getErrorMessage } from "../../api/client";
import { listarUsuarios, criarUsuario, atualizarUsuario, excluirUsuario } from "../../api/services";
import { PAPEL_LABEL } from "../../context/AuthContext";
import UsuarioForm from "./UsuarioForm";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [formAberto, setFormAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      setUsuarios(await listarUsuarios());
    } catch (err) {
      setErro(getErrorMessage(err));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleSalvar(payload) {
    if (usuarioEditando) {
      await atualizarUsuario(usuarioEditando.id, payload);
    } else {
      await criarUsuario(payload);
    }
    setFormAberto(false);
    setUsuarioEditando(null);
    carregar();
  }

  async function handleExcluir(usuario) {
    if (!window.confirm(`Excluir o usuário "${usuario.login}"?`)) return;
    try {
      await excluirUsuario(usuario.id);
      carregar();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Administração</span>
          <h1>Usuários do sistema</h1>
          <p className="page-desc">Contas de Administrador e Bibliotecário com acesso ao painel.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setUsuarioEditando(null);
            setFormAberto(true);
          }}
        >
          + Cadastrar usuário
        </button>
      </div>

      {erro && <div className="error-banner">{erro}</div>}

      {carregando ? (
        <div className="spinner-text">Consultando usuários…</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Login</th>
                <th>Papel</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.login}</strong></td>
                  <td>{PAPEL_LABEL[u.papel] || u.papel}</td>
                  <td>
                    <div className="cell-actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setUsuarioEditando(u);
                          setFormAberto(true);
                        }}
                      >
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(u)}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formAberto && (
        <UsuarioForm
          usuario={usuarioEditando}
          onClose={() => {
            setFormAberto(false);
            setUsuarioEditando(null);
          }}
          onSalvar={handleSalvar}
        />
      )}
    </>
  );
}
