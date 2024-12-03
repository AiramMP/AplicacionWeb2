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
                configuracionAccesibilidad: req.session.configuracionAccesibilidad || {},
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
                error: "No se pudo cargar la lista de eventos",
            });
        } else {
            console.log(eventos);
            res.render("eventos", {
                eventos: eventos,
                configuracionAccesibilidad: req.session.configuracionAccesibilidad || {},
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
            });
        }
    });
});

router.post('/inscribirse', (req, res) => {
    const daoEventos = req.daoEventos;
    const daoCorreos = req.daoCorreos;
    const usuarioId = req.session.userId; // Usuario actual
    const usuarioCorreo = req.session.usuario; // Correo del usuario actual
    const idEvento = req.body.id;

    if (!usuarioId || !idEvento) {
        res.status(400).json({ success: false, message: "Faltan datos necesarios para inscribirse." });
        return;
    }

    daoEventos.inscribirseEvento(usuarioId, idEvento, (err, estado) => {
        if (err) {
            res.status(500).json({ success: false, message: "Error interno del servidor." });
        } else {
            // Obtener datos del organizador para notificarle
            daoEventos.obtenerDatosOrganizador(idEvento, (err, organizador) => {
                if (err) {
                    console.error("Error al obtener datos del organizador:", err);
                } else {
                    const asunto = "Nueva inscripción a tu evento";
                    const mensaje = `El usuario ${usuarioCorreo} se ha inscrito en tu evento con ID ${idEvento}.`;
                    daoCorreos.enviarNotificacion(usuarioId, organizador.organizador_id, asunto, mensaje, (err) => {
                        if (err) {
                            console.error("Error al enviar notificación al organizador:", err);
                        }
                    });
                }
            });

            res.json({ success: true, message: estado === "inscrito" ? "Inscripción exitosa." : "Añadido a la lista de espera." });
        }
    });
});




router.post("/cancelarEvento", function (req, res) {
    const daoEventos = req.daoEventos;
    const daoCorreos = req.daoCorreos;
    const eventoId = req.body.id;

    daoEventos.cancelarEvento(eventoId, function (err) {
        if (err) {
            console.error("Error al cancelar evento:", err);
            res.status(500).send("No se pudo cancelar el evento.");
        } else {
            // Obtener usuarios inscritos y notificarles
            daoEventos.obtenerUsuariosInscritos(eventoId, function (err, usuarios) {
                if (!err && usuarios.length > 0) {
                    usuarios.forEach((usuario) => {
                        const asunto = "Evento cancelado";
                        const mensaje = `El evento al que estabas inscrito ha sido cancelado.`;
                        daoCorreos.enviarNotificacion("Sistema", usuario.id, asunto, mensaje, function (err) {
                            if (err) console.error("Error al notificar a usuario:", err);
                        });
                    });
                }
            });

            res.json({ success: true, message: "Evento cancelado y usuarios notificados." });
        }
    });
});



