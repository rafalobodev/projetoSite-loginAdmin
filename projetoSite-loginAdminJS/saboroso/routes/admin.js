var express = require("express");//require express e router padrão... gerencia as rotas e middlewares
var users = require("./../inc/users");//users.js onde tem os dados de admin e render....
var admin = require('./../inc/admin');//require admin
var menus = require("./../inc/menus");//require de menus da pasta inc..
var reservations = require("./../inc/reservations");//require para funcionar delete e post do reservations...
var contacts = require('./../inc/contacts');
var emails = require('./../inc/emails');//require.. emails q iram receber informaçoes sobre o site sempre q quiser com o dono
var moment = require("moment");//instalado como modulo pode ser chamado diretamente
var router = express.Router();// para poder criar as rotas abaixo

//module.exports = function(io){//sobre io apaga linha 251 module.exports = router;

moment.locale("pt-BR");//coloca api moment para brasileiro...
/** Middleware para verificação de login */
router.use(function(req, res, next){//para criar o midleware

    if (['/login'].indexOf(req.url) == -1 && !req.session.user) { //se não existir.. não for o login e rotas url, indexOf() compara o elementoDePesquisa com os elementos do Array usando igualdade estrita (o mesmo método usado pelo ===, &&
             res.redirect('/admin/login');//redireciona para admin/login
         } else {
             next();//senão passa para proximo..
         }

//    console.log("Middleware: ", req.url)//testando se funciona com console passando string e url sendo interceptadas pelo terminal midleware + url

 //   next();// proxima função ou midleware
});// indexOf

/** Middleware para menus de navegação do admin */
router.use(function(req, res, next){ //passar menu para todas as rotas da administração usando middlewares

    req.menus = admin.getMenus(req);//chamar o get menus de admin.js pasta inc linha54

    next();//proxima rota ou midleware
});

router.get("/logout", function(req, res, next){//criando rota get botão de sair de admin.. pasta admin arq index.ejs linha 66

   delete req.session.user; //deleta a session user

   res.redirect("/admin/login");//redireciona manda o usuario direto para tela de login
});

router.get("/", function(req, res, next){// apenas / url principal

   // if (!req.session.user) { //se não existir..
   //     res.redirect("/admin/login")//redireciona para admin/login
   // } else{//se não caso exista...
   admin.dashboard().then(data => {//dashboard de admin.js da pasta inc linha 8 recebe promise para data

        res.render("admin/index", admin.getParams(req, { data }));//data recebe o retorno da promise linha 10 admin.js inc..dentro da pasta views a pasta admin index.ejs
   // menus: req.menus, //para forEach em header.ejs pasta admin inc funcionar.. para os links deixarem de ser estaticos
  //  user: req.session.user//passar o user q esta na sessão
   //     });//objeto passado não necessario... forma mais pratica na linha 40...
}).catch(err => {//faz catch para receber erro se der...
    console.error(err);//avisa no console...
});
});

/**rota Dashboard (apenas para consulta do socket.io) */
router.get('/dashboard', function(req, res, next) {

    reservations.dashboard().then(data => {//dados mysql dentro de reservations.js na pasta inc
        res.send(data);
    });
});

/** Login */
    router.post("/login", function(req, res, next){//criando metodo post...,,,encapsulada junto ao corpo da requisição HTTP e não pode ser vista. ... A mesma coisa não é possível para requisições POST

        if (!req.body.email) {//se a pessoa não chamou o email..
            users.render(req, res, "Preencha o campo e-mail."); //gera um aviso no login
        } else if (!req.body.password) {//se não tiver passado a senha...
            users.render(req, res, "Preencha o campo senha.");
        } else {

            users.login(req.body.email, req.body.password).then(user =>{ //se não.. recebido com sucesso email password..then pq promise user usuario dados arrowFunction..
           
                req.session.user = user;//colocar na sessão recebendo user
                res.redirect("/admin"); //redirecionando para url /admin pois deu certo na linha 20

            }).catch(err => {//tratando erro padrão.. quando não é o que foi digitado 
                
                users.render(req, res, err.message || err);//erro mensagem ou apenas erro

            });

        }
        
    });

router.get("/login", function(req, res, next){// apenas / url http://localhost:3000/admin/login ,,,Uma requisição GET é enviada como string anexada a URL

  //  if (!req.session.views) req.session.views=0; //se não existir o req session views chave chamada views sera valor 0
    //    console.log("Session:",req.session.views++);//aumentado numero desta variavel apenas para testar
    
   // res.render("admin/login");//dentro da pasta views a pasta admin login.ejs
   users.render(req, res, null);//conecta users no get

 
});

router.get("/contacts", function(req, res, next){// apenas / url http://localhost:3000/admin/contacts
    contacts.getContacts().then(data => {//variavel contatos p listar os contatos.. promisse dados
    res.render("admin/contacts", admin.getParams(req, { data }));////objeto passado forma pratica.. passa obj mescla data
})
});

