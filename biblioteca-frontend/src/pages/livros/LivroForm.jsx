import { useState } from "react";
import Modal from "../../components/Modal";
import { getErrorMessage } from "../../api/client";

const VAZIO = {
  titulo: "",
  autor: "",
  editora: "",
  publicacao: "",
  categoria: "",
  isbn: "",
  total: "",
  disponivel: "",
  status: true,
};

export default function LivroForm({ livro, onClose, onSalvar }) {
  const [dados, setDados] = useState(
    livro
      ? {
          titulo: livro.titulo || "",
          autor: livro.autor || "",
          editora: livro.editora || "",
          publicacao: livro.publicacao ? livro.publicacao.slice(0, 10) : "",
          categoria: livro.categoria || "",
          isbn: livro.isbn || "",
          total: livro.total ?? "",
          disponivel: livro.disponivel ?? "",
          status: livro.status ?? true,
        }
      : VAZIO
  );
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function set(campo, valor) {
    setDados((d) => ({ ...d, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      const payload = {
        ...dados,
        total: Number(dados.total),
        disponivel: dados.disponivel === "" ? undefined : Number(dados.disponivel),
      };
      await onSalvar(payload);
    } catch (err) {
      setErro(getErrorMessage(err));
      setSalvando(false);
    }
  }

  return (
    <Modal title={livro ? "Editar livro" : "Cadastrar livro"} onClose={onClose}>
      {erro && <div className="error-banner">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field span-2">
            <label>Título *</label>
            <input value={dados.titulo} onChange={(e) => set("titulo", e.target.value)} required />
          </div>
          <div className="field">
            <label>Autor</label>
            <input value={dados.autor} onChange={(e) => set("autor", e.target.value)} />
          </div>
          <div className="field">
            <label>Editora</label>
            <input value={dados.editora} onChange={(e) => set("editora", e.target.value)} />
          </div>
          <div className="field">
            <label>Categoria</label>
            <input value={dados.categoria} onChange={(e) => set("categoria", e.target.value)} />
          </div>
          <div className="field">
            <label>Ano de publicação</label>
            <input
              type="date"
              value={dados.publicacao}
              onChange={(e) => set("publicacao", e.target.value)}
            />
          </div>
          <div className="field span-2">
            <label>ISBN *</label>
            <input value={dados.isbn} onChange={(e) => set("isbn", e.target.value)} required />
          </div>
          <div className="field">
            <label>Quantidade total *</label>
            <input
              type="number"
              min="0"
              value={dados.total}
              onChange={(e) => set("total", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Quantidade disponível</label>
            <input
              type="number"
              min="0"
              value={dados.disponivel}
              onChange={(e) => set("disponivel", e.target.value)}
              placeholder="= total, se vazio"
            />
          </div>
          <div className="field">
            <label>Status</label>
            <select value={dados.status ? "1" : "0"} onChange={(e) => set("status", e.target.value === "1")}>
              <option value="1">Disponível</option>
              <option value="0">Indisponível</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={salvando}>
            {salvando ? "Salvando…" : "Salvar"}
          </button>
          <button className="btn btn-outline" type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
