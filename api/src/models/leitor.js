module.exports = (sequelize, Sequelize) => {
    const Leitor = sequelize.define('leitor', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false,
            primaryKey: true
        },
        usuario_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        nome: {
            type: Sequelize.STRING, allowNull: false,
        },
        cadastro: {
            type: Sequelize.STRING, allowNull: false
        },
        email: {
            type: Sequelize.STRING, allowNull: false,
        },
        telefone: {
            type: Sequelize.STRING, allowNull: false
        },
        endereco: {
            type: Sequelize.STRING, allowNull: false,
        },
        status: {
            type: Sequelize.BOOLEAN, allowNull: false
        }
    });

    return Leitor;
}