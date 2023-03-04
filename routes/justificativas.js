const execSQLQuery = require('../db.js').execSQLQuery;
const sanitizeInt = require('../helpers.js').sanitizeInt;
const verifyToken = require('../token.js').verifyToken;
const findUser = require('../helpers.js').findUser;

module.exports = function (app) {
    app.get('/justificativas', (req, res) => {
        execSQLQuery(res, 'SELECT * FROM justificativa ORDER BY descricao ASC');
    });

    app.get('/justificativas/:cod', (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        execSQLQuery(res, 'SELECT * FROM justificativa WHERE cod = ?', [cod]);
    });

    app.post('/justificativas', verifyToken, (req, res) => {
        const descricao = req.body.descricao;
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'INSERT INTO justificativa(descricao) VALUES(?)', [descricao], false)
                    .then(function (query) {
                        execSQLQuery(res, 'SELECT * FROM justificativa WHERE cod = ?', [query.results.insertId]);
                    });
            }
        });
    });

    app.patch('/justificativas/:cod', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const descricao = req.body.descricao;
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'UPDATE justificativa SET descricao = ? WHERE cod = ?', [descricao, cod], false)
                    .then(function (query) {
                        execSQLQuery(res, 'SELECT * FROM justificativa WHERE cod = ?', [req.params.cod]);
                    });
            }
        });
    });

    app.delete('/justificativas/:cod', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'DELETE FROM justificativa WHERE cod = ?', [cod], false)
                res.status(200).send();
            }
        });
    });
}