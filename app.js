const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const moment = require('moment');


const app = express();

global.userId = 0;
app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('site'));
app.use('/css', express.static('site/css'));
app.use('/images', express.static('site/images'));
app.use('/img', express.static('site/img'));
app.use('/js', express.static('site/js'));
app.use('/vendor', express.static('site/vendor'));



//importa rotas
require('./routes/login')(app);
require('./routes/cargos')(app);
require('./routes/justificativas')(app);
require('./routes/permissoes')(app);
require('./routes/usuarios')(app);
require('./routes/registros')(app);

app.get('/', function(req, res){
    res.sendfile('./site/Login.html')
})
//inicia o servidor na porta 80
app.listen(80, 'localhost');








