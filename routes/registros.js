const execSQLQuery = require('../db.js').execSQLQuery;
const sanitizeInt = require('../helpers.js').sanitizeInt;
const findUser = require('../helpers.js').findUser;
const verifyToken = require('../token.js').verifyToken;
var moment = require('moment');
var momentTimezone = require('moment-timezone');

const datetime = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss");
//console.log(datetime)
module.exports = function (app) {
    app.get('/usuarios/:cod/registros', (req, res) => {
const cod = sanitizeInt(req.params.cod);

        let query;
        if (req.query.dia !== undefined && req.query.dia !== null && req.query.dia !== '' &&
            req.query.mes !== undefined && req.query.mes !== null && req.query.mes !== '' &&
            req.query.ano !== undefined && req.query.ano !== null && req.query.ano !== '') {
            const dia = sanitizeInt(req.query.dia);
            const mes = sanitizeInt(req.query.mes);
            const ano = sanitizeInt(req.query.ano);
            let data = `${ano}-${mes}-${dia}`;
            query =
                `SELECT r.cod, r.cod_usuario, r.data, r.entrada, r.intervalo, r.retorno, r.saida, j1.descricao AS justificativa_entrada, j2.descricao AS justificativa_saida,
                j3.descricao AS justificativa_intervalo, j4.descricao AS justificativa_retorno FROM registro AS r
                LEFT JOIN justificativa AS j1 ON r.justificativa_entrada = j1.cod
                LEFT JOIN justificativa AS j2 ON r.justificativa_saida = j2.cod
                LEFT JOIN justificativa AS j3 ON r.justificativa_intervalo = j3.cod
                LEFT JOIN justificativa AS j4 ON r.justificativa_retorno = j4.cod
                WHERE r.cod_usuario = ? AND DATE(r.data) = ?
                ORDER BY r.data DESC LIMIT 120`;
            execSQLQuery(res, query, [cod, data], false).then(function (query) {
                res.status(200).send(query.results);
            });

        } else if (req.query.mes !== undefined && req.query.mes !== null && req.query.mes !== '' &&
            req.query.ano !== undefined && req.query.ano !== null && req.query.ano !== '') {
            const mes = sanitizeInt(req.query.mes);
            const ano = sanitizeInt(req.query.ano);
            query =
                `SELECT r.cod,r.cod_usuario, r.data, r.entrada, r.intervalo, r.retorno, r.saida, j1.descricao AS justificativa_entrada, j2.descricao AS justificativa_saida,
                j3.descricao AS justificativa_intervalo, j4.descricao AS justificativa_retorno FROM registro AS r
                LEFT JOIN justificativa AS j1 ON r.justificativa_entrada = j1.cod
                LEFT JOIN justificativa AS j2 ON r.justificativa_saida = j2.cod
                LEFT JOIN justificativa AS j3 ON r.justificativa_intervalo = j3.cod
                LEFT JOIN justificativa AS j4 ON r.justificativa_retorno = j4.cod
                WHERE r.cod_usuario = ? AND YEAR(r.data) = ? AND MONTH(r.data) = ?
                ORDER BY r.data DESC LIMIT 120`;
            execSQLQuery(res, query, [cod, ano, mes], false).then(function (query) {
                res.status(200).send(query.results);
            });
        } else {
            query =
                `SELECT r.cod,r.cod_usuario, r.data, r.entrada, r.intervalo, r.retorno, r.saida, j1.descricao AS justificativa_entrada, j2.descricao AS justificativa_saida,
                        j3.descricao AS justificativa_intervalo, j4.descricao AS justificativa_retorno FROM registro AS r
                        LEFT JOIN justificativa AS j1 ON r.justificativa_entrada = j1.cod
                        LEFT JOIN justificativa AS j2 ON r.justificativa_saida = j2.cod
                        LEFT JOIN justificativa AS j3 ON r.justificativa_intervalo = j3.cod
                        LEFT JOIN justificativa AS j4 ON r.justificativa_retorno = j4.cod
                        WHERE r.cod_usuario = ?               
                        ORDER BY r.data DESC LIMIT 120`;
            execSQLQuery(res, query, [cod], false).then(function (query) {
                res.status(200).send(query.results);
            });
    
        }
    });





app.get('/usuarios/:cod/filtro/registros', (req, res) => {
const cod = sanitizeInt(req.params.cod);
   let queryParams = [cod]
        whereQuery = '';
        let year = sanitizeInt(req.query.year);
        let yearQuery = year;
        
        if (year) {
            yearQuery = ' YEAR(r.data) =' +year
            queryParams.push(year)
            console.log(yearQuery)
        }
        let month = sanitizeInt(req.query.month);
        let monthQuery = month;
        if (month) {
            monthQuery = ' MONTH(r.data) = '+ month
            queryParams.push(month)
            console.log(monthQuery)
        }
        let query;
            query =
                `SELECT r.cod,r.cod_usuario, r.data, r.entrada, r.intervalo, r.retorno, r.saida, j1.descricao AS justificativa_entrada, j2.descricao AS justificativa_saida,
                        j3.descricao AS justificativa_intervalo, j4.descricao AS justificativa_retorno FROM registro AS r
                        LEFT JOIN justificativa AS j1 ON r.justificativa_entrada = j1.cod
                        LEFT JOIN justificativa AS j2 ON r.justificativa_saida = j2.cod
                        LEFT JOIN justificativa AS j3 ON r.justificativa_intervalo = j3.cod
                        LEFT JOIN justificativa AS j4 ON r.justificativa_retorno = j4.cod
                        WHERE r.cod_usuario = ?  ${monthQuery ? ('AND' + monthQuery) : ''} ${yearQuery ? ('AND' + yearQuery) : ''}           
                        ORDER BY r.data DESC LIMIT 120`;
            execSQLQuery(res, query, [cod, year, month], false).then(function (query) {
                res.status(200).send(query.results);
            });
            console.log(query)
    });






    app.get('/usuarios/:cod/registros/:codRegistro', (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const codRegistro = sanitizeInt(req.params.codRegistro);
        const query =
            `SELECT r.cod, r.data, r.entrada, r.intervalo, r.retorno, r.saida, j1.descricao AS justificativa_entrada, j2.descricao AS justificativa_saida,
            j3.descricao AS justificativa_intervalo, j4.descricao AS justificativa_retorno FROM registro AS r
            LEFT JOIN justificativa AS j1 ON r.justificativa_entrada = j1.cod
            LEFT JOIN justificativa AS j2 ON r.justificativa_saida = j2.cod
            LEFT JOIN justificativa AS j3 ON r.justificativa_intervalo = j3.cod
            LEFT JOIN justificativa AS j4 ON r.justificativa_retorno = j4.cod
            WHERE r.cod_usuario = ? AND r.cod = ?`;
        execSQLQuery(res, query, [cod, codRegistro])
    });

    app.post('/usuarios/:cod/registros/data-script', (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        //const datetime = new Date();
        //2019-11-06T17:45:01.641Z
        const datetime = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss");

        findUser(req, res, global.userId).then(function (query) {
          
                execSQLQuery(res, 'SELECT * FROM registro WHERE DATE(data) = DATE(?) AND cod_usuario = ? ORDER BY data DESC LIMIT 1', [datetime, cod], false)
                    .then(function (query) {
                        if (query.results.length === 0) {
                            execSQLQuery(res, 'INSERT INTO registro (cod_usuario, data) VALUES (?, ?)', [cod, datetime], false)
                                .then(function (query) {
                                    execSQLQuery(res, 'SELECT * FROM registro WHERE cod = ?', [query.results.insertId]);
                                });
                        } else{res.status(401).send({
                            error: "Já existe um registro cadastrado para hoje, tente novamente!"
                        });
                    }
                    });
         

        });

    });
    app.post('/usuarios/:cod/registros/data-entrada', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const datetime = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss");
        //const datetime = new Date();
         //metodo para ignorar horario de verao (temporario)/////////
         //var data = new Date();                                    //
        // var ano = data.getFullYear();                             //
         //var mes = (data.getMonth() + 1);                          //
        // var dia = data.getDate();                                 //
        // var h = data.getHours();                                //
        // var m = data.getMinutes();                                // 
        // var s = data.getSeconds();                                //
        /// const datetime = ano+"-"+mes+"-"+dia+"T"+h+":"+m+":"+s    //
         //metodo para ignorar horario de verao (temporario)//////// 
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao == `"admin"` || query.results[0].cod == cod) {
                execSQLQuery(res, 'SELECT * FROM registro WHERE DATE(data) = DATE(?) AND cod_usuario = ? ORDER BY data DESC LIMIT 1', [datetime, cod], false)
                    .then(function (query) {
                        if (query.results.length === 0) {
                            execSQLQuery(res, 'INSERT INTO registro (cod_usuario, data) VALUES (?, ?)', [cod, datetime], false)
                                .then(function (query) {
                                    execSQLQuery(res, 'SELECT * FROM registro WHERE cod = ?', [query.results.insertId]);
                                });
                        } else{
                            //res.status(401).send({
                            //error: "Já existe um registro cadastrado para hoje, tente novamente!"
                            //});
                    }
                    });
            } else {
                res.status(401).send({
                    auth: false,
                    error: "Sem permissão!"
                });
                return;
            } //termino else

        });
    });
    app.post('/usuarios/:cod/registros/entrada', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        //const datetime = new Date(); 
        const datetime = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss");
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao == `"admin"` || query.results[0].cod == cod) {
                execSQLQuery(res, 'SELECT * FROM registro WHERE DATE(entrada) = DATE(?) AND cod_usuario = ? ORDER BY entrada DESC LIMIT 1', [datetime, cod], false)
                .then(function (query) {
                    if (query.results.length === 0) {
                        execSQLQuery(res, 'UPDATE registro SET entrada = ? WHERE cod_usuario = ? AND entrada IS NULL ORDER BY data DESC LIMIT 1', [datetime, cod], false)
                            .then(function (query) {
                                execSQLQuery(res, 'SELECT * FROM registro WHERE cod_usuario = ? ORDER BY data DESC LIMIT 1', [cod]);
                            });
                    } else {
                        res.status(401).send({
                            error: "Já existe um registro cadastrado para hoje, tente novamente!"
                        });

                    }
                });


              
                } else {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            }
        });
    });

    app.post('/usuarios/:cod/registros/intervalo', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const datetime = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss");
        //const datetime = new Date();
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao == `"admin"` || query.results[0].cod == cod) {

                execSQLQuery(res, 'SELECT * FROM registro WHERE DATE(intervalo) = DATE(?) AND cod_usuario = ? ORDER BY intervalo DESC LIMIT 1', [datetime, cod], false)
                .then(function (query) {
                    if (query.results.length === 0) {
                        execSQLQuery(res, 'UPDATE registro SET intervalo = ? WHERE cod_usuario = ? AND intervalo IS NULL ORDER BY data DESC LIMIT 1', [datetime, cod], false)
                            .then(function (query) {
                                execSQLQuery(res, 'SELECT * FROM registro WHERE cod_usuario = ? ORDER BY data DESC LIMIT 1', [cod]);
                            });
                    } else {
                        res.status(401).send({
                            error: "Já existe um registro cadastrado para hoje, tente novamente!"
                        });

                    }
                });


            } else {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            }
        });
    });

    app.post('/usuarios/:cod/registros/retorno', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const datetime = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss");
        //const datetime = new Date();
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao == `"admin"` || query.results[0].cod == cod) {


                execSQLQuery(res, 'SELECT * FROM registro WHERE DATE(retorno) = DATE(?) AND cod_usuario = ? ORDER BY retorno DESC LIMIT 1', [datetime, cod], false)
                .then(function (query) {
                    if (query.results.length === 0) {
                        execSQLQuery(res, 'UPDATE registro SET retorno = ? WHERE cod_usuario = ? AND retorno IS NULL ORDER BY data DESC LIMIT 1', [datetime, cod], false)
                            .then(function (query) {
                                execSQLQuery(res, 'SELECT * FROM registro WHERE cod_usuario = ? ORDER BY data DESC LIMIT 1', [cod]);
                            });
                    } else {
                        res.status(401).send({
                            error: "Já existe um registro cadastrado para hoje, tente novamente!"
                        });

                    }
                });

            } else {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            }
        });
    });

    app.post('/usuarios/:cod/registros/saida', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const datetime = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss");
        //const datetime = new Date();     
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao == `"admin"` || query.results[0].cod == cod) {

                execSQLQuery(res, 'SELECT * FROM registro WHERE DATE(saida) = DATE(?) AND cod_usuario = ? ORDER BY saida DESC LIMIT 1', [datetime, cod], false)
                .then(function (query) {
                    if (query.results.length === 0) {
                        execSQLQuery(res, 'UPDATE registro SET saida = ? WHERE cod_usuario = ? AND saida IS NULL ORDER BY data DESC LIMIT 1', [datetime, cod], false)
                            .then(function (query) {
                                execSQLQuery(res, 'SELECT * FROM registro WHERE cod_usuario = ? ORDER BY data DESC LIMIT 1', [cod]);
                            });
                    } else {
                        res.status(401).send({
                            error: "Já existe um registro cadastrado para hoje, tente novamente!"
                        });

                    }
                });

            } else {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            }
        });
    });

