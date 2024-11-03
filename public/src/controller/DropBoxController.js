class DropBoxController {
  constructor() {
    //evento click botao enviar arquivos
    this.btnSendFilesEl = document.querySelector('#btn-send-file');
    this.inputFilesEl = document.querySelector('#files');
    //mostrando a statusbar
    this.snackModalEl = document.querySelector('#react-snackbar-root');

    this.initEvents();
  }

  initEvents() {
    //criando o envento de click no botão enviar arquivos
    this.btnSendFilesEl.addEventListener('click', event => {
      //forcando o click
      this.inputFilesEl.click();
    });
    //configurando o change do input de arquivos
    this.inputFilesEl.addEventListener('change', event => {
      //recebendo os arquivos
      this.uploadTask(event.target.files)

      this.snackModalEl.style.display = 'block';
    });
  }

  //metodo para receber os arquivos
  uploadTask(files) {
    let promises = [];

    //convertendo em array
    [...files].forEach(file => {
      promises.push(new Promise((resolve, reject) => {
        let ajax = new XMLHttpRequest();
        //abrindo a conexão via post
        ajax.open('POST', '/upload');

        ajax.onload = event => {
          try {
            resolve(JSON.parse(ajax.responseText));
          } catch (error) {
            reject(error);
          }
        };

        ajax.onerror = event => {
          reject(event);
        };

        //criando o formdata para enviar o arquivo
        let formData = new FormData();
        formData.append('input-file', file);
        //enviando o arquivo
        ajax.send(formData);

      }));


    });
    return Promise.all(promises);
  }
}