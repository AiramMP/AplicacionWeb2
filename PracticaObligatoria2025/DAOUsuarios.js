"use strict"
const mysql = require('mysql');

class DAOUsuarios{
    constructor(pools){
        this.pool = pools;
    }

    cogerEventos(callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(err, null);
            } else{
                const sql = 'SELECT * FROM EVENTOS';
                connection.query(sql, [], function(err, datos){
                    connection.release();
                    if(err){
                        callback(err, null);
                    }else{
                        callback(null, datos);
                    }

                });
            }
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
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = `SELECT e.id AS id_evento, e.titulo, e.descripcion, e.fecha,
                        e.hora, e.ubicacion, e.capacidad_maxima, e.capacidad_restante, e.foto, i.estado_inscripcion
                        FROM Inscripciones i
                        JOIN Eventos e ON i.evento_id = e.id
                        WHERE i.usuario_id = (SELECT id FROM Usuarios WHERE correo = ?)`;
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
    
}

module.exports = DAOUsuarios;