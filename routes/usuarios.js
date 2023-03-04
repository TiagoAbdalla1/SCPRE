const execSQLQuery = require('../db.js').execSQLQuery;
const sanitizeInt = require('../helpers.js').sanitizeInt;
const verifyToken = require('../token.js').verifyToken;
const findUser = require('../helpers.js').findUser;

module.exports = function (app) {
    app.get('/usuarios', (req, res) => {
        const query =
            `SELECT u.cod, u.nome, u.senha, u.email, c.nome AS cargo, u.ramal, u.horas_trabalhadas,
            u.data_inicio_contrato, u.data_fim_contrato, p.descricao as permissao FROM usuario AS u 
            INNER JOIN cargo AS c ON u.cod_cargo = c.cod INNER JOIN permissao AS p ON u.cod_permissao = p.cod ORDER BY FIELD(u.nome, 'RH','ADMINISTRADOR') DESC, u.nome ASC`;
        execSQLQuery(res, query);
    });
    var data = new Date();
    var ano = data.getFullYear();
    var mes = (data.getMonth() + 1);
    var dia = data.getDate();
    if (mes <= 9) {
        mes = "0" + mes;
    } else {
        mes = mes;
    }
    if (dia <= 9) {
        dia = "0" + dia;
    } else {
        dia = dia;
    }

    var dataAtual = ano + "-" + mes + "-" + dia;
    app.get('/usuarios/lista-presenca', (req, res) => {
        const query =
            `SELECT u.cod, u.nome, u.email,  u.ramal,c.nome AS cargo, r.data AS data, r.entrada AS entrada , r.intervalo AS intervalo, r.retorno AS retorno, r.saida AS saida
            FROM usuario AS u 
            INNER JOIN cargo AS c ON u.cod_cargo = c.cod
              INNER JOIN registro AS r ON u.cod = r.cod_usuario  
              `;
        execSQLQuery(res, query);
    });

    app.get('/usuarios/lista-usuarios', (req, res) => {
        const query =
            `SELECT u.cod, u.nome, u.senha, u.email, c.nome AS cargo, u.ramal, u.horas_trabalhadas,
            u.data_inicio_contrato, u.data_fim_contrato, p.descricao as permissao FROM usuario AS u 
            INNER JOIN cargo AS c ON u.cod_cargo = c.cod INNER JOIN permissao AS p ON u.cod_permissao = p.cod AND u.nome NOT IN ("Administrador","RH") ORDER BY FIELD(u.nome, 'RH','ADMINISTRADOR') DESC, u.nome ASC`;
        execSQLQuery(res, query);
    });

    app.get('/usuarios/:cod', (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const query =
            `SELECT u.cod, u.nome, u.senha, u.email, c.nome AS cargo,  c.carga_horaria AS carga_horaria, u.ramal, u.horas_trabalhadas,
            u.data_inicio_contrato, u.data_fim_contrato, p.descricao as permissao FROM usuario AS u 
            INNER JOIN cargo AS c ON u.cod_cargo = c.cod INNER JOIN permissao AS p ON u.cod_permissao = p.cod WHERE u.cod = ?`;
        execSQLQuery(res, query, [cod])
    });

    app.get('/usuarios/:cod/registros/:codRegistro', (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const codRegistro = sanitizeInt(req.params.codRegistro);
        const query =
            `SELECT r.cod, r.entrada, r.intervalo, r.retorno, r.saida, j1.descricao AS justificativa_entrada, j2.descricao AS justificativa_saida,
            j3.descricao AS justificativa_intervalo, j4.descricao AS justificativa_retorno FROM registro AS r
            LEFT JOIN justificativa AS j1 ON r.justificativa_entrada = j1.cod
            LEFT JOIN justificativa AS j2 ON r.justificativa_saida = j2.cod
            LEFT JOIN justificativa AS j3 ON r.justificativa_intervalo = j3.cod
            LEFT JOIN justificativa AS j4 ON r.justificativa_retorno = j4.cod
            WHERE r.cod_usuario = ? AND r.cod = ?`;
        execSQLQuery(res, query, [cod, codRegistro])
    });


    app.post('/usuarios', verifyToken, (req, res) => {
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao == `"user"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                const codCargo = req.body.cod_cargo;
                const codPermissao = req.body.cod_permissao;
                const nome = req.body.nome;
                const senha = req.body.senha;
                const email = req.body.email ? req.body.email : null;
                const ramal = req.body.ramal ? req.body.ramal : null;
                const dataIniContrato = req.body.data_inicio_contrato ? req.body.data_inicio_contrato : null;
                const dataFimContrato = req.body.data_fim_contrato ? req.body.data_fim_contrato : null;

                console.log(global.userId);



                // if (codCargo == 1 && dataIniContrato == null && dataFimContrato == null || codCargo == 1 && dataIniContrato != null && dataFimContrato == null || codCargo == 1 && dataIniContrato == null && dataFimContrato != null) {
                //   res.status(401).send({ error: "Por favor preencha ambas as datas relacionadas ao contrato." });
                //   return;
                //  }
                const query =
                    `INSERT INTO usuario (cod_cargo, cod_permissao, nome, senha, email, ramal, data_inicio_contrato, data_fim_contrato) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                execSQLQuery(res, query, [codCargo, codPermissao, nome, senha, email, ramal, dataIniContrato, dataFimContrato], false)
                    .then(function (query) {
                        if (query.results == null) {
                            res.status(400).send({ error: "Erro ao criar usuário!" });
                        }
                        const qry =
                            `SELECT u.cod, u.nome, u.senha, u.email, c.nome AS cargo, u.ramal, u.horas_trabalhadas,
                    u.data_inicio_contrato, u.data_fim_contrato, p.descricao as permissao FROM usuario AS u 
                    INNER JOIN cargo AS c ON u.cod_cargo = c.cod INNER JOIN permissao AS p ON u.cod_permissao = p.cod WHERE u.cod = ?`;
                        execSQLQuery(res, qry, [query.results.insertId])
                    });
            }
        });
    });

    app.patch('/usuarios/:cod', (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const nome = req.body.nome;
        const senha = req.body.senha;
        const email = req.body.email;
        const ramal = req.body.ramal;
        if (senha.length < 4) {
            res.status(401).send({ error: "A senha deve conter no minímo 4 digitos!" });
        }
        if (senha == "") {
            res.status(401).send({ error: "Campo senha vazio por favor digite uma senha!" });
        } else if (senha == "123") {
            res.status(401).send({ error: "Senha semelhante a anterior. Por favor tente outra " });
        } else if (senha == "1234" || senha == "12345" || senha == "123456"
            || senha == "1234567" || senha == "12345678" || senha == "123456789"
            || senha == "4321" || senha == "54321" || senha == "654321"
            || senha == "7654321" || senha == "87654321" || senha == "987654321") {

            res.status(401).send({ error: "Senha de baixa segurança. Por favor digite outra" });
        } else {

            const query =
                `UPDATE usuario SET nome = ?, senha = ?, email = ?, ramal = ? WHERE cod = ?`;
            execSQLQuery(res, query, [nome, senha, email, ramal, cod], false)
                .then(function (query) {
                    const qry =
                        `SELECT u.cod, u.nome, u.senha, u.email, c.nome AS cargo, u.ramal, u.horas_trabalhadas,
            u.data_inicio_contrato, u.data_fim_contrato, p.descricao as permissao FROM usuario AS u 
            INNER JOIN cargo AS c ON u.cod_cargo = c.cod INNER JOIN permissao AS p ON u.cod_permissao = p.cod WHERE u.cod = ?`;
                    execSQLQuery(res, qry, [cod])
                });
        }
    });

    app.patch('/usuarios/:cod/senha', (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        findUser(req, res, cod).then(function (query) {
            /* SE QUISER PERMITIR APENAS PARA ADMIN, REMOVE O `|| query.results[0].cod == cod` DO IF ABAIXO */
            if (query.results[0].permissao == `"admin"` || query.results[0].cod == cod) {
                const senha = req.body.senha;

                if (senha.length < 4) {
                    res.status(401).send({ error: "A senha deve conter no minímo 4 digitos!" });
                }else if (senha == "") {
                    res.status(401).send({ error: "Campo senha vazio por favor digite uma senha!" });
                } else if (senha == "123") {
                    res.status(401).send({ error: "Senha semelhante a anterior. Por favor tente outra " });
                } else if (senha == "1234" || senha == "12345" || senha == "123456"
                    || senha == "1234567" || senha == "12345678" || senha == "123456789"
                    || senha == "4321" || senha == "54321" || senha == "654321"
                    || senha == "7654321" || senha == "87654321" || senha == "987654321") {

                    res.status(401).send({ error: "Senha de baixa segurança. Por favor digite outra" });
                }
                else {

                    const query = `UPDATE usuario SET senha = ? WHERE cod = ?`;
                    execSQLQuery(res, query, [senha, cod], false)

                    res.status(200).send();
                    return;
                }
            } else {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            }
        });
    });

    app.delete('/usuarios/:cod', (req, res) => {
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                const cod = sanitizeInt(req.params.cod);
                execSQLQuery(res, 'DELETE FROM usuario WHERE cod = ?', [cod], false);
                res.status(200).send();
                return;
            }
        });
    });
}