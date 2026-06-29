module.exports = (sequelize, Sequelize) => {
    const Emprestimo = sequelize.define('emprestimo', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false,
            primaryKey: true
        },
        data_emprestimo: {
            type: Sequelize.DATE, allowNull: false
        },
        data_retorno: {
            type: Sequelize.DATE, allowNull: false
        },
        data_devolucao: {
            type: Sequelize.DATE, allowNull: true
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    });

    return Emprestimo;
}