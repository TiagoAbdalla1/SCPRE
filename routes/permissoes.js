const execSQLQuery = require('../db.js').execSQLQuery;
const sanitizeInt = require('../helpers.js').sanitizeInt;
const verifyToken = require('../token.js').verifyToken;
const findUser = require('../helpers.js').findUser;

module.exports = function (app) {
    app.get('/permissoes', (req, res) => {
        execSQLQuery(res, 'SELECT * FROM permissao');
    });

    app.get('/permissoes/:cod', (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        execSQLQuery(res, 'SELECT * FROM permissao WHERE cod = ?', [cod]);
    });

    app.post('/permissoes', verifyToken, (req, res) => {
        const nome = req.body.nome;
        const descricao = req.body.descricao;
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'INSERT INTO permissao(nome, descricao) VALUES(?, ?)', [nome, descricao], false)
                    .then(function (query) {
                        execSQLQuery(res, 'SELECT * FROM permissao WHERE cod = ?', [query.results.insertId]);
                    });
            }
        });
    });

    app.patch('/permissoes/:cod', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const nome = req.body.nome;
        const descricao = req.body.descricao;
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'UPDATE permissao SET nome = ?, descricao = ? WHERE cod = ?', [nome, descricao, cod], false)
                    .then(function (query) {
                        execSQLQuery(res, 'SELECT * FROM permissao WHERE cod = ?', [req.params.cod]);
                    });
            }
        });
    });

    app.delete('/permissoes/:cod', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'DELETE FROM permissao WHERE cod = ?', [cod], false);
                res.status(200).send();
            }
        });
    });
}