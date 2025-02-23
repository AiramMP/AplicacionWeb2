var express = require('express');
var router = express.Router();
const DAOSesiones = require('../DAOSesiones');

router.get('/', function(req, res, next) {
  res.render('pagInicio', { title: 'Portal de Gestión de Eventos Universitarios' });
});

router.get('/existeUsuario',function(request,response){
  const dao=request.daoSesiones;

  dao.ExisteUsuario(request.query.correos,function(err,data){
    if(err){
      response.status(500);
    }
    else{
      response.json(data);
    }
  })
});

router.post('/comprobarpassword', function (req, res) {
  const dao = req.daoSesiones;

  dao.comprobarpassword(req.body.correos, req.body.passwords, function (err, data) {
      if (err) {
          console.error("Error en DAO:", err);
          res.status(500).send("Error interno del servidor");
      } else if (!data) {
          res.status(400).send("Credenciales inválidas");
      } else {
          const user = data[0];
          req.session.userId = user.id;
          req.session.usuario = user.correo;
          req.session.foto = user.foto;
          req.session.nombre = user.nombre;
          req.session.rol = user.rol;

          res.json(user);
      }
  });
});





router.post('/signin', function(request, response) {
  const dao = request.daoSesiones;

  dao.anyadirUsuario(
    request.body.nombre,
    request.body.correo,
    request.body.tlf,
    request.body.facultad,
    request.body.rol,
    request.body.password,
    function(err, userId) {
      if (err) {
        console.error("Error al añadir usuario:", err);
        response.status(500).render('error', {
          error: "No se pudo registrar el usuario",
          message: "Error al registrar usuario"
        });
      } else {
        request.session.usuario = request.body.correo;
        request.session.nombre = request.body.nombre;
        request.session.rol = request.body.rol;
        request.session.userId = userId;
        request.session.foto = null;

        request.session.save((err) => {
          if (err) {
            console.error("Error al guardar la sesión:", err);
            response.status(500).render('error', {
              error: "No se pudo guardar la sesión",
              message: "Error en el sistema de sesiones"
            });
          } else {
            response.redirect('/usuarios/');
          }
        });
      }
    }
  );
});

router.post('/login', function(request, response) {
  request.session.usuario = request.body.correo;

  request.session.save((err) => {
      if (err) {
          return response.status(500).send("Error al guardar la sesión.");
      }
      response.redirect('/usuarios/');
  });
});

router.get('/logout',function(request,response){
  request.session.destroy();
  response.redirect('/');
});

module.exports = router;
