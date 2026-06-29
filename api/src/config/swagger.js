const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Sistema de Gerenciamento de Biblioteca',
            version: '1.0.0',
            description: 'API REST para gerenciamento de livros, leitores e empréstimos, com autenticação JWT e controle de acesso por perfil (Administrador, Bibliotecário, Leitor).'
        },
        servers: [
            {url: 'http://localhost:8081', description: 'Servidor local'}
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Erro: {
                    type: 'object',
                    properties: {erro: {type: 'string'}}
                },
                Usuario: {
                    type: 'object',
                    properties: {
                        id: {type: 'integer', example: 1},
                        login: {type: 'string', example: 'admin'},
                        papel: {type: 'integer', description: '1=Administrador, 2=Bibliotecário, 3=Leitor', example: 1}
                    }
                },
                Livro: {
                    type: 'object',
                    properties: {
                        id: {type: 'integer', example: 1},
                        titulo: {type: 'string', example: 'O Senhor dos Anéis'},
                        autor: {type: 'string', example: 'J.R.R. Tolkien'},
                        editora: {type: 'string', example: 'Martins Fontes'},
                        publicacao: {type: 'string', format: 'date', example: '1954-07-29'},
                        categoria: {type: 'string', example: 'Fantasia'},
                        isbn: {type: 'string', example: '9788533613379'},
                        total: {type: 'integer', example: 3},
                        disponivel: {type: 'integer', example: 2},
                        status: {type: 'boolean', example: true}
                    }
                },
                Leitor: {
                    type: 'object',
                    properties: {
                        id: {type: 'integer', example: 1},
                        nome: {type: 'string', example: 'Aluno A'},
                        cadastro: {type: 'string', description: 'CPF ou RA', example: '11111111111'},
                        email: {type: 'string', example: 'alunoa@teste.com'},
                        telefone: {type: 'string', example: '43900000001'},
                        endereco: {type: 'string', example: 'Rua Teste, 1'},
                        status: {type: 'boolean', description: 'true = ativo, false = inativo', example: true}
                    }
                },
                Emprestimo: {
                    type: 'object',
                    properties: {
                        id: {type: 'integer', example: 1},
                        leitorId: {type: 'integer', example: 1},
                        livroId: {type: 'integer', example: 1},
                        data_emprestimo: {type: 'string', format: 'date-time'},
                        data_retorno: {type: 'string', format: 'date-time'},
                        data_devolucao: {type: 'string', format: 'date-time', nullable: true},
                        status: {type: 'integer', description: '1=Em aberto, 2=Devolvido, 3=Atrasado', example: 1}
                    }
                }
            }
        },
        security: [
            {bearerAuth: []}
        ]
    },
    apis: [path.join(__dirname, '../routes/*.js')]
};

module.exports = swaggerJsdoc(options);