router.post('/desapuntarse', (req, res) => {
    const daoEventos = req.daoEventos;
    const daoCorreos = req.daoCorreos;
    const usuarioId = req.session.userId; // Usuario actual
    const usuarioCorreo = req.session.usuario; // Correo del usuario actual
    const idEvento = req.body.id;

    if (!usuarioId || !idEvento) {
        res.status(400).json({ success: false, message: "Faltan datos necesarios para desapuntarse." });
        return;
    }

    daoEventos.desapuntarseEvento(usuarioId, idEvento, (err) => {
        if (err) {
            res.status(500).json({ success: false, message: "Error al desapuntarse del evento." });
        } else {
            daoEventos.obtenerDatosOrganizador(idEvento, (err, organizador) => {
                if (!err && organizador) {
                    const asunto = "Un usuario se ha desapuntado";
                    const mensaje = `El usuario ${usuarioCorreo} se ha desapuntado de tu evento con ID ${idEvento}.`;
                    daoCorreos.enviarNotificacion(usuarioId, organizador.organizador_id, asunto, mensaje, (err) => {
                        if (err) {
                            console.error("Error al enviar notificación al organizador:", err);
                        }
                    });
                }
            });

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
                configuracionAccesibilidad: req.session.configuracionAccesibilidad || {},
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
                error: "No se pudo cargar las inscripciones del usuario",
            });
        } else {
            res.render("misInscripciones", {
                inscripciones: inscripciones,
                configuracionAccesibilidad: req.session.configuracionAccesibilidad || {},
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
        configuracionAccesibilidad: req.session.configuracionAccesibilidad,
        rol: req.session.rol,
        usuario: req.session.usuario,
        foto: req.session.foto,
        usuarioId: req.session.userId
    });
});

/*router.post('/guardarEvento', upload.single('foto'), function (req, res) {
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
});*/

router.post('/guardarEvento', upload.single('foto'), (req, res) => {
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima } = req.body;
    const organizadorId = req.session.userId;
    const foto = req.file ? req.file.buffer : null;
    console.log("--------------------------------------------------------");
    console.log(req.body);

    if (!titulo || !descripcion || !fecha || !hora || !ubicacion || !capacidad_maxima) {
        res.status(400).send('Todos los campos son obligatorios.');
        return;
    }

    req.daoEventos.crearEvento(titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, organizadorId, foto, (err, eventoId) => {
        if (err) {
            res.status(500).send('Error al crear el evento.');
        } else {
            // Confirmación al organizador
            const asunto = "Evento creado exitosamente";
            const mensaje = `Tu evento "${titulo}" ha sido creado con éxito.`;
            req.daoCorreos.enviarNotificacion("Sistema", organizadorId, asunto, mensaje, (err) => {
                if (err) {
                    console.error("Error al enviar confirmación al organizador:", err);
                }
            });

            res.redirect('/usuarios/');
        }
    });
});


router.get('/misEventos', function (req, res) {
    const dao = req.daoEventos;
    const organizadorId = req.session.userId;

    dao.listarEventosPorOrganizador(organizadorId, function (err, eventos) {
        if (err) {
            res.status(500);
            res.render('error', {
                foto: req.session.foto,
                configuracionAccesibilidad: req.session.configuracionAccesibilidad || {},
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                rol: req.session.rol,
                error: 'No se pudieron cargar tus eventos',
            });
        } else {
            res.render('misEventos', {
                eventos: eventos,
                configuracionAccesibilidad: req.session.configuracionAccesibilidad || {},
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
                configuracionAccesibilidad: req.session.configuracionAccesibilidad || {},
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
                        error: err.message,
                        configuracionAccesibilidad: req.session.configuracionAccesibilidad || {},
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
                configuracionAccesibilidad: req.session.configuracionAccesibilidad || {},
                rol: req.session.rol
            });
        } else {
            res.render('listaEspera', {
                listaEspera,
                eventoId,
                foto: req.session.foto,
                nombre: req.session.nombre,
                usuario: req.session.usuario,
                configuracionAccesibilidad: req.session.configuracionAccesibilidad || {},
                rol: req.session.rol
            });
        }
    });
});


