/**
 * Atribui um método save ao protótipo de todos os formulários do documento.
 * - Envia os dados do formulário via AJAX para o url especificado no action do form. ou seja, atualiza a pagina menus sem precisar carregar com json edição ou novo produto a colocar
 * 
 * @param config Objeto com configuração de success e failure.
 * - ex.:
```
{ 
    success: () => { faça algo... }, 
    failure: err => { console.log(err); }
}
```
 */
HTMLFormElement.prototype.save = function(config) {//HTMLFormElement ´´e o proto dele..,, recebe as config configurações

    let form = this; //form é o this..
    
return new Promise((resolve, reject) => {//return da promise..
    form.addEventListener('submit', e => {//passa o evento form
        e.preventDefault();//cancela o comportamento padrão..
        // obtendo o formulário como um objeto
        let formData = new FormData(form);//pega os dados com formData..
    
        fetch(form.action, {//coloca url no action da tag..
            method: form.method,//msm para post troca para form.method
            body: formData//passa os dados..
        })
            .then(response => response.json())//responde promises...
            .then(json => {

               if (json.error) {//se json for erro
                    if (typeof config.failure === 'function') config.failure(json.error);//caso erre
                } else {
                    if (typeof config.success === 'function') config.success(json);//caso seja um sucesso salva e fecha a tabela tipo mudar a senha..
                }
            }).catch(err => {//caso de erro..
            Reject(err);    //if (typeof config.failure === 'function') config.failure(err);   //colocar apenas reject ja funciona erro linha 32 junto
            });
    });
});
}