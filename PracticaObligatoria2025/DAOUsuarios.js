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
}

module.exports = DAOUsuarios;