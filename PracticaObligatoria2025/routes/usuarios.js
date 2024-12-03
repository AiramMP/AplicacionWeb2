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
                idUsuario: request.session.userId,
                rol: request.session.rol,
                configuracionAccesibilidad: request.session.configuracionAccesibilidad || {},
                error:"No se pudo cargar los eventos de la universidad"
            })
        }else{
            console.log("Importante");
            console.log(request.session);
            response.render('eventos', {eventos:datos,
                foto:request.session.foto,
                configuracionAccesibilidad: request.session.configuracionAccesibilidad || {},
                nombre:request.session.nombre,
                usuario:request.session.usuario,
                idUsuario: request.session.userId,
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
                configuracionAccesibilidad: request.session.configuracionAccesibilidad || {},
                error:"No se pudo cargar el perfil del usuario"
            })
        }else{
            response.render('miperfil',{misdatos:datos,
                foto:request.session.foto,
                nombre:request.session.nombre,
                usuario:request.session.usuario,
                rol: request.session.rol,
                configuracionAccesibilidad: request.session.configuracionAccesibilidad || {},
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
            configuracionAccesibilidad: request.session.configuracionAccesibilidad || {},
          error:"No se pudo cambiar la foto de perfil del usuario"
        })
      }else{
        request.session.foto=file.buffer;
        response.redirect("/usuarios/miperfil");
      }
    });
});

router.get('/misInscripciones', function (request, response) {
    const dao = request.daoUsuarios;
    dao.misIncripciones(request.session.usuario, function (err, datos) {
        if (err) {
            response.status(500);
            response.render('error', {
                foto: request.session.foto,
                nombre: request.session.nombre,
                usuario: request.session.usuario,
                rol: request.session.rol,
                configuracionAccesibilidad: request.session.configuracionAccesibilidad || {},
                error: "No se pudo cargar las inscripciones del usuario"
            });
        } else {
            response.render('misInscripciones', {
                inscripciones: datos, // Cambiado para reflejar los datos correctos
                foto: request.session.foto,
                nombre: request.session.nombre,
                usuario: request.session.usuario,
                rol: request.session.rol,
                configuracionAccesibilidad: request.session.configuracionAccesibilidad || {},
            });
        }
    });
});

router.get('/eventos', function (request, response) {
    const dao = request.daoUsuarios;

    // Extraer filtros del query string
    const { fechaInicio, tipo, ubicacion, capacidad } = request.query;

    // Crear un objeto con los filtros
    const filtros = {
        fechaInicio: fechaInicio || null,
        tipo: tipo || null,
        ubicacion: ubicacion || null,
        capacidad: capacidad || null,
    };

    // Pasar los filtros al DAO
    dao.cogerEventosConFiltros(filtros, function (err, datos) {
        if (err) {
            console.error("Error al obtener eventos con filtros:", err);
            response.status(500).render('error', {
                foto: request.session.foto,
                nombre: request.session.nombre,
                usuario: request.session.usuario,
                idUsuario: request.session.userId,
                rol: request.session.rol,
                configuracionAccesibilidad: request.session.configuracionAccesibilidad || {},
                error: "No se pudo cargar los eventos.",
            });
        } else {
            response.render('eventos', {
                eventos: datos,
                foto: request.session.foto,
                configuracionAccesibilidad: request.session.configuracionAccesibilidad || {},
                nombre: request.session.nombre,
                usuario: request.session.usuario,
                idUsuario: request.session.userId,
                rol: request.session.rol,
            });
        }
    });
});



module.exports = router;