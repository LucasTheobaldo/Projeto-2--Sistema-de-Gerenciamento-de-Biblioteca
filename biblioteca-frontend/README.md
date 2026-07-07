# Acervo — Frontend (Sistema de Gerenciamento de Biblioteca)

Frontend em React + Vite que consome a API REST descrita em `openapi.json` (backend Node/Express, JWT, Swagger).

## Como rodar

1. Certifique-se de que o backend está rodando em `http://localhost:8081` (CORS já habilitado em `app.js`, conforme o README do backend).
2. Instale as dependências:

```bash
npm install
```

3. Rode em modo desenvolvimento:

```bash
npm run dev
```

O app abre em `http://localhost:5173`.

## Login

Use um dos usuários de teste (senha `1234` para todos): `admin`, `biblio`, `alunoA`, `alunoB`.

O token JWT retornado por `POST /auth/login` é salvo em `localStorage` e enviado automaticamente em `Authorization: Bearer <token>` em todas as chamadas (ver `src/api/client.js`).

## Estrutura

```
src/
  api/            # client axios + funções de cada recurso da API
  context/        # AuthContext (login, logout, papel do usuário)
  components/      # Layout, rota protegida, badges de status, modal
  pages/
    Login.jsx
    livros/        # listar, buscar/filtrar, cadastrar, editar, excluir
    leitores/       # listar, buscar, cadastrar, editar, inativar, excluir
    emprestimos/     # listar, filtrar, registrar, devolver, excluir
    usuarios/        # gestão de contas Administrador/Bibliotecário (somente Admin)
  styles/index.css  # tokens visuais (tema "catálogo de biblioteca")
```

## Controle de acesso por perfil (papel)

O menu lateral e as ações de cada tela se ajustam conforme `usuario.papel` retornado no login (`1=Administrador, 2=Bibliotecário, 3=Leitor`):

- **Leitor**: vê livros e apenas os próprios empréstimos (a própria API já filtra isso em `GET /emprestimo`).
- **Bibliotecário**: acessa livros, leitores e empréstimos; não acessa a tela de usuários do sistema.
- **Administrador**: acesso completo, incluindo cadastro de usuários e exclusões.

Isso é um controle de UI (esconder/mostrar telas e botões) — a validação de permissão definitiva continua sendo responsabilidade da API, que já retorna 403 quando aplicável.

## O que ainda falta pra ir além do MVP

- Paginação nas listagens (um dos itens de bônus da rubrica).
- Upload de capa dos livros (bônus).
- Dashboard com gráficos (bônus).
- Testes automatizados do frontend.
