Usuario = require('../models/usuario.js')
Leitor = require('../models/leitor.js')
Livro = require('../models/livro.js')
Emprestimo = require('../models/emprestimo.js')

module.exports = (db) => {
    const {Usuario, Leitor, Livro, Emprestimo} = db;

    // Empréstimo pertence a um Leitor
    Leitor.hasMany(Emprestimo, {
        foreignKey: 'leitorId',
        as: 'emprestimos',
        onDelete: 'RESTRICT'
    });
    Emprestimo.belongsTo(Leitor, {
        foreignKey: 'leitorId',
        as: 'leitor'
    });

    // Empréstimo pertence a um Livro
    Livro.hasMany(Emprestimo, {
        foreignKey: 'livroId',
        as: 'emprestimos'
    });
    Emprestimo.belongsTo(Livro, {
        foreignKey: 'livroId',
        as: 'livro'
    });

    // Empréstimo registrado por um Usuario (bibliotecário/admin)
    Usuario.hasMany(Emprestimo, {
        foreignKey: 'usuarioId',
        as: 'emprestimosRegistrados'
    });
    Emprestimo.belongsTo(Usuario, {
        foreignKey: 'usuarioId',
        as: 'registradoPor'
    });

    // Leitor pussui registro como um Usuario
    Usuario.hasOne(Leitor, {
        foreignKey: 'usuarioId',
        as: 'perfilLeitor'
    });
    Leitor.belongsTo(Usuario, {
        foreignKey: 'usuarioId',
        as: 'usuario'
    });



};