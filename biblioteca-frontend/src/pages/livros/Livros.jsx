import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/client";
import {
  listarLivros,
  buscarLivros,
  criarLivro,
  atualizarLivro,
  excluirLivro,
} from "../../api/services";
import { LivroStatusStamp } from "../../components/Stamp";
import LivroForm from "./LivroForm";

export default function Livros() {
  const { podeGerenciarAcervo, isAdmin } = useAuth();
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtros, setFiltros] = useState({ titulo: "", autor: "", categoria: "", disponivel: false });
  const [formAberto, setFormAberto] = useState(false);
  const [livroEditando, setLivroEditando] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const temFiltro = filtros.titulo || filtros.autor || filtros.categoria || filtros.disponivel;
      const dados = temFiltro
        ? await buscarLivros({
            titulo: filtros.titulo || undefined,
            autor: filtros.autor || undefined,
            categoria: filtros.categoria || undefined,
            disponivel: filtros.disponivel || undefined,
          })
        : await listarLivros();
      setLivros(dados);
    } catch (err) {
      setErro(getErrorMessage(err));
    } finally {
      setCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleSalvar(payload) {
    if (livroEditando) {
      await atualizarLivro(livroEditando.id, payload);
    } else {
      await criarLivro(payload);
    }
    setFormAberto(false);
    setLivroEditando(null);
    carregar();
  }

  async function handleExcluir(livro) {
    if (!window.confirm(`Excluir o livro "${livro.titulo}"?`)) return;
    try {
      await excluirLivro(livro.id);
      carregar();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Catálogo</span>
          <h1>Livros</h1>
          <p className="page-desc">Acervo completo, com busca por título, autor, categoria e disponibilidade.</p>
        </div>
        {podeGerenciarAcervo && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setLivroEditando(null);
              setFormAberto(true);
            }}
          >
            + Cadastrar livro
          </button>
        )}
      </div>

      <div className="filters-bar">
        <div className="field">
          <label>Título</label>
          <input
            value={filtros.titulo}
            onChange={(e) => setFiltros((f) => ({ ...f, titulo: e.target.value }))}
            placeholder="Buscar por título"
          />
        </div>
        <div className="field">
          <label>Autor</label>
          <input
            value={filtros.autor}
            onChange={(e) => setFiltros((f) => ({ ...f, autor: e.target.value }))}
            placeholder="Buscar por autor"
          />
        </div>
        <div className="field">
          <label>Categoria</label>
          <input
            value={filtros.categoria}
            onChange={(e) => setFiltros((f) => ({ ...f, categoria: e.target.value }))}
            placeholder="Buscar por categoria"
          />
        </div>
        <div className="field">
          <label>
            <input
              type="checkbox"
              checked={filtros.disponivel}
              onChange={(e) => setFiltros((f) => ({ ...f, disponivel: e.target.checked }))}
              style={{ marginRight: 6 }}
            />
            Somente disponíveis
          </label>
        </div>
      </div>

      {erro && <div className="error-banner">{erro}</div>}

      {carregando ? (
        <div className="spinner-text">Consultando o acervo…</div>
      ) : livros.length === 0 ? (
        <div className="table-wrap">
          <div className="empty-state">
            <h3>Nenhum livro encontrado</h3>
            <p className="text-muted">Ajuste os filtros ou cadastre um novo título.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Categoria</th>
                <th>ISBN</th>
                <th>Exemplares</th>
                <th>Status</th>
                {podeGerenciarAcervo && <th></th>}
              </tr>
            </thead>
            <tbody>
              {livros.map((livro) => (
                <tr key={livro.id}>
                  <td><strong>{livro.titulo}</strong></td>
                  <td>{livro.autor || "—"}</td>
                  <td>{livro.categoria || "—"}</td>
                  <td className="mono">{livro.isbn}</td>
                  <td className="mono">{livro.disponivel} / {livro.total}</td>
                  <td><LivroStatusStamp disponivel={livro.disponivel} /></td>
                  {podeGerenciarAcervo && (
                    <td>
                      <div className="cell-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setLivroEditando(livro);
                            setFormAberto(true);
                          }}
                        >
                          Editar
                        </button>
                        {isAdmin && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(livro)}>
                            Excluir
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formAberto && (
        <LivroForm
          livro={livroEditando}
          onClose={() => {
            setFormAberto(false);
            setLivroEditando(null);
          }}
          onSalvar={handleSalvar}
        />
      )}
    </>
  );
}
