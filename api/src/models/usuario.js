module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('usuario', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false,
            primaryKey: true
        },
        login: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        senha: {
            type: Sequelize.STRING,
            allowNull: false
        },
        papel: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    });

    return Usuario;
}