import client from "./client";

// ---- Auth ----
export const login = (login, senha) =>
  client.post("/auth/login", { login, senha }).then((r) => r.data);

// ---- Livros ----
export const listarLivros = () => client.get("/livros").then((r) => r.data);

export const buscarLivros = (params) =>
  client.get("/livros/buscar", { params }).then((r) => r.data);

export const obterLivro = (id) =>
  client.get(`/livros/${id}`).then((r) => r.data);

export const criarLivro = (dados) =>
  client.post("/livros", dados).then((r) => r.data);

export const atualizarLivro = (id, dados) =>
  client.put(`/livros/${id}`, dados).then((r) => r.data);

export const excluirLivro = (id) =>
  client.delete(`/livros/${id}`).then((r) => r.data);

// ---- Leitores ----
export const listarLeitores = () =>
  client.get("/leitor").then((r) => r.data);

export const buscarLeitores = (q) =>
  client.get("/leitor/buscar", { params: { q } }).then((r) => r.data);

export const obterLeitor = (id) =>
  client.get(`/leitor/${id}`).then((r) => r.data);

export const criarLeitor = (dados) =>
  client.post("/leitor", dados).then((r) => r.data);

export const atualizarLeitor = (id, dados) =>
  client.put(`/leitor/${id}`, dados).then((r) => r.data);

export const inativarLeitor = (id) =>
  client.patch(`/leitor/${id}/inativar`).then((r) => r.data);

export const excluirLeitor = (id) =>
  client.delete(`/leitor/${id}`).then((r) => r.data);

// ---- Empréstimos ----
export const listarEmprestimos = () =>
  client.get("/emprestimo").then((r) => r.data);

export const buscarEmprestimos = (params) =>
  client.get("/emprestimo/buscar", { params }).then((r) => r.data);

export const obterEmprestimo = (id) =>
  client.get(`/emprestimo/${id}`).then((r) => r.data);

export const criarEmprestimo = (dados) =>
  client.post("/emprestimo", dados).then((r) => r.data);

export const devolverEmprestimo = (id) =>
  client.patch(`/emprestimo/${id}/devolver`).then((r) => r.data);

export const excluirEmprestimo = (id) =>
  client.delete(`/emprestimo/${id}`).then((r) => r.data);

// ---- Usuários do sistema (Administrador/Bibliotecário) ----
export const listarUsuarios = () =>
  client.get("/usuarios").then((r) => r.data);

export const criarUsuario = (dados) =>
  client.post("/usuario", dados).then((r) => r.data);

export const atualizarUsuario = (id, dados) =>
  client.put(`/usuario/${id}`, dados).then((r) => r.data);

export const excluirUsuario = (id) =>
  client.delete(`/usuario/${id}`).then((r) => r.data);
