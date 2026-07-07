import { useState } from "react";
import Modal from "../../components/Modal";
import { getErrorMessage } from "../../api/client";

const VAZIO = { login: "", senha: "", nome: "", cadastro: "", email: "", telefone: "", endereco: "" };

export default function LeitorForm({ leitor, onClose, onSalvar }) {
  const editando = Boolean(leitor);
  const [dados, setDados] = useState(
    leitor
      ? {
          nome: leitor.nome || "",
          cadastro: leitor.cadastro || "",
          email: leitor.email || "",
          telefone: leitor.telefone || "",
          endereco: leitor.endereco || "",
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
      await onSalvar(dados);
    } catch (err) {
      setErro(getErrorMessage(err));
      setSalvando(false);
    }
  }

  return (
    <Modal title={editando ? "Editar leitor" : "Cadastrar leitor"} onClose={onClose}>
      {erro && <div className="error-banner">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {!editando && (
            <>
              <div className="field">
                <label>Login *</label>
                <input value={dados.login} onChange={(e) => set("login", e.target.value)} required />
              </div>
              <div className="field">
                <label>Senha *</label>
                <input
                  type="password"
                  value={dados.senha}
                  onChange={(e) => set("senha", e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div className="field span-2">
            <label>Nome *</label>
            <input value={dados.nome} onChange={(e) => set("nome", e.target.value)} required />
          </div>
          <div className="field">
            <label>CPF ou RA *</label>
            <input value={dados.cadastro} onChange={(e) => set("cadastro", e.target.value)} required />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input type="email" value={dados.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="field">
            <label>Telefone</label>
            <input value={dados.telefone} onChange={(e) => set("telefone", e.target.value)} />
          </div>
          <div className="field">
            <label>Endereço</label>
            <input value={dados.endereco} onChange={(e) => set("endereco", e.target.value)} />
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
