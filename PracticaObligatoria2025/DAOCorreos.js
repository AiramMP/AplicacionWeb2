class DAOCorreos {
    constructor(pool) {
        this.pool = pool;
    }

    verCorreosRecibidos(usuarioId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = `
                            SELECT c.id, u.nombre AS emisor, c.Asunto, c.Mensaje, c.Fecha, c.Visto
                            FROM correos c
                            JOIN usuarios u ON c.CorreoEmisor = u.id
                            WHERE c.CorreoReceptor = ?
                            ORDER BY c.Fecha DESC`;
connection.query(sql, [usuarioId.toString()], function (err, resultados) {
    connection.release();
    console.log("Receptor ID (como string):", usuarioId.toString());
    console.log("Resultados de correos:", resultados);

    if (err) {
        callback(err, null);
    } else {
        callback(null, resultados);
    }
});

            }
        });
    }
    

    enviarCorreo(emisorId, receptorId, asunto, mensaje, callback) {
        const sql = `
            INSERT INTO correos (emisor_id, receptor_id, asunto, mensaje) 
            VALUES (?, ?, ?, ?)
        `;
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query(sql, [emisorId, receptorId, asunto, mensaje], function (err, resultado) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, resultado.insertId);
                    }
                });
            }
        });
    }

    verCorreo(correoId, callback) {
        const sql = `
            SELECT c.id, u.nombre AS CorreoEmisor, c.asunto AS Asunto, c.mensaje AS Mensaje, c.fecha AS Fecha, c.visto AS Visto
            FROM correos c
            JOIN usuarios u ON c.CorreoEmisor = u.id
            WHERE c.id = ?
        `;
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, null);
            } else {
                connection.query(sql, [correoId], (err, resultado) => {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, resultado[0]); // Devolver el primer resultado
                    }
                });
            }
        });
    }
    
    
    

    marcarComoLeido(correoId, callback) {
        const sql = `
            UPDATE correos
            SET Visto = 1
            WHERE id = ?
        `;
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err);
            } else {
                connection.query(sql, [correoId], (err) => {
                    connection.release();
                    callback(err);
                });
            }
        });
    }
    

    enviarNotificacion(emisorId, receptorId, asunto, mensaje, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = `
                    INSERT INTO correos (CorreoEmisor, CorreoReceptor, Asunto, Mensaje) 
                    VALUES (?, ?, ?, ?)
                `;
                connection.query(sql, [emisorId, receptorId, asunto, mensaje], function (err, resultado) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, resultado.insertId);
                    }
                });
            }
        });
    }
    
}

module.exports = DAOCorreos;
