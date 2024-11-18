var express = require('express');
var router = express.Router();
const DAOSesiones = require('../DAOSesiones');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pagInicio', { title: 'Portal de Gestión de Eventos Universitarios' });
});

router.get('/existeUsuario',function(request,response){//Petición AJAX
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

router.post('/comprobarpassword', function (request, response) {
  console.log("Datos recibidos:", request.body); // Ahora se usa `request.body`
  const dao = request.daoSesiones;
  dao.comprobarpassword(request.body.correos, request.body.passwords, function (err, data) {
      if (err) {
          console.error("Error en DAO:", err);
          response.status(500).send("Error interno del servidor");
      } else if (!data) {
          response.status(400).send("Contraseña equivocada o usuario no existente");
      } else {
          const user = data[0];
          console.log("Usuario encontrado:", user);
          request.session.usuario = user.correo;
          request.session.foto = user.foto;
          request.session.nombre = user.nombre;
          response.json(user);
      }
  });
});




router.post('/signin', function(request, response){
  const dao = request.daoSesiones;
  dao.anyadirUsuario(request.body.nombre, request.body.correo, request.body.tlf, request.body.facultad, request.body.rol, request.body.password, function(err){
    if(err){
      response.status(500);
      response.render('error', {
        config:request.session.config,
        foto:request.session.foto,
        nombre:request.session.nombre,
        usuario:request.session.usuario,
        rol: request.session.rol,
        error:"No se pudo iniciar la sesion del usuario",
        message: "Error al registrar usuario"
      })
    }
    else{
      request.session.usuario = request.body.correo;
      request.session.nombre = request.body.nombre;
      request.session.rol = request.body.rol;
      request.session.foto = null;
      request.session.save((err) => {
        if (err) console.error(err);
        response.redirect('/usuarios/');
      });
      
    }
  })
});

router.post('/login', function(request, response){
  request.session.usuario = request.body.correo;
  request.session.nombre = request.body.nombre;
  request.session.rol = request.body.rol;
  request.session.foto = request.body.foto;
  request.session.save((err) => {
    if (err) console.error(err);
    response.redirect('/usuarios/');
  });
})

router.get('/logout',function(request,response){
  request.session.destroy();
  response.redirect('/');
});

module.exports = router;
