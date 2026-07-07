import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/client";
import {
  listarLeitores,
  buscarLeitores,
  criarLeitor,
  atualizarLeitor,
  inativarLeitor,
  excluirLeitor,
} from "../../api/services";
import { LeitorStatusStamp } from "../../components/Stamp";
import LeitorForm from "./LeitorForm";

export default function Leitores() {
  const { isAdmin } = useAuth();
  const [leitores, setLeitores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [formAberto, setFormAberto] = useState(false);
  const [leitorEditando, setLeitorEditando] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const dados = busca ? await buscarLeitores(busca) : await listarLeitores();
      setLeitores(dados);
    } catch (err) {
      setErro(getErrorMessage(err));
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleSalvar(payload) {
    if (leitorEditando) {
      await atualizarLeitor(leitorEditando.id, payload);
    } else {
      await criarLeitor(payload);
    }
    setFormAberto(false);
    setLeitorEditando(null);
    carregar();
  }

  async function handleInativar(leitor) {
    if (!window.confirm(`Inativar o leitor "${leitor.nome}"? Ele não poderá realizar novos empréstimos.`)) return;
    try {
      await inativarLeitor(leitor.id);
      carregar();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  async function handleExcluir(leitor) {
    if (!window.confirm(`Excluir o leitor "${leitor.nome}"?`)) return;
    try {
      await excluirLeitor(leitor.id);
      carregar();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Cadastro</span>
          <h1>Leitores</h1>
          <p className="page-desc">Alunos e usuários habilitados a retirar livros por empréstimo.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setLeitorEditando(null);
            setFormAberto(true);
          }}
        >
          + Cadastrar leitor
        </button>
      </div>

      <div className="filters-bar">
        <div className="field">
          <label>Buscar por nome, CPF ou RA</label>
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Ex.: Aluno A, 11111111111" />
        </div>
      </div>

      {erro && <div className="error-banner">{erro}</div>}

      {carregando ? (
        <div className="spinner-text">Consultando leitores…</div>
      ) : leitores.length === 0 ? (
        <div className="table-wrap">
          <div className="empty-state">
            <h3>Nenhum leitor encontrado</h3>
            <p className="text-muted">Ajuste a busca ou cadastre um novo leitor.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF/RA</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leitores.map((leitor) => (
                <tr key={leitor.id}>
                  <td><strong>{leitor.nome}</strong></td>
                  <td className="mono">{leitor.cadastro}</td>
                  <td>{leitor.email || "—"}</td>
                  <td>{leitor.telefone || "—"}</td>
                  <td><LeitorStatusStamp status={leitor.status} /></td>
                  <td>
                    <div className="cell-actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setLeitorEditando(leitor);
                          setFormAberto(true);
                        }}
                      >
                        Editar
                      </button>
                      {leitor.status && (
                        <button className="btn btn-outline btn-sm" onClick={() => handleInativar(leitor)}>
                          Inativar
                        </button>
                      )}
                      {isAdmin && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(leitor)}>
                          Excluir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formAberto && (
        <LeitorForm
          leitor={leitorEditando}
          onClose={() => {
            setFormAberto(false);
            setLeitorEditando(null);
          }}
          onSalvar={handleSalvar}
        />
      )}
    </>
  );
}
