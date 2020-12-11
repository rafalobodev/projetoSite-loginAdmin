const conn = require('./db');//importar db dentro pasta inc q possui mysql2...

module.exports = {// objetos serão exportados abaixo...

    /**
     * @returns Contagem de registros das tabelas tb_contacts, tb_menus, tb_reservations e tb_users.
     */
    dashboard() {//metodo=é uma função invocada por um objeto.,,painel de controle

        return new Promise((resolve, reject) => {//retorna uma promise metodo dashboard
//query abaixo..select count mostra a contagem de registros que tem em cada tabela gerando colunas no mysql ou consulta de quanto tem cada no site admin..
            conn.query(`
                SELECT 
                    (SELECT
                        COUNT(*)
                        FROM tb_contacts) AS nrcontacts,
                    (SELECT
                        COUNT(*)
                        FROM tb_menus) AS nrmenus,
                    (SELECT
                        COUNT(*)
                        FROM tb_reservations) AS nrreservations,
                    (SELECT
                        COUNT(*)
                        FROM tb_users) AS nrusers;
            `, (err, results) => {//arrowFunction com parametros err e results

                if (err) {// se der erro
                    reject(err);//chama reject passaando erro
                } else {//se não..
                    resolve(results[0]);//sai o resultado passando uma linha posição 0
                }
            });
        });
    },

    /**
     * @req Requisição.
     * @params Parâmetros.
     * @returns Novo objeto criado.
     */
    getParams(req, params) {// req e outros parametros

        return Object.assign({}, {//object,assign=para juntar os dois objetos linha42
            menus: req.menus,//passa menus e abaixo user..
            user: req.session.user
        }, params);//junta params parametros.. lado direito prevalece sobre o lado esquerdo..
    },

    /**
     * @req Requisição.
     * @returns Lista de menus.
     */
    getMenus(req) {//objeto.. recebe req..

        let menus = [//retornara arrays com variavel menus..
            {
                text: 'Tela Inicial',
                href: '/admin/',//vai para /admin.. link url principal
                icon: 'home', //icone home class home do arquivo header.ejs da pasta admin, inc
                active: false
            },

            {
                text: 'Menu',//texto..
                href: '/admin/menus',//link pra onde vai menu..
                icon: 'cutlery',//icone
                active: false //se esta ativo..
            },

            {
                text: 'Reservas',
                href: '/admin/reservations',
                icon: 'calendar-check-o',
                active: false
            },

            {
                text: 'Contatos',
                href: '/admin/contacts',
                icon: 'comments',
                active: false
            },

            {
                text: 'Usuários',
                href: '/admin/users',
                icon: 'users',
                active: false
            },

            {
                text: 'E-mails',
                href: '/admin/emails',
                icon: 'envelope',
                active: false
            }
        ];

        menus.map(menu => { //map() invoca a função callback passada por argumento para cada elemento do Array e devolve um novo Array como resultado
            if (menu.href === `/admin${req.url}`) menu.active = true;//se link menu === url admin o menu.active true
            //console.log(req.url, menu.href);//verificando testando apenas..
        });

        return menus;//retorno do menu
    }
}