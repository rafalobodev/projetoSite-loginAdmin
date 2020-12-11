let conn = require('./db'); //faz require da conexão banco de dados mysql q esta arquivo db.js
let path = require('path');//caminho das pastas para fotos...

module.exports = {//exportar menu..
    getMenus(){ //pega o menu

        return new Promise((resolve, reject) => {//promise com resolve q vai carregar o assincrono ou reject q vai dar erro apenas na parte assincrona especifica

            conn.query(//conn.query para fazer conexão nodejs com mysql2 NO CASO ESPECIFICAMENTE DO MENU DA TABELA USANDO TEMPLATE STRING e title como referencia
                `SELECT * FROM tb_menus ORDER BY title`,//referencia menu pelo title..select feito no banco de dados
                (err, results)=>{//arrow function de erro e resultados..
                
                  if(err){//se der erro joga no console apenas..
                     reject(err);//reject q vai dar erro apenas na parte assincrona especifica
                  } else{
                 resolve(results);//resolve q vai carregar o assincrono
               
                }
                });
                });
            },
                save(fields, files){//para salvar os dados do menus potos e campos digitados no admin p site...

                    return new Promise((resolve, reject) => {//retorna promesa para save para ver erros e soluçoes

                        fields.photo = `images/${path.parse(files.photo.path).base}`;//fields nome na foto iguala files.photos,parse=todo o caminho para foto, pegar só base name da photo do cardapio para aparecer no site e admin

                        let query, queryPhoto = '', params= [ 
                            fields.title,
                            fields.description,
                            fields.price
                         
                        ]; //variaveis.. query=coloca tabelas mysql.. filtrar as informações da edição acima...
                       
                        if (files.photo.name) {//se for enviado foto..
                            queryPhoto = ',photo = ?';//cria uma variavel query..  ${queryPhoto} .. para não ser obrigatorio a substituição da foto..

                            params.push(fields.photo);//fazer push params da foto necessario..
                        }
                       
                        if (parseInt(fields.id) > 0) {//se fields ter id no caso maior q 0 faz update editar.. para quando clicar no editar e salvar no menu não criar um novo cardapio e sim manter msm cardapio ou seja id...

                            params.push(fields.id);//se cair no if.. coloca push id..
                            query = `
                                UPDATE tb_menus
                                SET title = ?, 
                                description = ?, 
                                price = ?
                                ${queryPhoto}
                                WHERE id = ?
                            `;
                            // params = [ 
                            //     fields.title,
                            //     fields.description,
                            //     fields.price,
                            //     fields.photo,
                            //     fields.id
                            // ];
                            
                        } else {//se não eu to fazendo insert ou criando cardapio novo
                           if(!files.photo.name){//se não enviar.. no insert criar obrigar q tenha passado foto msm...
                           reject('envie a foto do prato.');//aviso..
                    }
                            query = `
                            INSERT INTO tb_menus (title, description, price, photo)
                     VALUES(?, ?, ?, ?)
                            `;
                        //     params = [
                        //   fields.title, 
                        //   fields.description, //não necessario pq ja foi criado array na linha 44 para baixo..
                        //   fields.price, 
                        //   fields.photo
                        //     ];
                        }
                     /*conn.query(query, params,/*conecta parametros com conn q vai arq db.js onde tem conexão com mysql */ /*`
                     INSERT INTO tb_menus (title, description, price, photo)
                     VALUES(?, ?, ?, ?)
                     `, [
                          fields.title, 
                          fields.description, 
                          fields.price, 
                          fields.photo
                     ], */conn.query(query, params,(err, results)=>{

                        if(err) {//se der erro..
                            reject(err);
                        }else {//se não id é esse..
                            resolve(results);
                        }
                     });   
                    
            });//array.. conexão query inserir no banco de dados.. pasta imagem.nomedaimagem 1.jpg..

                
        },
        
         delete(id) {//botão deletar um produto do menu cardapio no admin
        
             return new Promise((resolve, reject) => {//promise..
    
                 conn.query(`
                     DELETE FROM tb_menus WHERE id = ?
                 `, [ id ], (err, results) => {//comando delete q esta no mysql..
    
                     if (err) {//se erro
                         reject(err);
                     } else {//se não delete funcionou..
                         resolve(results);
                     }
                 });
             });
         }

    };//tudo acima dentro da rota principal sobre titulo


//Promise:retorna algo assincrono ou q leva mais tempo pra carregar para oq estiver ao redor sincrono continuar mesmo o assincrono levar um tempo e nao dar erro na hora