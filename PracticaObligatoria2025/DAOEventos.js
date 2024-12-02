"use strict";
const mysql = require('mysql');

class DAOEventos {
    constructor(pools) {
        this.pool = pools;
    }

    // Listar todos los eventos
    listarEventos(callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, null);
            } else {
                const sql = `
                    SELECT id, titulo, descripcion, 
                           DATE_FORMAT(fecha, '%a %b %d %Y') AS fecha, 
                           TIME_FORMAT(hora, '%H:%i') AS hora, 
                           ubicacion, capacidad_maxima, capacidad_restante 
                    FROM eventos
                `;
                connection.query(sql, [], (err, resultados) => {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, resultados);
                    }
                });
            }
        });
    }
    

    inscribirseEvento(usuarioId, id_evento, callback) {
        console.log("Entrando a inscribirseEvento con usuarioId:", usuarioId, "y id_evento:", id_evento);
    
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.error("Error al obtener conexión a la base de datos:", err);
                callback(err);
            } else {
                // Verificar si el usuario ya está inscrito en el evento
                const sqlVerificar = `
                    SELECT * FROM inscripciones 
                    WHERE usuario_id = ? AND evento_id = ?
                `;
                connection.query(sqlVerificar, [usuarioId, id_evento], function (err, resultados) {
                    if (err) {
                        console.error("Error al verificar inscripción:", err);
                        connection.release();
                        callback(err);
                    } else if (resultados.length > 0) {
                        console.log("Usuario ya inscrito o en lista de espera para este evento.");
                        connection.release();
                        callback(null, "ya_inscrito"); // Devuelve un estado especial
                    } else {
                        // Proceder con la inscripción
                        const sqlEvento = "SELECT capacidad_restante FROM eventos WHERE id = ?";
                        connection.query(sqlEvento, [id_evento], function (err, resultado) {
                            if (err) {
                                console.error("Error en consulta SELECT de eventos:", err);
                                connection.release();
                                callback(err);
                            } else if (resultado.length === 0) {
                                console.error("Evento no encontrado en la base de datos.");
                                connection.release();
                                callback(new Error("Evento no encontrado"));
                            } else {
                                const capacidadRestante = resultado[0].capacidad_restante;
                                console.log("Capacidad restante del evento:", capacidadRestante);
    
                                if (capacidadRestante > 0) {
                                    const sqlInsertar = `
                                        INSERT INTO inscripciones (usuario_id, evento_id, estado_inscripcion, fecha_inscripcion)
                                        VALUES (?, ?, 'inscrito', NOW())
                                    `;
                                    connection.query(sqlInsertar, [usuarioId, id_evento], function (err) {
                                        if (err) {
                                            console.error("Error al insertar inscripción:", err);
                                            connection.release();
                                            callback(err);
                                        } else {
                                            console.log("Usuario inscrito exitosamente.");
                                            const sqlUpdate = `
                                                UPDATE eventos SET capacidad_restante = capacidad_restante - 1
                                                WHERE id = ?
                                            `;
                                            connection.query(sqlUpdate, [id_evento], function (err) {
                                                connection.release();
                                                if (err) {
                                                    console.error("Error al actualizar capacidad restante:", err);
                                                }
                                                callback(err, "inscrito"); // Devuelve el estado
                                            });
                                        }
                                    });
                                } else {
                                    const sqlListaEspera = `
                                        INSERT INTO inscripciones (usuario_id, evento_id, estado_inscripcion, fecha_inscripcion)
                                        VALUES (?, ?, 'lista de espera', NOW())
                                    `;
                                    connection.query(sqlListaEspera, [usuarioId, id_evento], function (err) {
                                        connection.release();
                                        if (err) {
                                            console.error("Error al insertar en lista de espera:", err);
                                        } else {
                                            console.log("Usuario añadido a lista de espera.");
                                        }
                                        callback(err, "lista_de_espera"); // Devuelve el estado
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    
    desapuntarseEvento(usuarioId, id_evento, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.error("Error al obtener conexión a la base de datos:", err);
                callback(err);
            } else {
                // Comprobar el estado de inscripción antes de eliminar
                const sqlComprobarEstado = `
                    SELECT estado_inscripcion 
                    FROM inscripciones 
                    WHERE usuario_id = ? AND evento_id = ?
                `;
                connection.query(sqlComprobarEstado, [usuarioId, id_evento], function (err, resultados) {
                    if (err) {
                        console.error("Error al comprobar estado de inscripción:", err);
                        connection.release();
                        callback(err);
                    } else if (resultados.length === 0) {
                        console.error("No se encontró inscripción para eliminar.");
                        connection.release();
                        callback(new Error("No estás inscrito en este evento."));
                    } else {
                        const estadoInscripcion = resultados[0].estado_inscripcion;
                        console.log("Estado de inscripción:", estadoInscripcion);
    
                        // Eliminar la inscripción del usuario
                        const sqlEliminar = `
                            DELETE FROM inscripciones 
                            WHERE usuario_id = ? AND evento_id = ?
                        `;
                        connection.query(sqlEliminar, [usuarioId, id_evento], function (err, resultado) {
                            if (err) {
                                console.error("Error al eliminar inscripción:", err);
                                connection.release();
                                callback(err);
                            } else if (resultado.affectedRows === 0) {
                                console.error("No se encontró inscripción para eliminar.");
                                connection.release();
                                callback(new Error("No estás inscrito en este evento."));
                            } else if (estadoInscripcion === 'inscrito') {
                                // Incrementar la capacidad restante del evento solo si estaba inscrito
                                const sqlActualizarCapacidad = `
                                    UPDATE eventos 
                                    SET capacidad_restante = capacidad_restante + 1
                                    WHERE id = ?
                                `;
                                connection.query(sqlActualizarCapacidad, [id_evento], function (err) {
                                    connection.release();
                                    if (err) {
                                        console.error("Error al actualizar capacidad restante:", err);
                                        callback(err);
                                    } else {
                                        console.log("Capacidad restante actualizada y usuario desapuntado.");
                                        callback(null);
                                    }
                                });
                            } else {
                                // Liberar conexión si estaba en la lista de espera (no se actualiza capacidad)
                                connection.release();
                                console.log("Usuario desapuntado. No se actualizó capacidad porque estaba en lista de espera.");
                                callback(null);
                            }
                        });
                    }
                });
            }
        });
    }
        
    

    // Obtener inscripciones de un usuario
    obtenerInscripciones(usuarioId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = `
                    SELECT e.*, i.estado_inscripcion 
                    FROM inscripciones i
                    JOIN eventos e ON i.evento_id = e.id
                    WHERE i.usuario_id = ?
                `;
                connection.query(sql, [usuarioId], function (err, datos) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, datos);
                    }
                });
            }
        });
    }

    crearEvento(titulo, descripcion, fecha, hora, ubicacion, capacidadMaxima, organizadorId, foto, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.error("Error al obtener conexión a la base de datos:", err);
                callback(err);
            } else {
                const sql = `
                    INSERT INTO eventos (titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, capacidad_restante, organizador_id, foto)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                connection.query(
                    sql,
                    [titulo, descripcion, fecha, hora, ubicacion, capacidadMaxima, capacidadMaxima, organizadorId, foto],
                    function (err, resultado) {
                        connection.release();
                        if (err) {
                            console.error("Error al crear el evento:", err);
                            callback(err);
                        } else {
                            console.log("Evento creado exitosamente con ID:", resultado.insertId);
                            callback(null, resultado.insertId); // Devuelve el ID del evento creado
                        }
                    }
                );
            }
        });
    }

    listarEventosPorOrganizador(organizadorId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.error('Error al obtener conexión a la base de datos:', err);
                callback(err, null);
            } else {
                const sql = `
                    SELECT * FROM eventos
                    WHERE organizador_id = ?
                `;
                connection.query(sql, [organizadorId], function (err, resultados) {
                    connection.release();
                    if (err) {
                        console.error('Error al obtener los eventos del organizador:', err);
                        callback(err, null);
                    } else {
                        callback(null, resultados);
                    }
                });
            }
        });
    }
    
    editarEvento(eventoId, datos, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err);
            } else {
                const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, foto } = datos;
    
                // Obtenemos el número de inscritos y la capacidad restante
                const sqlValidar = `
                    SELECT capacidad_restante, capacidad_maxima - capacidad_restante AS inscritos 
                    FROM eventos 
                    WHERE id = ?
                `;
                connection.query(sqlValidar, [eventoId], (err, resultado) => {
                    if (err) {
                        connection.release();
                        callback(err);
                    } else if (resultado.length === 0) {
                        connection.release();
                        callback(new Error("Evento no encontrado."));
                    } else {
                        const { capacidad_restante, inscritos } = resultado[0];
    
                        if (capacidad_maxima < inscritos) {
                            connection.release();
                            callback(new Error(`La capacidad máxima no puede ser menor que el número de inscritos (${inscritos}).`));
                        } else {
                            // Calculamos la nueva capacidad restante
                            const nuevaCapacidadRestante = capacidad_maxima - inscritos;
    
                            // Actualizamos el evento
                            const sqlActualizar = `
                                UPDATE eventos
                                SET titulo = ?, descripcion = ?, fecha = ?, hora = ?, ubicacion = ?, capacidad_maxima = ?, capacidad_restante = ?, foto = ?
                                WHERE id = ?
                            `;
                            connection.query(sqlActualizar, [titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, nuevaCapacidadRestante, foto, eventoId], (err) => {
                                connection.release();
                                if (err) {
                                    callback(err);
                                } else {
                                    callback(null, "Evento actualizado correctamente.");
                                }
                            });
                        }
                    }
                });
            }
        });
    }
    
    
    obtenerEvento(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err);
            } else {
                const sql = `SELECT * FROM eventos WHERE id = ?`;
                connection.query(sql, [id], (err, results) => {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, results[0]);
                    }
                });
            }
        });
    }

    obtenerDatosOrganizador(eventoId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, null);
            } else {
                const sql = `
                    SELECT u.id AS organizador_id, u.nombre AS organizador_nombre, u.correo AS organizador_correo
                    FROM eventos e
                    JOIN usuarios u ON e.organizador_id = u.id
                    WHERE e.id = ?;
                `;
                connection.query(sql, [eventoId], (err, results) => {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, results[0]); // Devuelve los datos del organizador
                    }
                });
            }
        });
    }
    

    obtenerListaEspera(eventoId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, null);
            } else {
                const sql = `
                    SELECT i.id, i.usuario_id, u.nombre, u.correo, i.fecha_inscripcion
                    FROM inscripciones i
                    JOIN usuarios u ON i.usuario_id = u.id
                    WHERE i.evento_id = ? AND i.estado_inscripcion = 'lista de espera'
                    ORDER BY i.fecha_inscripcion ASC
                `;
                connection.query(sql, [eventoId], (err, results) => {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    }
    
    aceptarListaEspera(inscripcionId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err);
            } else {
                const sqlValidarCapacidad = `
                    SELECT e.id AS eventoId, e.capacidad_restante, i.usuario_id
                    FROM eventos e
                    JOIN inscripciones i ON e.id = i.evento_id
                    WHERE i.id = ?
                `;
    
                connection.query(sqlValidarCapacidad, [inscripcionId], (err, resultados) => {
                    if (err) {
                        connection.release();
                        callback(err);
                    } else if (resultados.length === 0) {
                        connection.release();
                        callback(new Error("Inscripción o evento no encontrado."));
                    } else {
                        const { eventoId, capacidad_restante, usuario_id: usuarioId } = resultados[0];
    
                        if (capacidad_restante <= 0) {
                            connection.release();
                            // Aquí devolvemos un error con un código personalizado
                            const error = new Error("El evento está lleno. No se puede aceptar más inscripciones.");
                            error.code = "00"; // Código personalizado
                            callback(error);
                        } else {
                            const sqlAceptar = `
                                UPDATE inscripciones
                                SET estado_inscripcion = 'inscrito'
                                WHERE id = ?
                            `;
    
                            connection.query(sqlAceptar, [inscripcionId], (err) => {
                                if (err) {
                                    connection.release();
                                    callback(err);
                                } else {
                                    const sqlActualizarCapacidad = `
                                        UPDATE eventos
                                        SET capacidad_restante = capacidad_restante - 1
                                        WHERE id = ?
                                    `;
    
                                    connection.query(sqlActualizarCapacidad, [eventoId], (err) => {
                                        connection.release();
                                        if (err) {
                                            callback(err);
                                        } else {
                                            callback(null, usuarioId, eventoId);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }
    
    
    
    
    
    rechazarListaEspera(inscripcionId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err);
            } else {
                // Obtener el ID del usuario y del evento antes de eliminar
                const sqlObtenerDatos = `
                    SELECT usuario_id, evento_id
                    FROM inscripciones
                    WHERE id = ?
                `;
                connection.query(sqlObtenerDatos, [inscripcionId], (err, rows) => {
                    if (err || rows.length === 0) {
                        connection.release();
                        callback(err || new Error("No se encontró inscripción en lista de espera para rechazar."));
                    } else {
                        const { usuario_id, evento_id } = rows[0];
    
                        // Eliminar inscripción
                        const sqlEliminar = `
                            DELETE FROM inscripciones
                            WHERE id = ?
                        `;
                        connection.query(sqlEliminar, [inscripcionId], (err) => {
                            connection.release();
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, usuario_id, evento_id); // Devolver IDs para la notificación
                            }
                        });
                    }
                });
            }
        });
    }
    
    
}

module.exports = DAOEventos;