router.delete('/contacts/:id', function(req, res, next) {//para deletar um email rota..

    contacts.delete(req.params.id).then(results => {
        res.send(results);
        io.emit('dashboard update');//atualiza o io no contatos e nos outros...
    }).catch(err => {
        res.send(err);
    });
});

router.get("/emails", function(req, res, next){// conectando todas as urls 

    emails.getEmails().then(data => {//conecta emails.js pasta inc chama promisse
    res.render("admin/emails", admin.getParams(req, { data }));//dentro da pasta views a pasta admin emails.ejs, data=dados
        
});
});

router.delete('/emails/:id', function(req, res, next) {

    emails.delete(req.params.id).then(results => {
        res.send(results);
        io.emit('dashboard update');
    }).catch(err => {
        res.send(err);
    });
});


router.get("/menus", function(req, res, next){// apenas / url 

    menus.getMenus().then(data => {//chama getMenus a promise resolve, data dos dados..    

    res.render("admin/menus", admin.getParams(req, {//dentro da pasta views a pasta admin menus.ejs
    data })); //dados para renderizar da tabela mysql de menu cardapio
});
});

router.post("/menus", function(req, res, next){//criando rota post para menus.. a ver com menu.ejs dentro pasta admin..

//res.send(req.files);// dados ficam aqui no fields ou files teste do menus cardapios no admin
menus.save(req.fields, req.files).then(results=>{ //fixando salvar dados menu admin

    res.send(results);//send enviar p tela tudo ok..

    }).catch(err=>{
        res.send(err);//caso der erro envia p tela..
});
});

 router.delete("/menus/:id", function(req, res, next){//coloca a rota para delete do menus na admin do site.. receber id menus via url ao inves de via get ou post

     menus.delete(req.params.id).then(results=>{//chama menus delete.recebe promessa com results da pasta inc arq menus.js linha 97/ //req.params=receber o id..
         res.send(results);//envia mensagem acerto 200
     }).catch(err=>{//erro

         res.send(err);// erro 404
     })
 });
/** Reservations: msm padrão q menu e outros */
router.get("/reservations", function(req, res, next){// apenas / url 

    let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');//start vem com ano mês dia, moment data de hj,subtract subtrair 1 ano, format formatação ano mes dia
        let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');//end seria o de agora..

    reservations.getReservations(req).then(pag => {//reserva retorna promessa com os dados
        
        res.render("admin/reservations", admin.getParams(req, {
            date: {start, end},//filtros q a variavel ja esta no template.. coloca let start e end da datas apenas digitando
            data: pag.data, //variavel data dia mês.. pag dados
            moment, //passa proprio moment faz parse das datas das reservas
            links: pag.links //retornar paginação link
        }));
});
});//dentro da pasta views a pasta admin reservations.ejs

router.get('/reservations/chart', function(req, res, next) {//criando rota chart da reserva

    req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');//formatar data de inicio e final do grafico linha
    req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');//sobreescreve req.start e reqEnd passado

    reservations.chart(req).then(dataChart => {//passando req e retornando promessa
        res.send(dataChart);// data chart
    });
});

router.post('/reservations', function(req, res, next) {

    reservations.save(req.fields, req.files).then(results => {
        res.send(results);
        io.emit('dashboard update');
    }).catch(err => {
        res.send(err);
    });
});

router.delete('/reservations/:id', function(req, res, next) {

    reservations.delete(req.params.id).then(results => {//botão de deletar a rota..
        res.send(results);
        io.emit('dashboard update');
    }).catch(err => {
        res.send(err);
    });
});

router.get("/users", function(req, res, next){// apenas / url 

    users.getUsers().then(data => {
    res.render("admin/users", admin.getParams(req, { data }));//dentro da pasta views a pasta admin users.ejs,,passar o user q esta na sessão,,data=dados
});
});

router.post('/users', function(req, res, next) {//post do users
        
    users.save(req.fields).then(results => {//resultados do banco de dados..
        res.send(results);//resultado sai na tela
        io.emit('dashboard update');
    }).catch(err => {//erro
        res.send(err);
    });
});

// user-password
router.post('/users/password-change', function(req, res, next) {//caminho do action post em user.ejs

    users.changePassword(req).then(results => {//req p validar no outro arquivo user.js inc
        res.send(results);
    }).catch(err => {
        res.send({ error: err });
    });
});

router.delete('/users/:id', function(req, res, next) {//delete users recebe id para remover..

    users.delete(req.params.id).then(results => {//id usuario q sera deletado..
        res.send(results);
        io.emit('dashboard update');
    }).catch(err => {
        res.send(err);
    });
});

module.exports = router;//faz a exportação para arquivo principal app.js.. require linha 8 de app.js e usa linha 23

//    return router; //do io apaga linha 251
//};