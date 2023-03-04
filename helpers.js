const execSQLQuery = require('./db.js').execSQLQuery;

const sanitizeStr = function (s) {
    return s.trim();
}

const sanitizeInt = function (n) {
    n = sanitizeStr(n)
    return parseInt(n);
}

const findUser = function (req, res, cod) {
    const query =
        `SELECT u.cod AS cod, p.descricao AS permissao FROM usuario AS u 
         INNER JOIN permissao AS p ON u.cod_permissao = p.cod WHERE u.cod = ? LIMIT 1`;
    return execSQLQuery(res, query, [cod], false);
}

module.exports = {
    sanitizeStr,
    sanitizeInt,
    findUser
}








