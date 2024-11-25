const express = require("express");
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", function (req, res) {
    const dao = req.daoEventos;
    dao.listarEventos(function (err, eventos) {
        if (err) {
            res.status(500);
            res.render("error", {
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
                error: "No se pudo cargar la lista de eventos",
            });
        } else {
            res.render("eventos", {
                eventos: eventos,
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
            });
        }
    });
});

router.post("/inscribirse", function (req, res) {
    const dao = req.daoEventos;
    const usuarioId = req.session.userId; // ID del usuario desde la sesión
    const idEvento = req.body.id; // ID del evento enviado desde el cliente

    if (!usuarioId || !idEvento) {
        res.status(400).json({ success: false, message: "Faltan datos necesarios para inscribirse." });
        return;
    }

    dao.inscribirseEvento(usuarioId, idEvento, function (err, estado) {
        if (err) {
            console.error("Error al intentar inscribirse:", err);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor. No se pudo completar la inscripción.",
            });
        } else if (estado === "ya_inscrito") {
            res.json({ success: false, message: "Ya estás inscrito o en lista de espera para este evento." });
        } else if (estado === "inscrito") {
            res.json({ success: true, message: "Inscripción exitosa." });
        } else if (estado === "lista_de_espera") {
            // Responder con éxito pero indicando que fue a lista de espera
            res.json({ success: true, message: "Añadido a la lista de espera." });
        }
    });
});

router.post("/desapuntarse", function (req, res) {
    const dao = req.daoEventos;
    const usuarioId = req.session.userId; // ID del usuario desde la sesión
    const idEvento = req.body.id; // ID del evento enviado desde el cliente


    if (!usuarioId || !idEvento) {
        console.error("Faltan datos necesarios: usuarioId o idEvento.");
        res.status(400).json({ success: false, message: "Faltan datos necesarios para desapuntarse." });
        return;
    }

    dao.desapuntarseEvento(usuarioId, idEvento, function (err) {
        if (err) {
            console.error("Error al intentar desapuntarse:", err);
            res.status(500).json({
                success: false,
                message: err.message || "No se pudo completar la acción de desapuntarse.",
            });
        } else {
            res.json({ success: true, message: "Te has desapuntado del evento exitosamente." });
        }
    });
});





router.get("/misInscripciones", function (req, res) {
    const dao = req.daoEventos;
    const usuarioId = req.session.userId;

    dao.obtenerInscripciones(usuarioId, function (err, inscripciones) {
        if (err) {
            res.status(500);
            res.render("error", {
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
                error: "No se pudo cargar las inscripciones del usuario",
            });
        } else {
            res.render("misInscripciones", {
                inscripciones: inscripciones,
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
            });
        }
    });
});

router.get('/crearEvento', function (req, res) {
    res.render('crearEvento', {
        nombre: req.session.nombre,
        rol: req.session.rol,
        usuario: req.session.usuario,
        foto: req.session.foto,
        usuarioId: req.session.userId
    });
});

router.post('/guardarEvento', upload.single('foto'), function (req, res) {
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima } = req.body;

    if (!titulo || !descripcion || !fecha || !hora || !ubicacion || !capacidad_maxima) {
        return res.status(400).send('Todos los campos son obligatorios.');
    }

    const organizador_id = req.session.userId;
    const foto = req.file ? req.file.buffer : null;

    req.daoEventos.crearEvento(
        titulo,
        descripcion,
        fecha,
        hora,
        ubicacion,
        capacidad_maxima,
        organizador_id,
        foto,
        function (err) {
            if (err) {
                console.error("Error al crear el evento:", err);
                res.status(500).send('Error al crear el evento');
            } else {
                res.redirect('/usuarios/');
            }
        }
    );
});




module.exports = router;
