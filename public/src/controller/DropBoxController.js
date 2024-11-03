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
      this.snackModalEl.style.display = 'block';
    });
  }
}