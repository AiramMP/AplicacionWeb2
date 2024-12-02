const express = require('express');
const router = express.Router();

// Ruta para ver las notificaciones (bandeja de entrada)
router.get('/misnotificaciones', function (req, res) {
    const dao = req.daoCorreos;
    const usuarioId = req.session.userId;
    console.log(usuarioId);
    
    if (!usuarioId) {
        return res.status(400).render('error', {
            foto: req.session.foto,
            nombre: req.session.nombre,
            usuario: req.session.usuario,
            rol: req.session.rol,
            configuracionAccesibilidad: req.session.configuracionAccesibilidad,
            message: "No se pudo obtener el usuario.",
            error: {}
        });
    }

    dao.verCorreosRecibidos(usuarioId, function (err, correos) {
        if (err) {
            console.error("Error al obtener notificaciones:", err);
            res.status(500).render('error', {
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
                configuracionAccesibilidad: req.session.configuracionAccesibilidad,
                message: "No se pudieron cargar las notificaciones.",
                error: err
            });
        } else {
            res.render('misnotificaciones', {
                correos: correos,
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
                configuracionAccesibilidad: req.session.configuracionAccesibilidad,
            });
        }
    });
});


// Ruta para ver un correo específico
/*router.get('/ver/:id', function (req, res) {
    if (!req.session.userId) {
        return res.redirect('/');
    }

    const dao = req.daoCorreos;
    const correoId = req.params.id;
    const receptorId = req.session.userId; // ID del usuario logueado

    dao.verCorreo(correoId, receptorId, function (err, correo) {
        if (err || !correo) {
            console.error("Error al obtener el correo:", err || "Correo no encontrado");
            res.redirect('/correos/misnotificaciones');
        } else {
            // Marcar el correo como visto
            dao.marcarComoVisto(correoId, function (err) {
                if (err) {
                    console.error("Error al marcar correo como visto:", err);
                }
                res.render('verCorreo', {
                    correo,
                    foto: req.session.foto,
                    nombre: req.session.nombre,
                    usuario: req.session.usuario,
                    rol: req.session.rol,
                });
            });
        }
    });
});*/

router.get("/verNotificacion/:id", (req, res) => {
    const correoId = req.params.id;
    const dao = req.daoCorreos;
    console.log("El correo es este (desde correos.js --> 80)" + correoId);
    dao.verCorreo(correoId, (err, correo) => {
        if (err) {
            console.error("Error al obtener el correo:", err);
            res.status(500).send("Error al obtener la notificación.");
        } else if (!correo) {
            res.status(404).send("Notificación no encontrada.");
        } else {
            res.render("verNotificacion", { correo }); // Renderiza el modal con los datos
        }
    });
});




router.post('/marcarLeido/:id', (req, res) => {
    const correoId = req.params.id;

    req.daoCorreos.marcarComoLeido(correoId, (err) => {
        if (err) {
            console.error("Error al marcar el correo como leído:", err);
            res.status(500).json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
});




// Ruta para enviar un correo (solo admins o usuarios con permisos)
router.post('/enviar', function (req, res) {
    if (!req.session.userId) {
        return res.redirect('/');
    }

    const { receptorId, asunto, mensaje } = req.body;
    const emisorId = req.session.userId;

    if (!asunto || !mensaje) {
        return res.status(400).send("Asunto y mensaje son obligatorios.");
    }

    const dao = req.daoCorreos;

    dao.enviarCorreo(emisorId, receptorId, asunto, mensaje, function (err) {
        if (err) {
            console.error("Error al enviar correo:", err);
            res.status(500).render('error', {
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
                configuracionAccesibilidad: req.session.configuracionAccesibilidad,
                error: "No se pudo enviar el correo."
            });
        } else {
            res.redirect('/correos/misnotificaciones');
        }
    });
});

module.exports = router;
