## Backend

1. Instale as dependências:
```bash
   npm install
```

2. Mude o nome do .env.example para .env, ajuste os valores DB conforme seu PostgreSQL local e crie uma chave JWP:

3. Crie o banco de dados no PostgreSQL com o nome definido em DB_NAME.

4. Rode o servidor populando dados de teste:         
   npm run init-db

5. Acesse a documentação Swagger em:
   http://localhost:8081/api-docs

## Usuários de teste (senha "1234" para todos)
- admin / 1234 (Administrador)
- biblio / 1234 (Bibliotecário)
- alunoA / 1234 (Leitor)
- alunoB / 1234 (Leitor)