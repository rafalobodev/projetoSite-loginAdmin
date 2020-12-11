let conn = require('./db');//require db arquivo

class Pagination {//classe,,, paginação para organizar se tiver muitos dados no banco de dados de reservas e emails... 

    constructor(query, params = [], itensPerPage = 10) {//construtor é um método especial para criar e inicializar um objeto criado a partir de uma classe.

        this.query = query;
        this.params = params;
        this.itensPerPage = itensPerPage;//itens por cada pagina.. exemplo 10 itens reservas por pagina...
        this.currentPage = 1;
    }

    /**
     * @param {*} page Número da página a ser retornado.
     * @returns Uma Promise de uma página com os requisitos especificados no constructor.
     */
    getPage(page) {
        
        // Nota: no banco o índice das pages começa em 0.
        this.currentPage = page - 1;//então -1 para começar pelo primeiro

        this.params.push(//fazer push nos parametros..
            this.currentPage * this.itensPerPage,//passando this é definido lexicalmente, isto é, seu valor é definido pelo contexto de execução onde está inserido
            this.itensPerPage
        );

        return new Promise((resolve, reject) => {//getPage retorna nova promisse

            conn.query([this.query, 'SELECT FOUND_ROWS() AS FOUND_ROWS'].join(';'), this.params, (err, results) => {//executar query mysql,,[query q mandou executar this.query,query fixa, ],join=alinhar array e string

                if (err) {
                    reject(err);
                } else {
                    
                    this.data = results[0];//posição 0 q é primeiro select
                    this.total = results[1][0].FOUND_ROWS;//total de registro sera results na posição 1, 0=found rows
                    this.totalPages = Math.ceil(this.total / this.itensPerPage);//numero de paginas, math.ceil=numero inteiro valor pra cima (total banco ddados/itens por pagina)
                    this.currentPage++;//colocando +1 para voltar para o numero normal

                    resolve(this.data);//dados resultado atual sai na tela
                }
            });
        });
    }

    getTotal() {//metodo pra pegar o total..
        return this.total;//retornando total
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getTotalPages() {
        return this.totalPages;//retorna numero total de paginas
    }

    getNavigation(params) {//para criar seta no reservations de esquerda e direita

        let limitPagesNav = 5;//variavel 5 registros por pagina
        let links = []; //array de links
        let nrstart = 0;//variaveis inicio
        let nrend = 0;

        if (this.getTotalPages() < limitPagesNav) {//se o total de paginas for menor q o limite q sera '5'...
            limitPagesNav = this.getTotalPages();//então numero paginas atual sera o total em si.
        }

        // Se está nas prmieiras páginas
        if ((this.getCurrentPage() - parseInt(limitPagesNav / 2)) < 1) {//se sequencias pagina q estou - limites de pagina da navegação divide por 2 mantem em inteiro=parseInt e emnor q 1
            nrstart = 1;// quer dizer esta nas primeiras paginas
            nrend = limitPagesNav;//end sera limite de paginas..
        }
        // chegando nas últimas páginas
        else if ((this.getCurrentPage() + parseInt(limitPagesNav / 2)) > this.getTotalPages()) {//se não for maior q total de paginas sign.. chegando nas ultimas pg
            nrstart = this.getTotalPages() - limitPagesNav; //total paginas - limite q tem
            nrend = this.getTotalPages(); //final pages = total pages
        }
        // no meio da navegação
        else {//logica para se manter sempre no meio das opçoes de 1 a 5...
            nrstart = this.getCurrentPage() - parseInt(limitPagesNav / 2);
            nrend = this.getCurrentPage() + parseInt(limitPagesNav / 2);
        }

        // botão "registros anteriores"
        if (this.getCurrentPage() > 1) {//se pagina q estou for maior q 1
            links.push({// faz push...
                text: '<', //em texto seta anterior
                href: '?' + this.getQueryString(Object.assign({}, params, {//link sera ? msm, + bloco de manter parametros atuais
                    page: this.getCurrentPage() - 1 //pagina sera atual -1
                }))
            });
        }

        for (let x = nrstart; x <= nrend; x++) {//tornar dinamico

            links.push({
                text: x,
                href: '?' + this.getQueryString(Object.assign({}, params, {page: x})),//adicionar page,, add params atuais com os novos
                active: (x === this.getCurrentPage())//x igual current..
            });
        }

        // botão "regsitros posteriores"
        if (this.getCurrentPage() < this.getTotalPages()) {
            links.push({
                text: '>',
                href: '?' + this.getQueryString(Object.assign({}, params, {
                    page: this.getCurrentPage() + 1 //proxima pagina +1
                }))
            });
        }

        return links;//retornar link
    }

    getQueryString(params) { //para pegar todos parametros da url

        let queryString = [];//em array para ir adicionando

        for (let name in params) {
            queryString.push(`${name}=${params[name]}`);
        }

        return queryString.join('&');//final retornar queryString com todos itens array com &
    }
}

module.exports = Pagination;//exportação paginations
