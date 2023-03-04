const jwt = require('jsonwebtoken');

require('dotenv-safe').load({
    path: __dirname + '/.env',
    sample: __dirname + '/.env.example'
});

module.exports = {
    verifyToken: function (req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token)
            return res.status(401).send({ auth: false, error: 'Token não enviado.' });

        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err)
                return res.status(500).send({ auth: false, error: 'Falha ao autenticar token.' });
               
            global.userId = decoded.id;
            next();
        });
    }
}