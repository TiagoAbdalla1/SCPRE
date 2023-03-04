const execSQLQuery = require('../db.js').execSQLQuery;
const sanitizeInt = require('../helpers.js').sanitizeInt;
const verifyToken = require('../token.js').verifyToken;
const jwt = require('jsonwebtoken');

function login(res, query) {

    if (query.results.length > 0) {
        const id = query.results[0].cod;
        const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 12 * 60 * 60  // expira em 12h
        });
        res.status(200).send({ auth: true, token: token, usuario: query.results[0] });
    } else {
        res.status(500).send({ auth: false, error: "Seu Usuário e/ou Senha estão incorretos por favor digite novamente." });
    }
}

module.exports = function (app) {
    app.post('/login', (req, res) => {
        const cod = req.body.cod;
        const senha = req.body.senha;
        if (cod && senha) {
            execSQLQuery(res, `SELECT u.cod, u.nome, u.senha, u.email, c.nome AS cargo, u.ramal, u.horas_trabalhadas,
            u.data_inicio_contrato, u.data_fim_contrato, p.descricao as permissao, c.carga_horaria AS carga_horaria FROM usuario AS u 
            INNER JOIN cargo AS c ON u.cod_cargo = c.cod INNER JOIN permissao AS p ON u.cod_permissao = p.cod WHERE u.cod = ? and u.senha = ?`, [cod, senha], false)
                .then(function (query) {
                    login(res, query);
                }).catch(function (err) {
                    console.log("Erro: " + err);
                })
        } else {
            res.status(401).send({ auth: false, error: "Informe login e senha" });
        }

    });

    app.get('/logout', verifyToken, function (req, res, next) {
        res.status(200).send({ auth: false, token: null });
    });
}