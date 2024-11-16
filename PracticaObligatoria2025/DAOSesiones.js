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
                const sql = `SELECT correo, nombre, foto FROM Usuarios WHERE correo=? AND password=?`;
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
    


    anyadirUsuario(nombre, correo, telefono, facultad, rol, password, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(err);
            }
            else{
                const sql = `INSERT INTO Usuarios (nombre, correo, telefono, facultad, rol, configuraciones_accesibilidad, foto, password)
                VALUES (?,?,?,?,?, NULL, NULL, ? )`;
                connection.query(sql, [nombre, correo, telefono, facultad, rol, password], function(err){
                    connection.release();
                    if(err){
                        callback(err);
                    }else{
                        callback(null);
                    }
                });
            }
        });
    };

}


module.exports = DAOSesiones;