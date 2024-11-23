"use strict";
const mysql = require('mysql');

class DAOSesiones {
    constructor(pools){
        this.pool = pools;
    }

    ExisteUsuario(correo,callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = `SELECT * FROM Usuarios WHERE correo=?`;
                connection.query(sql, [correo], function (err, datos) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, datos);
                    }
                });
            }
        });
    };

    comprobarpassword(correo, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = `SELECT id, nombre, correo, foto, rol, password FROM usuarios WHERE correo = ?`;
                connection.query(sql, [correo, password], function (err, datos) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else if (datos.length === 0) {
                        callback(null, null); // Sin coincidencias
                    } else {
                        callback(null, datos); // Usuario encontrado
                    }
                });
            }
        });
    }
    


    anyadirUsuario(nombre, correo, tlf, facultad, rol, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                const sqlInsertar = `
                    INSERT INTO usuarios (nombre, correo, telefono, facultad, rol, password)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                connection.query(sqlInsertar, [nombre, correo, tlf, facultad, rol, password], function (err, result) {
                    if (err) {
                        connection.release();
                        callback(err);
                    } else {
                        const userId = result.insertId; // Obtener el ID del nuevo usuario
                        connection.release();
                        callback(null, userId); // Retornar el ID
                    }
                });
            }
        });
    }
    

}


module.exports = DAOSesiones;