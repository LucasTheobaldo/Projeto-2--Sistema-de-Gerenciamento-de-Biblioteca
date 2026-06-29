require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const db = require('./config/db_sequelize');
const {PAPEIS} = require('./middlewares/papelMiddleware');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const livroRoutes = require('./routes/livroRoutes');
const leitorRoutes = require('./routes/leitorRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes);
app.use(usuarioRoutes);
app.use(livroRoutes);
app.use(leitorRoutes);
app.use(emprestimoRoutes);

async function BancoTeste() {
    const senhaHash = await bcrypt.hash('1234', 10);

    await db.Usuario.create({login: 'admin', senha: senhaHash, papel: PAPEIS.ADMIN});
    await db.Usuario.create({login: 'biblio', senha: senhaHash, papel: PAPEIS.BIBLIOTECARIO});

    const usuarioAlunoA = await db.Usuario.create({login: 'alunoA', senha: senhaHash, papel: PAPEIS.LEITOR});
    const usuarioAlunoB = await db.Usuario.create({login: 'alunoB', senha: senhaHash, papel: PAPEIS.LEITOR});

    await db.Leitor.create({
        usuarioId: usuarioAlunoA.id,
        nome: 'Aluno A',
        cadastro: '11111111111',
        email: 'alunoa@teste.com',
        telefone: '43900000001',
        endereco: 'Rua Teste, 1',
        status: true
    });

    await db.Leitor.create({
        usuarioId: usuarioAlunoB.id,
        nome: 'Aluno B',
        cadastro: '22222222222',
        email: 'alunob@teste.com',
        telefone: '43900000002',
        endereco: 'Rua Teste, 2',
        status: true
    });

    await db.Livro.create({
        titulo: 'Livro Teste 1', autor: 'Autor 1', editora: 'Editora X',
        publicacao: new Date('2020-01-01'), categoria: 'Ficção',
        isbn: '1111111111', total: 3, disponivel: 3, status: true
    });
    await db.Livro.create({
        titulo: 'Livro Teste 2', autor: 'Autor 2', editora: 'Editora Y',
        publicacao: new Date('2021-01-01'), categoria: 'Romance',
        isbn: '2222222222', total: 2, disponivel: 2, status: true
    });
    await db.Livro.create({
        titulo: 'Livro Teste 3', autor: 'Autor 3', editora: 'Editora Z',
        publicacao: new Date('2022-01-01'), categoria: 'Técnico',
        isbn: '3333333333', total: 1, disponivel: 1, status: true
    });

    console.log('Banco de dados inicial criado.');
    console.log('Login de teste (senha "1234" para todos): admin, biblio, alunoA, alunoB');
}

const args = process.argv.slice(2);
const forcarReset = args.includes('InitDB');

db.sequelize.sync({force: forcarReset}).then(async () => {
    if (forcarReset) {
        console.log('AVISO: { force: true } executado. Tabelas recriadas.');
        try {
            await BancoTeste();
        } catch (err) {
            console.error('Erro ao criar dados iniciais:', err);
        }
    } else {
        console.log('Banco de dados sincronizado.');
    }

    app.listen(8081, function () {
        console.log('Servidor rodando em http://localhost:8081');
        console.log('Documentação Swagger em http://localhost:8081/api-docs');
    });
}).catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
});