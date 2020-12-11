var conn = require("./db"); //chama a conexão com o banco de dados mysql
var Pagination = require("./../inc/Pagination");//conectar pagination a rota admin
var moment = require('moment');//precisa do moment para traçar o mês

module.exports = {//exportando um objeto..   

    render(req, res, error, sucess){//metodo render.. renderizar res e req abaixo

        res.render('reservation', {//arquivo,, do site e não admin essa parte..
             title: 'reservas - Restaurante Saboroso',//titulo
             background: 'images/img_bg_2.jpg', //foto de mesa reservada nome brinde
             h1: 'Reserve uma Mesa!',
             body:req.body,// dados do body req.body
             error, //mensagem de erro
             sucess //quando cadastro for um sucesso
           });
    },

    save(fields){//metodo para salvar o dados campos do reservation reservar mesa no banco de dados.. precisando chamar mysql com conn connect

        return new Promise((resolve, reject)=>{//save precisa estar dentro de uma promise ou promesa

            if (fields.date.indexOf('/') > -1){//verificar se tem a data se for maior q -1 quer dizer q achou
            
                // invertendo a data recebida para o padrão do banco de dados mysql: ano/mês/dia
                let date = fields.date.split('/');//split() divide um objeto String em um array de strings ao separar a string em substrings.        
           fields.date =`${date[2]}-${date[1]}-${date[0]}`;//na data cadastro ano ta na posição 2, dia0, mes[1],,template string com comando deve abrir${}proximo comando traço'-' 
            }

           let query, params = [
            fields.name,
            fields.email,
            fields.people,//primeira query string e segunda [array], terceiro erros e resultados dessa conexão usando arrowFunction
            fields.date,
            fields.time
           ]; //variaveis,  parametros id
           if (parseInt(fields.id) > 0){//se for maior q 0 o id sera update..
           
            query = `
            UPDATE tb_reservations
            SET
                    name = ?,
                    email = ?,
                    people = ?,
                    date = ?,
                    time = ?
                    WHERE id = ?
                    `;

params.push(fields.id); //adiciona outro parametro ao entrar if

        } else { //se não sera um insert..

            query =` INSERT INTO tb_reservations (name, email, people, date, time)
            VALUES(?, ?, ?, ?, ?)`
            ;
        }
            conn.query(query, params /*` //coloca params no lugar dos fields...
            INSERT INTO tb_reservations (name, email, people, date, time)
            VALUES(?, ?, ?, ?, ?)
        `*/ /*[
            fields.name,
            fields.email,
            fields.people,//primeira query string e segunda [array], terceiro erros e resultados dessa conexão usando arrowFunction
            fields.date,
            fields.time,
        ]*/,(err, results)=>{//arrowFunction de erro e results

            if(err) {//se der erro
            reject(err);
        } else {//se não
        
        resolve(results);//resolveu saindo results resultado
    }
        });//variavel conn, metodo query.. salvar na tabela do mysql tb_reservations o dado das pessoas,,values valores dados
        });
    }, 
    getReservations(req) { //pega a reserva,, acrescenta paginação page,, chamado no admin.js pasta router

        return new Promise((resolve, reject) => {//promise com resolve q vai carregar o assincrono ou reject q vai dar erro apenas na parte assincrona especifica

            
            let page = req.query.page;//page recebera req.page
            let dtstart = req.query.start;
            let dtend = req.query.end;

            if (!page) page = 1;//se não tiver pagina sig quero pagina 1
    
            let params = [];//parametros = array vazio
    
            if (dtstart && dtend) params.push(dtstart, dtend);//se tiver (dtstart && dtend) add parametros
    
            let pag = new Pagination(`
                SELECT SQL_CALC_FOUND_ROWS * 
                FROM tb_reservations 
                ${ (dtstart && dtend) ? 'WHERE date BETWEEN ? and ?' : ''}
                ORDER BY name LIMIT ?, ?
            `, params);//instancia pagination,,(dtstart && dtend)=se existirem 
    
            pag.getPage(page).then(data => {// retorna promessa com getPage passando numero da pagina q quer, e retorna os dados

                resolve({ //resolve com dados data, links
                    data, 
                    links: pag.getNavigation(req.query) 
                });
             });
        });
    },

           // conn.query(//conn.query para fazer conexão nodejs com mysql2 NO CASO ESPECIFICAMENTE DO MENU DA TABELA USANDO TEMPLATE STRING e title como referencia
          //      `SELECT * FROM tb_reservations ORDER BY date DESC`,//referencia date desc revervas mais atuais..select feito no banco de dados
          //      (err, results)=>{//arrow function de erro e resultados..
                
          //        if(err){//se der erro joga no console apenas..
          //           reject(err);//reject q vai dar erro apenas na parte assincrona especifica
         //         } else{
          //       resolve(results);//resolve q vai carregar o assincrono
               
          //      }
          //      });
          //      });
         //   },
            delete(id) {//metodo botão deletar um produto do reservas no admin
        
                return new Promise((resolve, reject) => {//promise..
       
                    conn.query(`
                        DELETE FROM tb_reservations WHERE id = ?
                    `, [ id ], (err, results) => {//comando delete q esta no mysql..
       
                        if (err) {//se erro
                            reject(err);
                        } else {//se não delete funcionou..
                            resolve(results);
                        }
                    });
                });
            },

            
            /**
     * Nota: Utilizado para a geração de gráficos no index da área admin.
     * @param {*} req Requisição.
     * @returns Listagem de registros em um determinado período, agrupada por ano e mês
     * e ordenada por ano e mês de forma decrescente.
     */
    chart(req) {//novo metodo chart geração de gráficos

        return new Promise((resolve, reject) => {//retornar nova promessa

            conn.query(`
                SELECT
                    CONCAT(YEAR(date), '-', MONTH(date)) AS date,
                    COUNT(*) AS total,
                    SUM(people) / COUNT(*) AS avg_people
                FROM tb_reservations
                WHERE
                    date BETWEEN ? AND ?
                GROUP BY YEAR(date), MONTH(date)
                ORDER BY YEAR(date) DESC, MONTH(date) DESC;
            `, [
                req.query.start,//valores das interrogaçoes? between and
                req.query.end
            ], (err, results) => {

                if (err) {
                    reject(err);
                } else {

                    let months = [];//array meses 
                    let values = [];//array com valores

                    results.forEach(row => {//passar as linhas do forEach
                        months.push(moment(row.date).format('MMM YYYY'));//usando moment marcar mês e ano
                        values.push(row.total);//puxar total valores
                    });

                    resolve({
                        months,
                        values
                    });
                }
            });
        });
    },

    /**
     * @returns Contagem de registros nas tabelas:
     * - tb_contacts
     * - tb_menus
     * - tb_reservations
     * - tb_users
     */
    dashboard() {

        return new Promise((resolve, reject) => {

            conn.query(`
                SELECT
                    (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                    (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                    (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                    (SELECT COUNT(*) FROM tb_users) AS nrusers;
            `, (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);//retorna resultas na linha 1
                }
            });
        });
    }
};