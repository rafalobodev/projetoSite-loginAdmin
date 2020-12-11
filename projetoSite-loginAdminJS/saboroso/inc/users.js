var conn = require("./db"); //require chamar conn conexão do arquivo db mysql2

module.exports = {//exportar abaixo o login.. backend de login

    render(req, res, error) { //renderização dos dados..

        res.render("admin/login", {//dentro da pasta views a pasta admin index.ejs e nas routes admin.js
            body: req.body, //para manter o email preenchido caso tenha gerado um erro
            error //mensagem de error
        });
    },

    login(email, password){//metodo login passando email e senha..

        return new Promise((resolve, reject) =>{//retornar uma promessa..
        
        conn.query(`
        SELECT * FROM tb_users WHERE email = ?`, [
            email
        ], (err, results)=>{//caso erre ou de certo results

            if (err){//se der erro..
            reject(err);//manda err.mensagem de admin.js linha 25
            } else {//se não..
                if(!results.length > 0 ){//não tiver uma quantidade maior email e senha array se não for maior que 0 ou seja tudo preenchido
                    reject( "Usuario ou senha incorretos");//aviso de erro de senha e email
                } else {//se não...
                    
                    let row = results[0]; //linhas arrays valida a senha primeira linha 0

                    if (row.password !== password) { //se linha senha for diferente da da senha correta
                        reject("Usuario ou senha incorretos");//aviso de erro..
                    } else {//se não..
                        resolve(row);//row=linha dados do usuario senha q foi identificado e validado.
                    }
                }
            }
        });
    });
},

 /**
     * @return Usuários ordenados por nome.
     */
    getUsers() {//parecido como esta menus.js da pasta inc

        return new Promise((resolve, reject) => {

            conn.query("SELECT * FROM tb_users ORDER BY name", (err, results) => {//tabela users mysql

                if (err) {
                    reject(err);
                } else {
            
                    resolve(results);
                }
            });
        });
    },

    /**
     * @param {*} fields Campos do fomulário.
     * @param {*} files Aquivos enviados.
     * @returns Registro salvo no banco de dados.
     */
    save(fields, files) {

        return new Promise((resolve, reject) => {

            let query, params = [//parametros especificos do usuario
                fields.name,
                fields.email
            ];

            if (fields.id > 0) {//se tiver o id..
                // neste caso, será um update
                params.push(fields.id);//acrescenta o id

                query = `
                    UPDATE tb_users
                    SET name = ?,
                        email = ?
                    WHERE id = ?
                `;//dados mysql..
            } else {
                // neste caso, será um insert
                query = `
                    INSERT INTO tb_users (name, email, password)
                    VALUES (?, ?, ?)
                `;

                params.push(fields.password);//adiciona a senha nos parametros..
            }

            conn.query(query , params, (err, results) => {

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
    delete(id) {//deletar o usuario..
        
        return new Promise((resolve, reject) => {

            conn.query(`
                DELETE FROM tb_users WHERE id = ?
            `, [ id ], (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    /**
     * @param {*} req Requisição http.
     * @returns Alteração de senha.
     */
    changePassword(req) {//recebe req requisição http admin.js

        return new Promise((resolve, reject) => {//promise fazer mudança da senha..

            if (!req.fields.password) {//se não digitar password nova senha
                reject('Preencha a senha.');//reject e aviso..
            } else if (req.fields.password !== req.fields.passwordConfirm) {//se for diferente da senha...
                reject('Confirme a senha corretamente.');//repetir senha corretamente
            } else {//se não alterando a senha..

                conn.query(`
                    UPDATE tb_users
                    SET password = ?
                    WHERE id = ?
                `, [
                    req.fields.password,
                    req.fields.id
                ], (err, results) => {//passa senha e id conn conecta mysql
                    if (err) {
                        reject(err.message);//erro por string
                    } else {
                        resolve(results);//ou serultado a connexão senha
                    }
                });
            }
        });
    }
};