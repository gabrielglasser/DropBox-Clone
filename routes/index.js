var express = require('express');
var router = express.Router();
var formidable = require('formidable')
var fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/file', (req, res) => {

  let path = req.query.path;

  if (fs.existsSync(path)) {

    fs.readFile(path, (err, data) => {

      if (err) {
        res.status(400).json({
          err
        })
      } else {
        res.status(200).end(data);
      }

    })

  }else {
    res.status(400).json({
      err: 'Arquivo não encontrado'
    })
  }

})

router.delete('/file', (req, res) => {
  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  })

  form.parse(req, (err, fields, files) => {

    let path = fields.path;

    if (fs.existsSync(path)) {
      fs.unlink(path, err => {
        if (err) {
          res.status(400).json({
            err
          })
        } else {
          res.json({
            fields
          })
        }
      })
    }

    
  })
  res.json({ message: 'Arquivo deletado com sucesso' });})

router.post('/upload', (req, res) => {

  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  })

  form.parse(req, (err, fields, files) => {
    res.json({
      files
    })
  })

})

module.exports = router;
