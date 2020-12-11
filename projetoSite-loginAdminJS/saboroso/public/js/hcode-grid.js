//const { config } = require("../../inc/db");

class HcodeGrid {//classe é uma estrutura que descreve estados e comportamentos de um determinado objeto. No Javascript utilizamos uma função para criar a classe.

    constructor(configs){//construtor recebe os parametros=config

      configs.listeners = Object.assign({//dados evento clique do botão abaixo açoes ao clicar...sem precisar usar o modar como referencia
// beforeUpdateClick:(e)=>{//antes de clicar no evento botão editar.. esta criado mas nao ta chamando
   //    console.log('beforeUpdateClick');//teste ver se esta funcionando..
   //  },
   afterUpdateClick:(e)=>{//depois de clicar no evento botão
    // console.log('afterUpdateClick');//teste ver se esta funcionando..
     $('#modal-update').modal('show');//selecionar modal onde cria produto reserva//modal só vai aparecer assim q terminar o clique

   },
   afterDeleteClick:(e)=>{//depois de clicar no evento botão
    // console.log('afterUpdateClick');//teste ver se esta funcionando..
//     $('#modal-update').modal('show');//selecionar modal onde cria produto reserva//modal só vai aparecer assim q terminar o clique
window.location.reload();//fica no construtor como comportamento padrão, para gerar a atualização automatica do reserva quando

   }, 
   afterFormCreate: (e) => {//simplificar reload q repete para criar formulario...
   
    window.location.reload();//fica no construtor como comportamento padrão, para gerar a atualização automatica do reserva quando

   }, 
   afterFormUpdate: (e) => {//simplificar reload q repete... editar formulario
   
    window.location.reload();//fica no construtor como comportamento padrão, para gerar a atualização automatica do reserva quando

   }, 
   afterFormCreateError: e => {//aviso de alert de erro
  alert('não foi possivel enviar o formulario.');
}, 
afterFormUpdateError: e => {//aviso de alert de erro
alert('não foi possivel enviar o formulario.');
}
      }, configs.listeners);//acima apenas conteudo listeners

      this.options = Object.assign({}, {//Object.assign=cria um novo obj com base nos outros,,codigo padrão p nao repetir no reservations.ejs
  formCreate: '#modal-create form',//formulario criar reservas..
  formUpdate: '#modal-update form', //formulario editar
  btnUpdate: 'btn-update', //botão Editar, sem ponto .btn por causa do contains q [é metodo de classe no codigo
  btnDelete: 'btn-delete',//botão deletar..  
  onUpdateLoad: (form, name, data)=>{ //por padrão sera função q recebe esses parametros
    let input = form.querySelector(`[name=${name}]`);//procura dentro form formulario campo name...
    if (input) input.value = data[name];//ai ele defini o valor
  }
      }, configs);//configurações do construtor... 

      this.rows = [...document.querySelectorAll('table tbody tr')];//a tabela [spred converte em array]

this.initForms();//chamando os metodos forms e buttons
this.initButtons();

}//ao colocar no construtor o metodos acima ficam disponiveis para todos...
    initForms(){ //init dos formularios criar e editar abaixo..
        /*botão criar novo produto no admin abaixo:*/
        this.formCreate = document.querySelector(this.options.formCreate);//"#modal-create form" substitui this.options.formcreate=recebe dentro options formCreate para deixar de ser estatico ,,pega formulario de criar produto novo,,Retorna o primeiro elemento descendente do elemento em que a função foi invocada e que corresponde aos seletores especificado 'as vezes um css'.

        if (this.formCreate) {
        this.formCreate.save({
          success: () => {
            this.fireEvent('afterFormCreate');//acionar o evento q deixa salvo o reload da tabela dados da reserva..
        },
        failure: () => {
            this.fireEvent('afterFormCreateError');//retornar erro caso tenha 
        }
        });
      }
        //.then(json => {//retorna uma promessa esperando json..
        
      //    this.fireEvent('afterFormCreate');//acionar o evento q deixa salvo o reload da tabela dados da reserva..
    //      window.location.reload();//para gerar a atualização do reservas quando.. forma mais resumida....
        
        //}).catch(err=>{
      //    this.fireEvent('afterFormCreateError');//retornar erro caso tenha 
        //  console.log(err);
     //   });
        
        /*botão editar abaixo em js do reserva no admin do site*/
        this.formUpdate = document.querySelector(this.options.formUpdate);//"#modal-update form" substitui tbm,,pegar o formulario do reservas na class.. quando edita produto,, coloca o this para ficar disponivel ao metodo sem precisar colocar no construtor..
        
        if (this.formUpdate) {//se o update existe .. continua save abaixo..
        this.formUpdate.save({
            success: () => {
                this.fireEvent('afterFormUpdate');//acionar o evento..
            },
            failure: () => {
                this.fireEvent('afterFormUpdateError');//retornar erro caso tenha 
            }
           })//.then(json=>{//retorna uma promessa esperando json.. colocando this na linha de cima coloca nesta tbm
        
       //   this.fireEvent('afterFormUpdate');//acionar o evento..
      //  window.location.reload();//para gerar a atualização do reservations quando.. forma mais resumida....
        
      //  }).catch(err=>{
       //   this.fireEvent('afterFormeUpdateError');//retornar erro caso tenha 
  //      console.log(err);
      //  });
    }
  }
    fireEvent(name, args) {//simplificar antes e depois do evento.. metodo recebe nome e argumentos

     if(typeof this.options.listeners[name] === 'function') 
     this.options.listeners[name].apply(this, args);//typeof=verificar se é função e esta passando corretamente e chama função usando apply
    }

