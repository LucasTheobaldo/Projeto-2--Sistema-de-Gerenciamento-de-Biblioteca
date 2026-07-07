import { useState } from "react";
import Modal from "../../components/Modal";
import { getErrorMessage } from "../../api/client";
import { PAPEL_LABEL } from "../../context/AuthContext";

export default function UsuarioForm({ usuario, onClose, onSalvar }) {
  const editando = Boolean(usuario);
  const [login, setLoginValue] = useState(usuario?.login || "");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState(usuario?.papel || 2);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      const payload = { login, papel: Number(papel) };
      if (senha) payload.senha = senha;
      await onSalvar(payload);
    } catch (err) {
      setErro(getErrorMessage(err));
      setSalvando(false);
    }
  }

  return (
    <Modal title={editando ? "Editar usuário" : "Cadastrar usuário"} onClose={onClose}>
      {erro && <div className="error-banner">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Login *</label>
          <input value={login} onChange={(e) => setLoginValue(e.target.value)} required />
        </div>
        <div className="field">
          <label>{editando ? "Nova senha (opcional)" : "Senha *"}</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required={!editando}
          />
        </div>
        <div className="field">
          <label>Papel</label>
          <select value={papel} onChange={(e) => setPapel(e.target.value)}>
            <option value={1}>{PAPEL_LABEL[1]}</option>
            <option value={2}>{PAPEL_LABEL[2]}</option>
          </select>
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
