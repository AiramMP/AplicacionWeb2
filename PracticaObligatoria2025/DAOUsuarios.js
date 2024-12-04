"use strict"
const mysql = require('mysql');

class DAOUsuarios{
    constructor(pools){
        this.pool = pools;
    }

    cogerEventos(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = `
                    SELECT id, titulo, descripcion, 
                           DATE_FORMAT(fecha, '%a %b %d %Y') AS fecha, 
                           TIME_FORMAT(hora, '%H:%i') AS hora, 
                           ubicacion, capacidad_maxima, capacidad_restante, organizador_id, 
                           foto
                    FROM eventos
                    WHERE CONCAT(fecha, ' ', hora) >= NOW() -- Filtrar eventos futuros o actuales
                    ORDER BY fecha ASC, hora ASC -- Ordenar por fecha y hora
                `;
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

    cogerEventosConFiltros(filtros, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) return callback(err);
    
            let sql = `
                SELECT id, titulo, descripcion, 
                       DATE_FORMAT(fecha, '%W %d %M %Y') AS fecha, 
                       TIME_FORMAT(hora, '%H:%i') AS hora, 
                       ubicacion, capacidad_maxima, capacidad_restante, tipo, 
                       foto
                FROM eventos
                WHERE 1=1
            `;
    
            const params = [];
    
            if (filtros.fechaInicio) {
                sql += " AND fecha >= ?";
                params.push(filtros.fechaInicio);
            }
            if (filtros.tipo) {
                sql += " AND tipo = ?";
                params.push(filtros.tipo);
            }
            if (filtros.ubicacion) {
                sql += " AND ubicacion LIKE ?";
                params.push(`%${filtros.ubicacion}%`);
            }
            if (filtros.capacidad) {
                sql += " AND capacidad_restante >= ?";
                params.push(filtros.capacidad);
            }
    
            sql += " ORDER BY fecha ASC";
    
            connection.query(sql, params, (err, datos) => {
                connection.release();
                if (err) return callback(err);
                callback(null, datos);
            });
        });
    }
    
    

    cogerEventosCalendario(callback) {
        this.pool.getConnection((err, connection) => {
            if (err) return callback(err);
    
            const sql = `
                SELECT id, titulo, descripcion, 
                       DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, 
                       TIME_FORMAT(hora, '%H:%i:%s') AS hora, 
                       ubicacion, capacidad_maxima, capacidad_restante, organizador_id, 
                       foto
                FROM eventos
                WHERE fecha >= CURDATE() -- Solo eventos futuros
            `;
    
            connection.query(sql, [], (err, datos) => {
                connection.release();
                if (err) return callback(err);
                callback(null, datos);
            });
        });
    }
    
    
    

    miPerfil(usuario,callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = `SELECT * FROM Usuarios WHERE correo=?`;
                connection.query(sql, [usuario], function (err, datos) {
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
     
    cambiarFoto(usuario, foto, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = `
                    UPDATE Usuarios
                    SET foto = ?
                    WHERE correo = ?`;
                    
                connection.query(sql, [foto, usuario], function (err) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

    misIncripciones(usuario, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                return callback(err, null);
            }
            console.log("Usuario ID recibido:", usuario);

            const sql = `
                SELECT e.id, e.titulo, e.descripcion, 
                       DATE_FORMAT(e.fecha, '%a %b %d %Y') AS fecha, 
                       TIME_FORMAT(e.hora, '%H:%i') AS hora, 
                       e.ubicacion, e.capacidad_maxima, e.capacidad_restante, 
                       i.estado_inscripcion
                FROM inscripciones i
                JOIN eventos e ON i.evento_id = e.id
                WHERE i.usuario_id = ?
            `;
    
            connection.query(sql, [usuario], (queryErr, inscripciones) => {
                connection.release();
                console.log("Estan pasando cosas:", inscripciones);
                if (queryErr) {
                    return callback(queryErr, null);
                }
                callback(null, inscripciones);
            });
        });
    }    
    
}

module.exports = DAOUsuarios;