    getTrData(e){//criar função retornar tr Data remover rrepetiçoes no codigo..

      let tr = e.path.find(el => {//passa elemento procurando com path e abaixo retorna tr data..

        return(el.tagName.toUpperCase() === 'TR');//retornar um elemento toUpperCase=string  maiúscula == TR linha 40
       });
    
      return JSON.parse(tr.dataset.row); //pegar esses dados como objeto tr.. obj dentro dataset pegando apenas string..

    }

    btnUpdateClick(e) {//clique do update...
      this.fireEvent('beforeUpdateClick', [e]);  //[argumentos evento],chamar no click o  listeners e antes de clicar do arquivo reservations.ejs

      let data = this.getTrData(e);//passando evento getTrData pra funcionar
    
       for (let name in data) {//usar for para preencher informaçoes menu edição cardapio com switch   
        this.options.onUpdateLoad(this.formUpdate, name, data); //substituição dos dados em menu.ejs onde faz a conexão com form   
    }
    
    this.fireEvent('afterUpdateClick', [e]); //[argumentos evento],chamar no click o  listeners e antes de clicar do arquivo reservations.ejs
    }

    btnDeleteClick(e) {
      this.fireEvent('beforeDeleteClick');//antes de clicar

    let data = this.getTrData(e);//passando evento getTrData pra funcionar

 if(confirm(eval('`' + this.options.deleteMsg + '`'))){//se confirma a exclusão deste produto tem certeza?..passa eval e aspas=para passar templatString funcionar, conectado ao reservations ejs linha217
//`Deseja realmente excluir a reserva de ${data.name}?` substitui this.options.deleteMsg
 fetch(eval('`' + this.options.deleteUrl + '`'), {///admin/reservations/${data.id} substitui this.options.deleteUrl ,,Fetch fornece uma interface JavaScript para acessar e manipular partes do pipeline HTTP, tais como os pedidos e respostas.caminho url e id produto
   method:'DELETE'//metodo para deletar..
 })
 .then(response => response.json())//fazer um response em json..
 .then(json => {//outra promessa converter em json..

  this.fireEvent('afterDeleteClick');//depois de clicar
 });
}
    }

    initButtons(){//botoes abaixo editar e deletar..

      this.rows.forEach(row => {//passar linhas dos botoes resumir codigo repitido..
        [...row.querySelectorAll('.btn')].forEach(btn => {//cada uma das linhas procura todos os botoes dessa linha com querySelectorAll[converter com spred e faz forEach]
          btn.addEventListener('click', e => {//adicionando evento click
            if (e.target.classList.contains(this.options.btnUpdate)) {//se tem btnUpdate, contains=metodo de classe list
              this.btnUpdateClick(e);//ação do botão update

          } else if (e.target.classList.contains(this.options.btnDelete)) {//same delete...
              this.btnDeleteClick(e);

          } else {//se não encontrou nenhum de cima..
              this.fireEvent('buttonClick', [e.target, this.getTrData(e), e]);//[dados do botão pata identificar ele]
          }
          });
        });
    });
    }


