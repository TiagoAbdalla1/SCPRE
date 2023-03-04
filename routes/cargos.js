const execSQLQuery = require('../db.js').execSQLQuery;
const sanitizeInt = require('../helpers.js').sanitizeInt;
const verifyToken = require('../token.js').verifyToken;
const findUser = require('../helpers.js').findUser;

module.exports = function (app) {
    app.get('/cargos', (req, res) => {
        execSQLQuery(res, 'SELECT * FROM cargo WHERE cargo.nome NOT IN ("Administrativo")');
    });

    app.get('/cargos/:cod', (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        execSQLQuery(res, 'SELECT * FROM cargo WHERE cod = ?', [cod]);
    });

    app.post('/cargos', verifyToken, (req, res) => {
        const nome = req.body.nome;
        const cargaHoraria = req.body.carga_horaria;
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'INSERT INTO cargo(nome, carga_horaria) VALUES(?, ?)', [nome, cargaHoraria], false)
                    .then(function (query) {
                        execSQLQuery(res, 'SELECT * FROM cargo WHERE cod = ?', [query.results.insertId]);
                    });
            }
        });
    });

    app.patch('/cargos/:cod', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const nome = req.body.nome;
        const cargaHoraria = req.body.carga_horaria;
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'UPDATE cargo SET nome = ?, carga_horaria = ? WHERE cod = ?', [nome, cargaHoraria, cod], false)
                    .then(function (query) {
                        execSQLQuery(res, 'SELECT * FROM cargo WHERE cod = ?', [req.params.cod]);
                    });
            }
        });
    });

    app.delete('/cargos/:cod', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'DELETE FROM cargo WHERE cod = ?', [cod], false);
                res.status(200).send();
            }
        });

    });
}