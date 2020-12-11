const conn = require('./db');//conexão banco de dados mysql

module.exports = {//exporta email..

    /**
     * @return Emails ordenados por nome.
     */
    getEmails() {

        return new Promise((resolve, reject) => {//retorna promessa

            conn.query(`
                SELECT * FROM tb_emails ORDER BY email
            `, (err, results) => {//tabela acima..

                if (err) {//se deu certo ou não tabela..
                    reject(err);
                } else {
            
                    resolve(results);
                }
            });
        });
    },

    /**
     * @param {*} req Requisição com os campos a serem inseridos no banco.
     * @returns Promise com resultado do insert. 
     */
    save(req) {//salvar requisição

        return new Promise((resolve, reject) => {//retorna nova promessa

            if (!req.fields.email) {//se não colocar email

                reject({ error: 'Para se inscrever é preciso preencher o e-mail.' });//aviso..
            } else {//se não..
                                
                conn.query(`
                    INSERT INTO tb_emails (email) VALUES (?)
                `, [
                    req.fields.email
                ], (err, results) => {//enviado para tabela mysql..
    
                    if (err) {//erro ou resultados..
                        reject(err.message);
                    } else {
                        resolve(results);
                    }
                });
            }

        });
    },

    /**
     * @param {*} id Id do registro que será deletado.
     * @returns Registro deletado.
     */
    delete(id) {//delete recebe id
        
        return new Promise((resolve, reject) => {

            conn.query(`
                DELETE FROM tb_emails WHERE id = ?
            `, [ id ], (err, results) => {//comando delete tabela mysql emails

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
};