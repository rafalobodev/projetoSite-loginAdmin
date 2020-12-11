// get the client
const mysql = require('mysql2');//mysql sendo importado.. fazendo a conexão do node com mysql

// create the connection to database,, de mysql2 pego no site npmjs.com e feito no terminal: npm install mysql2 --save
const connection = mysql.createConnection({//dados do banco de dados geral..
    host: 'localhost',
    user: 'user',//nome usuario user msm
    database: 'saboroso',//nome banco de dados
    password: 'password',//senha bd
    multipleStatements: true //para habilitar poder mandar varias querys q quiser no coo.query...
  });

module.exports = connection;//precisa retorna a conexão com o arquivo q fez require do banco de dados db, com obj de conexão connection linha 5