    //[...document.querySelectorAll(this.options.btnUpdate)].forEach(btn => {//'.btn-update' substitui por this.options.btnUpdate,,botão de editar de admin,coloca em array para fazer forEach

//btn.addEventListener ('click', e =>{ //configurar o click do botão evento

 // this.fireEvent('beforeUpdateClick', [e]);  //[argumentos evento],chamar no click o  listeners e antes de clicar do arquivo reservations.ejs

//  let data = this.getTrData(e);//passando evento getTrData pra funcionar
//  let tr = e.path.find(el => {//passa elemento procurando com path e abaixo retorna tr data..

//    return(el.tagName.toUpperCase() === 'TR');//retornar um elemento toUpperCase=string  maiúscula == TR linha 40
 //  });

 // let data = JSON.parse(tr.dataset.row); //pegar esses dados como objeto tr.. obj dentro dataset pegando apenas string..
   //console.log(data); // ver se o botão obteve respoosta.. de tr data row do html do menu linha 40 apenas teste

  // for (let name in data) {//usar for para preencher informaçoes menu edição cardapio com switch

  //  this.options.onUpdateLoad(this.formUpdate, name, data); //substituição dos dados em menu.ejs onde faz a conexão com form
   // let input = this.formUpdate.querySelector(`[name=${name}]`);//formulario pegar name value dele tr e colocar input.. botão editar

   //  switch (name) {//file input tratado desta maneira..

   //   case 'date'://case para campo de datas
 //     if(input) input.value = moment(data[name]).format('YYYY-MM-DD');//se achou algo input com data name e formatado e tbm moment api..
    //  console.log(moment(data[name]).format('YYYY-MM-DD'));//ver como a data esta vindo teste..
  //    break;
  //    case 'photo'://se for foto file...
  //    this.formUpdate.querySelector("img").src = '/' + data[name];//no menu cardapio pegar img e colocar no case da img... ao clicar no editar e em escolher outra imagem, troca de imagens..
 //   break;
 //      default://se não..
 //      if(input) input.value = data[name];//verificação se achou algo input..
 //    }
//}

//modal só vai aparecer assim q terminar o clique
//$('#modal-update').modal('show');//selecionar modal onde cria produto menu
//this.fireEvent('afterUpdateClick', [e]);  //[argumentos evento],chamar no click o  listeners e antes de clicar do arquivo reservations.ejs
//this.options.listeners.afterUpdateClick(e)  //chamar no click o  listeners e depois de clicar do arquivo reservations.ejs

// });
//}//);

/*botão para deletar click abaixo..*/
//[...document.querySelectorAll(this.options.btnDelete)].forEach(btn=>{
 // btn.addEventListener ('click', e =>{
    
  //  this.fireEvent('beforeDeleteClick');//antes de clicar

  //  let data = this.getTrData(e);//passando evento getTrData pra funcionar

  //   let tr = e.path.find(el => {//passa elemento procurando com path..

 //return(el.tagName.toUpperCase() === 'TR');//retornar um elemento toUpperCase=string  maiúscula == TR linha 40
 //});

 //let data = JSON.parse(tr.dataset.row); //pegar esses dados como objeto tr.. obj dentro dataset pegando apenas string..
 //console.log(data.id); // mostra o id ao clicar em deletar no produto...
 //if(confirm(eval('`' + this.options.deleteMsg + '`'))){//se confirma a exclusão deste produto tem certeza?..passa eval e aspas=para passar templatString funcionar, conectado ao reservations ejs linha217
//`Deseja realmente excluir a reserva de ${data.name}?` substitui this.options.deleteMsg
 //fetch(eval('`' + this.options.deleteUrl + '`'), {///admin/reservations/${data.id} substitui this.options.deleteUrl ,,Fetch fornece uma interface JavaScript para acessar e manipular partes do pipeline HTTP, tais como os pedidos e respostas.caminho url e id produto
 //  method:'DELETE',//metodo para deletar..
// })
 //.then(response => response.json())//fazer um response em json..
 //.then(json => {//outra promessa converter em json..

 // this.fireEvent('afterDeleteClick');//depois de clicar
//   window.location.reload();//para gerar a atualização automatica do reserva quando
// });
//}
 //});

// });
 //   }
}