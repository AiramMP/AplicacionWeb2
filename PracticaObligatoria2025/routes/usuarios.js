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
                foto:request.session.foto,
                nombre:request.session.nombre,
                usuario:request.session.usuario,
                rol: request.session.rol,
                error:"No se pudo cargar los eventos de la universidad"
            })
        }else{
            console.log("Importante");
            console.log(request.session);
            response.render('eventos', {eventos:datos,
                foto:request.session.foto,
                nombre:request.session.nombre,
                usuario:request.session.usuario,
                rol: request.session.rol,
            });
        }
    });
});

router.get('/miperfil', function(request, response){
    const dao = request.daoUsuarios;
    dao.miPerfil(request.session.usuario, function(err, datos){
        if(err){
            response.status(500);
            response.render('error',{
                foto:request.session.foto,
                nombre:request.session.nombre,
                usuario:request.session.usuario,
                rol: request.session.rol,
                error:"No se pudo cargar el perfil del usuario"
            })
        }else{
            response.render('miperfil',{misdatos:datos,
                foto:request.session.foto,
                nombre:request.session.nombre,
                usuario:request.session.usuario,
                rol: request.session.rol,
            });
        }
    });
});

router.post('/cambiarFoto', multerFactory.single('foto'), function(request, response) {
    const dao= request.daoUsuarios;
    const file =request.file;
    dao.cambiarFoto(request.session.usuario,file.buffer, function(err){
      if(err){
        response.status(500);
        response.render('error',{
            foto:request.session.foto,
            nombre:request.session.nombre,
            usuario:request.session.usuario,
            rol: request.session.rol,
          error:"No se pudo cambiar la foto de perfil del usuario"
        })
      }else{
        request.session.foto=file.buffer;
        response.redirect("/usuarios/miperfil");
      }
    });
  });

module.exports = router;