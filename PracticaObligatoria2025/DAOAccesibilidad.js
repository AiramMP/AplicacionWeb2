class DAOAccesibilidad {
    constructor(pool) {
        this.pool = pool;
    }

    guardarConfiguracion(usuarioId, configuracion, callback) {
        const { paleta_colores, tamano_texto, configuracion_navegacion } = configuracion;
        this.pool.getConnection((err, connection) => {
            if (err) return callback(err);

            const sql = `
                INSERT INTO configuracionaccesibilidad (usuario_id, paleta_colores, tamano_texto, configuracion_navegacion)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                paleta_colores = VALUES(paleta_colores),
                tamano_texto = VALUES(tamano_texto),
                configuracion_navegacion = VALUES(configuracion_navegacion)
            `;
            connection.query(sql, [usuarioId, paleta_colores, tamano_texto, configuracion_navegacion], (err) => {
                connection.release();
                callback(err);
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
