const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'spdpu',
    timezone: 'utc'
});

module.exports = {
    execSQLQuery: function (res, query, params = [], showResults = true) {
        return new Promise(function (resolve, reject) {
            connection.query(query, params, function (error, results, fields) {
                if (error) {
                    resolve({ results: null, fields: null, error: error.sqlMessage });
                }
                if (results === undefined) {
                    resolve({ results: null, fields: null, error: "Nenhum dado foi retornado!" });
                } else if (showResults) {
                    results.length === 1 ? res.json(results[0]) : res.json(results);
                } else {
                    resolve({ results: results, fields: fields });
                }
            });
        })
    }
}