//possivel lugar onde posso mudar a opcao de invez de mostrar o texto da justificativa mostrar o horario
    app.post('/usuarios/:cod/registros/:codRegistro/justificativas/entrada', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const codRegistro = sanitizeInt(req.params.codRegistro);
        const datetime = req.body.datahora;
        const justificativa = req.body.justificativa;
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"` && query.results[0].permissao != `"rh"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'UPDATE registro SET entrada = ?, justificativa_entrada = ? WHERE cod = ?', [datetime, justificativa, codRegistro], false)
                    .then(function (_query) {
                        execSQLQuery(res, 'SELECT * FROM registro WHERE cod = ?', [codRegistro]);
                    });
            }
        });
    });

    app.post('/usuarios/:cod/registros/:codRegistro/justificativas/intervalo', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const codRegistro = sanitizeInt(req.params.codRegistro);
        const datetime = req.body.datahora;
        const justificativa = req.body.justificativa;
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"` && query.results[0].permissao != `"rh"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'UPDATE registro SET intervalo = ?, justificativa_intervalo = ? WHERE cod = ?', [datetime, justificativa, codRegistro], false)
                    .then(function (_query) {
                        execSQLQuery(res, 'SELECT * FROM registro WHERE cod = ?', [codRegistro]);
                    });
            }
        });
    });

    app.post('/usuarios/:cod/registros/:codRegistro/justificativas/retorno', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const codRegistro = sanitizeInt(req.params.codRegistro);
        const datetime = req.body.datahora;
        const justificativa = req.body.justificativa;
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"` && query.results[0].permissao != `"rh"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'UPDATE registro SET retorno = ?, justificativa_retorno = ? WHERE cod = ?', [datetime, justificativa, codRegistro], false)
                    .then(function (_query) {
                        execSQLQuery(res, 'SELECT * FROM registro WHERE cod = ?', [codRegistro]);
                    });
            }
        });
    });

    app.post('/usuarios/:cod/registros/:codRegistro/justificativas/saida', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const codRegistro = sanitizeInt(req.params.codRegistro);
        const datetime = req.body.datahora;
        const justificativa = req.body.justificativa;
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"` && query.results[0].permissao != `"rh"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'UPDATE registro SET saida = ?, justificativa_saida = ? WHERE cod = ?', [datetime, justificativa, codRegistro], false)
                    .then(function (_query) {
                        execSQLQuery(res, 'SELECT * FROM registro WHERE cod = ?', [codRegistro]);
                    });
            }
        });
    });

    app.delete('/usuarios/:cod/registros/:codRegistro', verifyToken, (req, res) => {
        const cod = sanitizeInt(req.params.cod);
        const codRegistro = sanitizeInt(req.params.codRegistro);
        findUser(req, res, global.userId).then(function (query) {
            if (query.results[0].permissao != `"admin"` && query.results[0].permissao != `"rh"`) {
                res.status(401).send({ auth: false, error: "Sem permissão!" });
                return;
            } else {
                execSQLQuery(res, 'DELETE FROM registro WHERE cod_usuario = ? AND cod = ?', [cod, codRegistro], false);
                res.status(200).send();
            }
        });
    });
}