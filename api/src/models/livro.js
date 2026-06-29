module.exports = (sequelize, Sequelize) => {
    const Livro = sequelize.define('livro', {
        id: {
            type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true
        },
        titulo: {
            type: Sequelize.STRING, allowNull: false
        },
        autor: {
            type: Sequelize.STRING, allowNull: false
        },
        editora: {
            type: Sequelize.STRING, allowNull: false
        },
        publicacao: {
            type: Sequelize.DATE, allowNull: false
        },
        categoria: {
            type: Sequelize.STRING, allowNull: false
        },
        isbn: {
            type: Sequelize.STRING, allowNull: false, unique: true
        },
        total: {
            type: Sequelize.INTEGER, allowNull: false
        },
        disponivel: {
            type: Sequelize.INTEGER, allowNull: false
        },
        status: {
            type: Sequelize.BOOLEAN, allowNull: false
        },
    });
    return Livro;
}

