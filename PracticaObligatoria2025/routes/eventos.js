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

    daoEventos.obtenerDatosEvento(idEvento, (err, eventoDatos) => {
        if (err || !eventoDatos) {
            console.error("Error al obtener datos del evento:", err);
            res.status(500).json({ success: false, message: "Error al obtener datos del evento." });
        } else {
            const tituloEvento = eventoDatos.titulo; // Título del evento

            daoEventos.verificarInscripcion(usuarioId, idEvento, (err, estaInscrito) => {
                if (err) {
                    res.status(500).json({ success: false, message: "Error interno del servidor." });
                } else if (estaInscrito) {
                    res.json({ success: false, message: "Ya estás inscrito en este evento." });
                } else {
                    daoEventos.inscribirseEvento(usuarioId, idEvento, (err, estado) => {
                        if (err) {
                            res.status(500).json({ success: false, message: "Error interno del servidor." });
                        } else {
                            // Notificar al organizador
                            daoEventos.obtenerDatosOrganizador(idEvento, (err, organizador) => {
                                if (err) {
                                    console.error("Error al obtener datos del organizador:", err);
                                } else {
                                    const asuntoOrganizador = "Nueva inscripción a tu evento";
                                    const mensajeOrganizador = `El usuario ${usuarioCorreo} se ha inscrito en tu evento: ${tituloEvento}.`;
                                    daoCorreos.enviarNotificacion(usuarioId, organizador.organizador_id, asuntoOrganizador, mensajeOrganizador, (err) => {
                                        if (err) {
                                            console.error("Error al enviar notificación al organizador:", err);
                                        }
                                    });
                                }
                            });

                            // Notificar al usuario
                            const asuntoUsuario = estado === "inscrito" 
                                ? "Inscripción exitosa al evento"
                                : "Añadido a la lista de espera";
                            const mensajeUsuario = estado === "inscrito"
                                ? `Te has inscrito exitosamente al evento: ${tituloEvento}.`
                                : `Has sido añadido a la lista de espera para el evento: ${tituloEvento}.`;

                            daoCorreos.enviarNotificacion(
                                "Sistema", // Correo emisor
                                usuarioId, // Correo receptor
                                asuntoUsuario,
                                mensajeUsuario,
                                (err) => {
                                    if (err) {
                                        console.error("Error al enviar notificación al usuario:", err);
                                    }
                                }
                            );

                            res.json({
                                success: true,
                                message: estado === "inscrito"
                                    ? "Inscripción exitosa."
                                    : "Añadido a la lista de espera."
                            });
                        }
                    });
                }
            });
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
    const usuarioId = req.session.userId;
    const usuarioCorreo = req.session.usuario;
    const idEvento = req.body.id;

    if (!usuarioId || !idEvento) {
        console.error("Datos insuficientes para desapuntarse:", { usuarioId, idEvento });
        return res.status(400).json({ success: false, message: "Faltan datos necesarios para desapuntarse." });
    }

    daoEventos.obtenerDatosEvento(idEvento, (err, eventoDatos) => {
        if (err || !eventoDatos) {
            console.error("Error al obtener datos del evento o evento no encontrado:", err);
            return res.status(500).json({ success: false, message: "Error al obtener datos del evento." });
        }

        const tituloEvento = eventoDatos.titulo;

        daoEventos.desapuntarseEvento(usuarioId, idEvento, (err) => {
            if (err) {
                console.error("Error al desapuntarse del evento:", err);
                return res.status(500).json({ success: false, message: "Error al desapuntarse del evento." });
            }

            // Notificar al organizador
            daoEventos.obtenerDatosOrganizador(idEvento, (err, organizador) => {
                if (!err && organizador) {
                    const asuntoOrganizador = "Un usuario se ha desapuntado";
                    const mensajeOrganizador = `El usuario ${usuarioCorreo} se ha desapuntado de tu evento: ${tituloEvento}.`;
                    daoCorreos.enviarNotificacion(usuarioId, organizador.organizador_id, asuntoOrganizador, mensajeOrganizador, (err) => {
                        if (err) console.error("Error al enviar notificación al organizador:", err);
                    });
                }
            });

            // Notificar al usuario
            const asuntoUsuario = "Te has desapuntado de un evento";
            const mensajeUsuario = `Has cancelado tu inscripción al evento: ${tituloEvento}.`;

            daoCorreos.enviarNotificacion("Sistema", usuarioId, asuntoUsuario, mensajeUsuario, (err) => {
                if (err) console.error("Error al enviar notificación al usuario:", err);
            });

            res.json({success: true, message: "Te has desapuntado del evento exitosamente."});
        });
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


router.post('/guardarEvento', upload.single('foto'), (req, res) => {
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo} = req.body;
    const organizadorId = req.session.userId;
    const foto = req.file ? req.file.buffer : null;

    if (!titulo || !descripcion || !fecha || !hora || !ubicacion || !capacidad_maxima || !tipo) {
        res.status(400).send('Todos los campos son obligatorios.');
        return;
    }

    req.daoEventos.crearEvento(titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, organizadorId, foto, tipo, (err, eventoId) => {
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
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo} = req.body;
    const nuevaFoto = req.file ? req.file.buffer : null;

    req.daoEventos.editarEvento(eventoId, {titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima: parseInt(capacidad_maxima, 10), tipo, foto: nuevaFoto}, (err, mensaje) => {
        if (err) {
            console.error("Error al editar el evento:", err.message);

            req.daoEventos.obtenerEvento(eventoId, (errEvento, evento) => {
                if (errEvento) {
                    res.status(500).send("Error interno del servidor.");
                } else {
                    res.render('editarEvento', {
                        evento: {
                            ...evento,
                            fecha: evento.fecha.toISOString().split('T')[0],
                            hora: evento.hora.slice(0, 5),
                            tipo: evento.tipo
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

        // Obtener los datos del evento (incluyendo el título)
        daoEventos.obtenerDatosEvento(eventoId, (err, eventoDatos) => {
            if (err || !eventoDatos) {
                console.error("Error al obtener datos del evento:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error al obtener los datos del evento." 
                });
            }

            const tituloEvento = eventoDatos.titulo;

            // Enviar notificación al usuario aceptado
            const asuntoUsuario = "Has sido promovido al estado inscrito";
            const mensajeUsuario = `Has sido promovido desde la lista de espera al estado inscrito en el evento: ${tituloEvento}.`;

            daoCorreos.enviarNotificacion("Sistema", usuarioId, asuntoUsuario, mensajeUsuario, (err) => {
                if (err) {
                    console.error("Error al enviar notificación al usuario:", err);
                }
            });

            // Enviar notificación al organizador del evento
            daoEventos.obtenerDatosOrganizador(eventoId, (err, organizador) => {
                if (!err && organizador) {
                    const asuntoOrg = "Un usuario ha sido promovido";
                    const mensajeOrg = `Un usuario ha sido promovido desde la lista de espera al estado inscrito en tu evento: ${tituloEvento}.`;

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
});


router.post('/rechazarListaEspera/:id', (req, res) => {
    const inscripcionId = req.params.id;
    const daoEventos = req.daoEventos;
    const daoCorreos = req.daoCorreos;

    daoEventos.rechazarListaEspera(inscripcionId, (err, usuarioId, eventoId) => {
        if (err) {
            res.status(500).send("Error al rechazar inscripción.");
        } else {
            // Obtener los datos del evento (incluyendo el título)
            daoEventos.obtenerDatosEvento(eventoId, (err, eventoDatos) => {
                if (err || !eventoDatos) {
                    console.error("Error al obtener datos del evento:", err);
                    return res.status(500).json({
                        success: false,
                        message: "Error al obtener los datos del evento.",
                    });
                }

                const tituloEvento = eventoDatos.titulo;

                // Notificar al usuario rechazado
                const asuntoUsuario = "Inscripción rechazada";
                const mensajeUsuario = `Lamentamos informarte que no has sido aceptado en el evento: ${tituloEvento}.`;

                daoCorreos.enviarNotificacion("Sistema", usuarioId, asuntoUsuario, mensajeUsuario, (err) => {
                    if (err) {
                        console.error("Error al enviar notificación al usuario:", err);
                    }
                });

                // Redirigir de vuelta
                res.redirect('back');
            });
        }
    });
});


router.get('/calendario-vista', (req, res) => {
    res.render('calendarioEventos', {
        configuracionAccesibilidad: req.session.configuracionAccesibilidad || {},
        foto: req.session.foto,
        nombre: req.session.nombre,
        usuario: req.session.usuario,
        rol: req.session.rol,
    });
});


router.get('/calendario', (req, res) => {
    req.daoEventos.obtenerEventosValidos((err, eventos) => {
        if (err) {
            console.error("Error al cargar los eventos válidos:", err);
            res.status(500).json({ error: 'Error al cargar los eventos.' });
        } else {
            const eventosCalendario = eventos.map(evento => {
                try {
                    // Asegúrate de que los formatos sean válidos antes de convertir
                    const fechaISO = `${evento.fecha}T${evento.hora}`;
                    const fechaEvento = new Date(fechaISO);

                    if (isNaN(fechaEvento.getTime())) {
                        throw new Error(`Fecha u hora inválida: ${fechaISO}`);
                    }

                    // Ajustar la fecha al formato local
                    const fechaLocal = new Date(fechaEvento.getTime() - fechaEvento.getTimezoneOffset() * 60000);

                    return {
                        id: evento.id,
                        title: evento.titulo,
                        start: fechaLocal.toISOString().slice(0, 19), // Formato ISO ajustado
                        description: evento.descripcion,
                    };
                } catch (error) {
                    console.error(`Error al procesar el evento ID ${evento.id}: ${error.message}`);
                    return null; // Filtrar eventos inválidos
                }
            }).filter(evento => evento !== null); // Filtrar nulos

            res.json(eventosCalendario);
        }
    });
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
