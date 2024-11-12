var express = require('express');
var router = express.Router();
//const { sumar, restar, multiplicar, dividir } = require('../public/javascripts/calculo.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Portal de Gestión de Eventos Universitarios' });
});



module.exports = router;