router.post('/aceptarListaEspera/:id', (req, res) => {
    const inscripcionId = req.params.id;
    const daoEventos = req.daoEventos;
    const daoCorreos = req.daoCorreos;

    daoEventos.aceptarListaEspera(inscripcionId, (err, usuarioId, eventoId) => {
        if (err) {
            if (err.code === "00") {
                // Error de capacidad: responder con mensaje claro al cliente
                return res.status(400).json({ 
                    success: false, 
                    message: "No se puede aceptar. El evento ya está lleno." 
                });
            } else {
                // Otros errores: responder con mensaje genérico
                return res.status(500).json({ 
                    success: false, 
                    message: "Error al aceptar inscripción." 
                });
            }
        }

        // Enviar notificación al usuario aceptado
        const asuntoUsuario = "Has sido promovido al estado inscrito";
        const mensajeUsuario = `Has sido promovido desde la lista de espera al estado inscrito en el evento: ${eventoId}.`;

        daoCorreos.enviarNotificacion("Sistema", usuarioId, asuntoUsuario, mensajeUsuario, (err) => {
            if (err) {
                console.error("Error al enviar notificación al usuario:", err);
            }
        });

        // Enviar notificación al organizador del evento
        daoEventos.obtenerDatosOrganizador(eventoId, (err, organizador) => {
            if (!err && organizador) {
                const asuntoOrg = "Un usuario ha sido promovido";
                const mensajeOrg = `Un usuario ha sido promovido desde la lista de espera al estado inscrito en tu evento: ${eventoId}.`;

                daoCorreos.enviarNotificacion("Sistema", organizador.organizador_id, asuntoOrg, mensajeOrg, (err) => {
                    if (err) {
                        console.error("Error al enviar notificación al organizador:", err);
                    }
                });
            }
        });

        // Responder con éxito
        res.json({ 
            success: true, 
            message: "Usuario aceptado desde la lista de espera." 
        });
    });
});




router.post('/rechazarListaEspera/:id', (req, res) => {
    const inscripcionId = req.params.id;
    const daoEventos = req.daoEventos;
    const daoCorreos = req.daoCorreos;

    daoEventos.rechazarListaEspera(inscripcionId, (err, usuarioId, eventoId) => {
        if (err) {
            res.status(500).send("Error al rechazar inscripción.");
        } else {
            // Notificar al usuario rechazado
            const asuntoUsuario = "Inscripción rechazada";
            const mensajeUsuario = `Lamentamos informarte que no has sido aceptado en el evento: ${eventoId}.`;
            daoCorreos.enviarNotificacion("Sistema", usuarioId, asuntoUsuario, mensajeUsuario, (err) => {
                if (err) console.error("Error al enviar notificación al usuario:", err);
            });

            res.redirect('back');
        }
    });
});

router.get('/calendario', (req, res) => {
    const start = req.query.start;
    const end = req.query.end;

    if (start && end) {
        // Filtrar eventos por rango de fechas
        req.daoEventos.obtenerEventosPorRango(start, end, (err, eventos) => {
            if (err) {
                res.status(500).send('Error al cargar los eventos');
            } else {
                const eventosCalendario = eventos.map(evento => ({
                    id: evento.id,
                    title: evento.titulo,
                    start: `${evento.fecha}T${evento.hora}`,
                    description: evento.descripcion,
                }));
                res.json(eventosCalendario);
            }
        });
    } else {
        // Devolver todos los eventos
        req.daoEventos.cogerEventosCalendario((err, eventos) => {
            if (err) {
                res.status(500).send('Error al cargar los eventos');
            } else {
                const eventosCalendario = eventos.map(evento => ({
                    id: evento.id,
                    title: evento.titulo,
                    start: `${evento.fecha}T${evento.hora}`,
                    description: evento.descripcion,
                }));
                res.json(eventosCalendario);
            }
        });
    }
});

router.get('/historialAsistentes/:id', (req, res) => {
    const eventoId = req.params.id;
    const daoEventos = req.daoEventos;

    daoEventos.obtenerHistorialAsistentes(eventoId, (err, asistentes) => {
        if (err) {
            console.error("Error al obtener historial de asistentes:", err);
            res.status(500).send("Error al obtener el historial de asistentes.");
        } else {
            res.render('historialAsistentes', { 
                asistentes, 
                eventoId,
                nombre: req.session.nombre,
                configuracionAccesibilidad: req.session.configuracionAccesibilidad, // Asegúrate de que esta variable exista en la sesión
                rol: req.session.rol, // Asegúrate de pasar esta variable
                usuario: req.session.usuario,
                foto: req.session.foto 
            });
        }
    });
});











module.exports = router;
