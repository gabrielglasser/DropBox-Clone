class DropBoxController {
  constructor() {
    //evento click botao enviar arquivos
    this.btnSendFilesEl = document.querySelector('#btn-send-file');
    this.inputFilesEl = document.querySelector('#files');
    //mostrando a statusbar
    this.snackModalEl = document.querySelector('#react-snackbar-root');
    //criando a barra de progresso
    this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
    //criando barra de nome e tempo
    this.nameFileEl = this.snackModalEl.querySelector('.filename');
    this.timeLeftEl = this.snackModalEl.querySelector('.timeleft');

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

      this.modalShow();

      //limpando o input
      this.inputFilesEl.value = "";
    });
  };

  //metodo para mostrar o modal
  modalShow(show = true) {
    this.snackModalEl.style.display = (show) ? 'block' : 'none';
  };

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
          this.modalShow(false);

          try {
            resolve(JSON.parse(ajax.responseText));
          } catch (error) {
            reject(error);
          }
        };

        ajax.onerror = event => {
          this.modalShow(false);
          reject(event);
        };

        //configurando o progresso do upload
        ajax.upload.onprogress = event => {
          this.uploadProgress(event, file);
        };

        //criando o formdata para enviar o arquivo
        let formData = new FormData();
        formData.append('input-file', file);
        //guarda o inicio do upload
        this.startUploadTime = Date.now();
        //enviando o arquivo
        ajax.send(formData);

      }));


    });
    return Promise.all(promises);
  }
  //criando o evento de progresso do upload
  uploadProgress(event, file) {
    //Criando a regra de tres porcent
    let loaded = event.loaded;
    let total = event.total;
    let porcent = parseInt((loaded / total) * 100);

    //tempo gasto
    let timespent = Date.now() - this.startUploadTime;

    //tempo restante
    let timeleft = ((100 - porcent) * timespent) / porcent;
    console.log(`Progress: ${porcent}% - File: ${file.name} - Time Left: ${this.formatTimeLeft(timeleft)}`);

    //atualizando a barra de progresso css
    this.progressBarEl.style.width = `${porcent}%`;

    //atualizando o nome do arquivo
    this.nameFileEl.innerHTML = file.name;

    //atualizando o tempo restante
    this.timeLeftEl.innerHTML = this.formatTimeLeft(timeleft);
  }

  //funcao para formatar o tempo restante
  formatTimeLeft(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    //verificacaoes

    if (hours > 0) {
      return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
    } else if (minutes > 0) {
      return `${minutes} minutos e ${seconds} segundos`;
    } else {
      return `${seconds} segundos`;
    }
    return "";

  }

}