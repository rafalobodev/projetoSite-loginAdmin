var conn = require("./db"); //chama a conexão com o banco de dados mysql

module.exports = {//o mesmo que no reservation.js... exportar obj renderizavel, conectar mysql, e salvar no banco de dados...

    render(req, res, error, sucess){//metodo render.. renderizar res e req abaixo

        res.render('contact', {//procurando dentro da pasta view o contact
            title: 'Contato - Restaurante Saboroso',//é preciso ter o title titulo de cada url para funcionar
            background: 'images/img_bg_3.jpg', //background referencia imagem 3 mulher no telefone em contacts
            h1: 'Diga um oi!',
            body:req.body,// dados do body req.body
             error, //mensagem de erro
             sucess //quando cadastro for um sucesso
          });
    },

    save(fields){

        return new Promise((resolve, reject)=>{

            conn.query(`
            INSERT INTO tb_contacts (name, email, message)
            VALUES(?, ?, ? )
        `,[
            fields.name,
            fields.email,
            fields.message,//primeira query string e segunda [array], terceiro erros e resultados dessa conexão usando arrowFunction
        ],(err, results)=>{//arrowFunction de erro e results

            if(err) {//se der erro
            reject(err);
        } else {//se não
        
        resolve(results);//resolveu saindo results resultado
    }
        });
    });
    },
    getContacts() {

        return new Promise((resolve, reject) => {

            conn.query("SELECT * FROM tb_contacts ORDER BY register DESC", (err, results) => {//DESC=para pegar os mais recentes

                if (err) {
                    reject(err);
                } else {
            
                    resolve(results);
                }
            });
        });
    },

    /**
     * @param {*} id Id do registro que será deletado.
     * @returns Registro deletado.
     */
    delete(id) {
        
        return new Promise((resolve, reject) => {

            conn.query(`
                DELETE FROM tb_contacts WHERE id = ?
            `, [ id ], (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
};