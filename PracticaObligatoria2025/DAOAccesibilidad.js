class DAOAccesibilidad {
    constructor(pool) {
        this.pool = pool;
    }

    guardarConfiguracion(usuarioId, configuracion, callback) {
        const { paleta_colores, tamano_texto} = configuracion;
        this.pool.getConnection((err, connection) => {
            if (err) return callback(err);

            connection.beginTransaction((err) => {
                if (err) {
                    connection.release();
                    return callback(err);
                }

                // Eliminar configuraciones previas del usuario
                const sqlDelete = `DELETE FROM configuracionaccesibilidad WHERE usuario_id = ?`;
                connection.query(sqlDelete, [usuarioId], (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(err);
                        });
                    }

                    // Insertar la nueva configuración
                    const sqlInsert = `
                        INSERT INTO configuracionaccesibilidad (usuario_id, paleta_colores, tamano_texto)
                        VALUES (?, ?, ?)
                    `;
                    connection.query(sqlInsert, [usuarioId, paleta_colores, tamano_texto], (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(err);
                            });
                        }

                        connection.commit((err) => {
                            connection.release();
                            if (err) return callback(err);
                            callback(null);
                        });
                    });
                });
            });
        });
    }

    obtenerConfiguracion(usuarioId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) return callback(err);

            const sql = `SELECT * FROM configuracionaccesibilidad WHERE usuario_id = ?`;
            connection.query(sql, [usuarioId], (err, results) => {
                connection.release();
                if (err) return callback(err);
                callback(null, results[0]);
            });
        });
    }
}

module.exports = DAOAccesibilidad;
