var conn = require('./../inc/db'); //importar a connexão do mysql2    /*conectado a app.js linha 7 */
var express = require('express');
var menus = require('./../inc/menus');//faz orequire demenus ,,sobe uma pasta, desce para inc
var reservations = require('./../inc/reservations');//faz require de reservations inclue
var contacts = require('./../inc/contacts');//faz require de contact inclue
var emails = require('./../inc/emails');//require..
//const contacts = require('./../inc/contacts');
var router = express.Router();

//module.exports = function(io){//sobre io apaga linha 149 module.exports = router;

/* GET home page. */
router.get('/', function(req, res, next) {//rota principal get / onde fica url principal do site ou seja a index
//dentro rota get principal..chama getmenus,,then() retorna uma Promise,,
menus.getMenus().then(results =>{//e retorna results do menu dados q precisamos
  res.render('index', { //renderizando index ou mescla os dados com o html gerando codigo final.. titulo, menus e site principal
    title: 'Restaurante Saboroso', //variavel title é acessada em index.ejx exemplo linha 7 pasta viewss
    menus: results, //variavel results de arrow function fica no menu mandado para render
    isHome: true //da true isHome q é dados header-index no arquivo pager-header para arquivo index.ejs
});
});

//conn.query(//conn.query para fazer conexão nodejs com mysql2 NO CASO ESPECIFICAMENTE DO MENU DA TABELA USANDO TEMPLATE STRING e title como referencia
//`SELECT * FROM tb_menus ORDER BY title`,//referencia menu pelo title..select feito no banco de dados
//(err, results)=>{//arrow function de erro e resultados..

//  if(err){//se der erro joga no console apenas..
//     console.log(err);
//  }

//  res.render('index', { //renderizando index ou mescla os dados com o html gerando codigo final.. titulo, menus e site principal
//    title: 'Restaurante Saboroso', //variavel title é acessada em index.ejx exemplo linha 7 pasta viewss
//    menus: results //variavel results de arrow function fica no menu mandado para render
//});
//});/*não é necessario mais o render colocado em linha 10 e conn colocado arquivo menus.js pasta inc */
});//tudo acima dentro da rota principal sobre titulo
 
router.get('/contacts', function(req, res, next){//rota da url de contatos,recebendo requisição ,response e next de proximo

  contacts.render(req, res);

 /* res.render('contact', {//procurando dentro da pasta view o contact
  title: 'Contato - Restaurante Saboroso',//é preciso ter o title titulo de cada url para funcionar
  background: 'images/img_bg_3.jpg', //background referencia imagem 3 mulher no telefone em contacts
  h1: 'Diga um oi!'
});*/
});

router.post('/contacts', function(req, res, next){//rota do post de contatos,recebendo requisição ,response e next de proximo
 

  if(!req.body.name){//validaçoes,, se !=não existe name
    contacts.render(req, res, "Digite o nome"); //mensagem de erro pasta inc pasta content arq reservation.ejs linha 6
  
  } else if (!req.body.email) {//...
    contacts.render(req, res, "Digite o e-mail");//forma automatizada de manda erro em tempo real
  
  } else if (!req.body.message) {
    contacts.render(req, res, "Selecione a mensagem");//string de aviso de que faltou selecionar numero de pessoas...
   
  } else {// se não deu tudo certo e vai para base de dados abaixo...
//req.body=corpo dos dados q enviou para requisição saindo body parse json e urlencoded...
    contacts.save(req.body).then(results => {//para salvar os cadastros,,recebendo os fields da pasta inc em reservations.js,then por causa da promisse

      req.body = {}//deixa o cadastro vazio sem os dados ali pois foi um sucesso
    
//io.emit('dashboard.update');

      contacts.render(req, res, null, "contato realizado com sucesso!")//nul pois sem string de avido de erros, "sucesso no envio salno no banco de dados"

    }).catch(err=>{//caso tenha algum erro
      contacts.render(req, res, err.message);//aviso de erro mensagem string
    })
  }

});

router.get('/menus', function(req, res, next){//o mesmo para os outros e abaixo...

  menus.getMenus().then(results => {//pegando dados do menu com promise chamada pelo then msm do index ou /
    res.render('menu', {//renderizando menu
      title: 'menu - Restaurante Saboroso',
      background: 'images/img_bg_1.jpg', //foto da mesa msm do site principal
      h1: 'Saboreie nosso menu!',
      menus: results//retorno results dados do menus no site...
    });
  });
});

router.get('/reservations', function(req, res, next){//url

  reservations.render(req, res); //posiciona reservations dentro da pasta inc...

//  res.render('reservation', {//arquivo
//  title: 'reservas - Restaurante Saboroso',//titulo
//  background: 'images/img_bg_2.jpg', //foto de mesa reservada nome brinde
//  h1: 'Reserve uma Mesa!'
//});
});

router.post('/reservations', function(req, res, next){//url

  if(!req.body.name){//validaçoes,, se !=não existe name
    reservations.render(req, res, "Digite o nome"); //mensagem de erro pasta inc pasta content arq reservation.ejs linha 6
  //  res.send("Digite o nome");//o corre um aviso para digitar o nome
  } else if (!req.body.email) {//...
    reservations.render(req, res, "Digite o e-mail");//forma automatizada de manda erro em tempo real
  //  res.send("Digite o email");//aviso email..
  } else if (!req.body.people) {
    reservations.render(req, res, "Selecione o numero de pessoas");//string de aviso de que faltou selecionar numero de pessoas...
  //  res.send("Selecione o numero de pessoas");
  } else if (!req.body.date) {//obs:organizar para apenas a data atual e não anterior
    reservations.render(req, res, "Selecione a data");
  //  res.send("Selecione a data");
  } else if (!req.body.time) {//obs:organizar para tempo 30 minutos minimo a frente
    reservations.render(req, res, "Selecione o horario");
   // res.send("Selecione o horario");
  } else {// se não deu tudo certo e vai para base de dados abaixo...
    //res.send(req.body);//testa para ver se esta enviando os dados em json, req.body=corpo dos dados q enviou para requisição saindo body parse json e urlencoded de app.js linha 17 e 18
    reservations.save(req.body).then(results => {//para salvar os cadastros,,recebendo os fields da pasta inc em reservations.js,then por causa da promisse

      req.body = {}//deixa o cadastro vazio sem os dados ali pois foi um sucesso

//io.emit('dashboard.update');

      reservations.render(req, res, null, "Reserva realizada com sucesso!")//nul pois sem string de avido de erros, "sucesso no envio salno no banco de dados"

    }).catch(err=>{//caso tenha algum erro
      reservations.render(req, res, err.message);//aviso de erro mensagem string
    })
  }
});

router.get('/services', function(req, res, next){

  res.render('service', {
  title: 'service - Restaurante Saboroso',
  background: 'images/img_bg_1.jpg', // mesa mesma do site principal
  h1: 'É um prazer poder servir!'
});
});

 /** Subscribe */
 router.post('/subscribe', function(req, res, next) {//rota na area publica

  emails.save(req).then(results => {   //resultado ou erro         
      res.send(results);
  }).catch(err => {
      res.send(err);
  });
});

module.exports = router;//exportação das rotas...


//    return router; //do io apaga linha 149
//};