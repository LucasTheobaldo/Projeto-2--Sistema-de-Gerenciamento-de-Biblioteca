import { useState } from "react";
import Modal from "../../components/Modal";
import { getErrorMessage } from "../../api/client";

function hojeMaisDias(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

export default function EmprestimoForm({ leitores, livros, onClose, onSalvar }) {
  const [leitorId, setLeitorId] = useState("");
  const [livroId, setLivroId] = useState("");
  const [dataRetorno, setDataRetorno] = useState(hojeMaisDias(14));
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const leitoresAtivos = leitores.filter((l) => l.status);
  const livrosDisponiveis = livros.filter((l) => l.disponivel > 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      await onSalvar({
        leitorId: Number(leitorId),
        livroId: Number(livroId),
        data_retorno: dataRetorno,
      });
    } catch (err) {
      setErro(getErrorMessage(err));
      setSalvando(false);
    }
  }

  return (
    <Modal title="Registrar empréstimo" onClose={onClose}>
      {erro && <div className="error-banner">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Leitor *</label>
          <select value={leitorId} onChange={(e) => setLeitorId(e.target.value)} required>
            <option value="" disabled>
              Selecione um leitor ativo
            </option>
            {leitoresAtivos.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nome} ({l.cadastro})
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Livro *</label>
          <select value={livroId} onChange={(e) => setLivroId(e.target.value)} required>
            <option value="" disabled>
              Selecione um livro disponível
            </option>
            {livrosDisponiveis.map((l) => (
              <option key={l.id} value={l.id}>
                {l.titulo} ({l.disponivel} disponíveis)
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Data prevista de devolução *</label>
          <input
            type="date"
            value={dataRetorno}
            onChange={(e) => setDataRetorno(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={salvando}>
            {salvando ? "Registrando…" : "Registrar empréstimo"}
          </button>
          <button className="btn btn-outline" type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
