var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const redis = require('redis'); //versão nova ruim demais.......
var session = require('express-session');//conecta express-session OBS: não vem com express nativo msm
var RedisStore = require('connect-redis')(session);//conecta redis passando construtor session
//let redisClient = redis.createClient();//codigo da versão nova lixo!
var formidable = require('formidable');//require formidable..
//var http = require('http');//require do http para o socket.io funcionar no projeto
//var socket = require('socket.io');//require do proprio socket tbm
var path = require('path');//passar caminho para upload do formidable linha 29

//var connectRedis = require('connect-redis');//connect redis mesmo q na linha 7
//var ResdisStore = connectRedis(session);//passando session como linha 7

var indexRouter = require('./routes/index');//conectado a index.js, e indexRouter configurado linha 22
var adminRouter = require('./routes/admin');//conecta admin dentro da pasta routes,,conect users.js não esta sendo usado

var app = express();

//http = http.Server(app);// colocar acima app express
//let io = socket(http);

//io.on('connection', function(socket) { //quando tiver uma nova conexão no socket
//  console.log('Novo usuário conectado.');    
//});



// middleware para o formidable
app.use(function(req, res, next) {

  //req.body = {};//remove de oculto caso queira usar io por causa da versão anterior do node
  let contentType = req.headers["content-type"];//corrigindo bug no login ao configurar o menu..

  if (req.method === 'POST'/* && contentType.indexOf('multipart/form-data;') > -1*/) {//se metodo requisiçao = post,, comentar contentType pois paro de rodar por algum motivo..

      var form = formidable.IncomingForm({//configuraçoes formulario..
          uploadDir: path.join(__dirname, "/public/images"),//diretorio de upload.. path linha 11 da join pasta em node e pasta será usada imagens
          keepExtensions: true //manter extenção ou para não gerar um arquivo sem extenção definida...
      });
  
      form.parse(req, function (err, fields, files) {//erro, field=campos de string, files=arquivos de upload
         
          req.body = fields; //recriar req.body com campos q ja criou
          req.fields = fields;//requisição campos recebe campos..
          req.files = files;
  
          next();//proximo..
      });
  } else {//se não for um post.. p não travar
      next();//vai p proximo..
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//configurar o Middleware abaixo com metodo use: software de computador que fornece serviços para softwares aplicativos além daqueles disponíveis pelo sistema operacional
app.use(session({//com isso a sessão tem que funcionar
  store: new RedisStore({ //client: redisClient,//configurar conexão
  host: 'localhost', //localhost do proprio computador
  port:6379 //porta padrão do redis
}),
  secret:'password', //senha para criptografar a informação
  resave:true,//força se sessão expirar recria uma nova e salva
  saveUninitialized:true //não usou a sesão ainda mas quer deixar salva no banco
}));

app.use(logger('dev'));//express faz Middleware logger..
app.use(express.json());//teste de saida de dados do metodo post,, rodando em http com socket.io remove esta linha
//app.use(express.urlencoded({ extended: false }));//saida de dados do metodo post q express decodifica.. não mais necessario
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);//indexRouter é configurado aqui apartir do / conectado tbm admin.js na pasta routers linha 5
app.use('/admin', adminRouter);// o /users onde tem dados mysql2 substitui por admin onde ira administra os dados 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//http.listen(3000, function() {//fazendo um http na porta 3000
//  console.log('Servidor em execução na porta 3000...');
//});

module.exports = app; //rodando em http com socket.io remove esta linha



//OBS: rodando em http com socket.io remove linha 100 module.exports = app; & 72 app.use(express.json());

//OBS: linhas 18 e 19 indexrouter e admin router ficam abaixo do io.on('connec na linha 30
//var indexRouter = require('./routes/index')(io);//passa io e linha 30,conectado a index.js, e indexRouter configurado linha 22
//var adminRouter = require('./routes/admin')(io);//conecta admin dentro 