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

router.get('/misEventos', function (req, res) {
    const dao = req.daoEventos;
    const organizadorId = req.session.userId;

    dao.listarEventosPorOrganizador(organizadorId, function (err, eventos) {
        if (err) {
            res.status(500);
            res.render('error', {
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
                error: 'No se pudieron cargar tus eventos',
            });
        } else {
            res.render('misEventos', {
                eventos: eventos,
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
            });
        }
    });
});

router.get('/editar/:id', (req, res) => {
    const eventoId = req.params.id;
    req.daoEventos.obtenerEvento(eventoId, (err, evento) => {
        if (err) {
            console.error("Error al obtener el evento:", err);
            res.status(500).send("Error interno del servidor.");
        } else {
            // Formatear la hora para eliminar los segundos
            const horaFormateada = evento.hora.slice(0, 5); // 'HH:MM:SS' -> 'HH:MM'
            
            res.render('editarEvento', {
                evento: {
                    ...evento,
                    hora: horaFormateada
                },
                error: null,
                rol: req.session.rol,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                foto: req.session.foto
            });
        }
    });
});



router.post('/editar/:id', upload.single('foto'), (req, res) => {
    const eventoId = req.params.id;
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima } = req.body;
    const nuevaFoto = req.file ? req.file.buffer : null;

    // Llamamos a la función para editar el evento
    req.daoEventos.editarEvento(eventoId, {
        titulo,
        descripcion,
        fecha,
        hora,
        ubicacion,
        capacidad_maxima: parseInt(capacidad_maxima, 10), // Convertir a número
        foto: nuevaFoto
    }, (err, mensaje) => {
        if (err) {
            console.error("Error al editar el evento:", err.message);

            // Si ocurre un error, obtenemos los datos del evento para rellenar el formulario nuevamente
            req.daoEventos.obtenerEvento(eventoId, (errEvento, evento) => {
                if (errEvento) {
                    res.status(500).send("Error interno del servidor.");
                } else {
                    res.render('editarEvento', {
                        evento: {
                            ...evento,
                            fecha: evento.fecha.toISOString().split('T')[0], // Formato para input date
                            hora: evento.hora.slice(0, 5) // Formato para input time
                        },
                        error: err.message, // Pasamos el mensaje de error
                        foto: req.session.foto,
                        nombre: req.session.nombre,
                        usuario: req.session.usuario,
                        rol: req.session.rol
                    });
                }
            });
        } else {
            console.log(mensaje); // Mensaje de éxito
            res.redirect('/eventos/misEventos');
        }
    });
});

router.get('/listaEspera/:id', (req, res) => {
    const eventoId = req.params.id;

    req.daoEventos.obtenerListaEspera(eventoId, (err, listaEspera) => {
        if (err) {
            console.error("Error al obtener la lista de espera:", err.message);
            res.status(500).render('error', {
                error: "No se pudo cargar la lista de espera.",
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol
            });
        } else {
            res.render('listaEspera', {
                listaEspera,
                eventoId,
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol
            });
        }
    });
});


router.post('/aceptarListaEspera/:id', (req, res) => {
    const inscripcionId = req.params.id;

    req.daoEventos.aceptarListaEspera(inscripcionId, (err) => {
        if (err) {
            console.error("Error al aceptar inscripción:", err.message);
            res.status(500).send("Error al aceptar inscripción.");
        } else {
            res.redirect('back'); // Volver a la lista de espera
        }
    });
});


router.post('/rechazarListaEspera/:id', (req, res) => {
    const inscripcionId = req.params.id;

    req.daoEventos.rechazarListaEspera(inscripcionId, (err) => {
        if (err) {
            console.error("Error al rechazar inscripción:", err.message);
            res.status(500).send("Error al rechazar inscripción.");
        } else {
            res.redirect('back'); // Volver a la lista de espera
        }
    });
});


module.exports = router;
