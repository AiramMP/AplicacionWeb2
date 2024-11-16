var express = require('express');
var router = express.Router();
const path = require('path');//para saber el path actual
const moment=require('moment');
const multer = require("multer");
const multerFactory = multer({storage: multer.memoryStorage()});

router.get('/', function(request, response){
    const dao = request.daoUsuarios;
    dao.cogerEventos(function(err, datos){
        if(err){
            response.status(500);
            response.render('error',{
                config:request.session.config,
                foto:request.session.foto,
                nombre:request.session.nombre,
                usuario:request.session.usuario,
                rol: request.session.rol,
                error:"No se pudo cargar los eventos de la universidad"
            })
        }else{
            response.render('eventos', {eventos:datos,
                config:request.session.config,
                foto:request.session.foto,
                nombre:request.session.nombre,
                usuario:request.session.usuario,
                rol: request.session.rol,
            });
        }
    })
})

module.exports = router;