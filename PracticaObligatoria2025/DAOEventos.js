"use strict";
const mysql = require('mysql');

class DAOEventos {
    constructor(pools) {
        this.pool = pools;
    }

    // Listar todos los eventos
    listarEventos(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT * FROM eventos";
                connection.query(sql, [], function (err, datos) {
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
                    } else {
                        // Incrementar la capacidad restante del evento
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
    
}

module.exports = DAOEventos;
