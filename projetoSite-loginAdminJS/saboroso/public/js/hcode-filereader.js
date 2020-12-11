/** usando a api file reader
 * Faz o preview de uma imagem que foi carregada por input "file"
 * especificado para um elemento img especificado.,, resumindo para aparecer a imagem ao clicar em novo produto do menu a ser feito p/ colocar no site
 */
class HcodeFilereader {

    /**
     * @param { String } inputElement Id do input file. 
     * @param { String } imgElement  Id do elemento img onde será mostrada a imagem.
     */
    constructor(inputElement, imgElement) {//metodo construtor.. cria dois elementos
        
        this.inputEl = inputElement;
        this.imgEl = imgElement;

        this.initInputEvent();
    }

    initInputEvent() {//criar metodo q adiciona evento ao input..
        
        document.querySelector(this.inputEl).addEventListener('change', e => {//seleciona input e adiciona evento change
            
            this.reader(e.target.files[0]).then(result => {

                document.querySelector(this.imgEl).src = result;//seletor  imgEl.. src = result linha 23..
            }).catch(err => {
                console.error(err);
            });
        });
    }

    reader(file) {

        return new Promise((resolve, reject) => {//promise padrão rever acertos e erros

            let reader = new FileReader();

            reader.onload = function() {//caso reader for sucesso..
                resolve(reader.result);//se deu certo..
            }

            reader.onerror = function() {
                reject('Não foi possível ler a imagem.');//se deu erro..
            }

            reader.readAsDataURL(file);//no caso ler o file..
        });
    }
}
