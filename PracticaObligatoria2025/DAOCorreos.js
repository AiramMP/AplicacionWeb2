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
                    SELECT 
                        c.id, 
                        CASE 
                            WHEN c.CorreoEmisor = 'Sistema' THEN 'Sistema'
                            ELSE u.nombre 
                        END AS emisor, 
                        c.Asunto, 
                        c.Mensaje, 
                        DATE_FORMAT(c.fecha, '%a %b %d %Y %H:%i') AS Fecha, 
                        c.Visto
                    FROM correos c
                    LEFT JOIN usuarios u ON c.CorreoEmisor = u.id
                    WHERE c.CorreoReceptor = ?
                    ORDER BY c.Fecha DESC
                `;
    
                connection.query(sql, [usuarioId], function (err, resultados) {
                    connection.release();
                    console.log("Receptor ID:", usuarioId);
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
            SELECT 
                c.id, 
                CASE 
                    WHEN c.CorreoEmisor = 'Sistema' THEN 'Sistema'
                    ELSE u.nombre 
                END AS CorreoEmisor, 
                c.asunto AS Asunto, 
                c.mensaje AS Mensaje, 
                DATE_FORMAT(c.fecha, '%a %b %d %Y %H:%i') AS Fecha, 
                c.visto AS Visto
            FROM correos c
            LEFT JOIN usuarios u ON c.CorreoEmisor = u.id
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
