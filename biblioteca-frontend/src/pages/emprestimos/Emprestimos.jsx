import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/client";
import {
  listarEmprestimos,
  buscarEmprestimos,
  criarEmprestimo,
  devolverEmprestimo,
  excluirEmprestimo,
  listarLivros,
  listarLeitores,
} from "../../api/services";
import { EmprestimoStamp } from "../../components/Stamp";
import EmprestimoForm from "./EmprestimoForm";

const STATUS_OPCOES = [
  { value: "", label: "Todos os status" },
  { value: "1", label: "Em aberto" },
  { value: "2", label: "Devolvido" },
  { value: "3", label: "Atrasado" },
];

function formatarData(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

export default function Emprestimos() {
  const { podeGerenciarAcervo, isAdmin } = useAuth();
  const [emprestimos, setEmprestimos] = useState([]);
  const [livros, setLivros] = useState([]);
  const [leitores, setLeitores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtros, setFiltros] = useState({ status: "", data: "" });
  const [formAberto, setFormAberto] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const temFiltro = filtros.status || filtros.data;
      const promessas = [
        temFiltro
          ? buscarEmprestimos({
              status: filtros.status || undefined,
              data: filtros.data || undefined,
            })
          : listarEmprestimos(),
      ];
      if (podeGerenciarAcervo) {
        promessas.push(listarLivros(), listarLeitores());
      }
      const [dadosEmprestimos, dadosLivros, dadosLeitores] = await Promise.all(promessas);
      setEmprestimos(dadosEmprestimos);
      if (podeGerenciarAcervo) {
        setLivros(dadosLivros || []);
        setLeitores(dadosLeitores || []);
      }
    } catch (err) {
      setErro(getErrorMessage(err));
    } finally {
      setCarregando(false);
    }
  }, [filtros, podeGerenciarAcervo]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const mapaLivros = Object.fromEntries(livros.map((l) => [l.id, l]));
  const mapaLeitores = Object.fromEntries(leitores.map((l) => [l.id, l]));

  async function handleCriar(payload) {
    await criarEmprestimo(payload);
    setFormAberto(false);
    carregar();
  }

  async function handleDevolver(emprestimo) {
    if (!window.confirm("Confirmar a devolução deste livro?")) return;
    try {
      await devolverEmprestimo(emprestimo.id);
      carregar();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  async function handleExcluir(emprestimo) {
    if (!window.confirm("Remover este registro de empréstimo?")) return;
    try {
      await excluirEmprestimo(emprestimo.id);
      carregar();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Circulação</span>
          <h1>Empréstimos</h1>
          <p className="page-desc">
            {podeGerenciarAcervo
              ? "Cartão de devolução de cada exemplar em circulação."
              : "Seus empréstimos e datas previstas de devolução."}
          </p>
        </div>
        {podeGerenciarAcervo && (
          <button className="btn btn-primary" onClick={() => setFormAberto(true)}>
            + Registrar empréstimo
          </button>
        )}
      </div>

      <div className="filters-bar">
        <div className="field">
          <label>Status</label>
          <select value={filtros.status} onChange={(e) => setFiltros((f) => ({ ...f, status: e.target.value }))}>
            {STATUS_OPCOES.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Data do empréstimo</label>
          <input type="date" value={filtros.data} onChange={(e) => setFiltros((f) => ({ ...f, data: e.target.value }))} />
        </div>
      </div>

      {erro && <div className="error-banner">{erro}</div>}

      {carregando ? (
        <div className="spinner-text">Consultando o fichário de empréstimos…</div>
      ) : emprestimos.length === 0 ? (
        <div className="table-wrap">
          <div className="empty-state">
            <h3>Nenhum empréstimo encontrado</h3>
            <p className="text-muted">Ajuste os filtros ou registre um novo empréstimo.</p>
          </div>
        </div>
      ) : (
        <div>
          {emprestimos.map((emp) => {
            const livro = mapaLivros[emp.livroId];
            const leitor = mapaLeitores[emp.leitorId];
            return (
              <div className="card" key={emp.id}>
                <span className="card-punch" />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem" }}>{livro ? livro.titulo : `Livro #${emp.livroId}`}</h3>
                    <p className="text-muted" style={{ margin: "2px 0 0", fontSize: "0.85rem" }}>
                      {leitor ? `${leitor.nome} · ${leitor.cadastro}` : `Leitor #${emp.leitorId}`}
                    </p>
                  </div>
                  <EmprestimoStamp status={emp.status} />
                </div>

                <div
                  className="mono"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "10px 24px",
                    marginTop: 16,
                    paddingTop: 14,
                    borderTop: "1px dashed var(--paper-line-strong)",
                    fontSize: "0.82rem",
                  }}
                >
                  <div>
                    <div className="text-muted" style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Emprestado em</div>
                    {formatarData(emp.data_emprestimo)}
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Devolver até</div>
                    {formatarData(emp.data_retorno)}
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Devolvido em</div>
                    {emp.data_devolucao ? formatarData(emp.data_devolucao) : "—"}
                  </div>
                </div>

                {podeGerenciarAcervo && (
                  <div className="cell-actions" style={{ marginTop: 16 }}>
                    {emp.status !== 2 && (
                      <button className="btn btn-outline btn-sm" onClick={() => handleDevolver(emp)}>
                        Registrar devolução
                      </button>
                    )}
                    {isAdmin && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(emp)}>
                        Excluir
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {formAberto && (
        <EmprestimoForm
          leitores={leitores}
          livros={livros}
          onClose={() => setFormAberto(false)}
          onSalvar={handleCriar}
        />
      )}
    </>
  );
}
