const {Op} = require('sequelize');

async function atualizarAtrasados(db) {
    await db.Emprestimo.update(
        {status: 3},
        {
            where: {
                status: 1,
                data_retorno: {[Op.lt]: new Date()}
            }
        }
    );
}

module.exports = atualizarAtrasados;