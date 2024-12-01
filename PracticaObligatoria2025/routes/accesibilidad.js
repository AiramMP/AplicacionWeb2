const express = require('express');
const router = express.Router();

// Guardar configuración de accesibilidad
router.post('/guardar', (req, res) => {
    const usuarioId = req.session.userId; // Obtenemos el ID del usuario autenticado
    const { paleta_colores, tamano_texto, configuracion_navegacion } = req.body;

    req.daoAccesibilidad.guardarConfiguracion(usuarioId, {
        paleta_colores,
        tamano_texto,
        configuracion_navegacion
    }, (err) => {
        if (err) {
            console.error("Error al guardar la configuración de accesibilidad:", err);
            res.status(500).send("Error al guardar la configuración.");
        } else {
            res.send("Configuración guardada exitosamente.");
        }
    });
});

// Obtener configuración de accesibilidad
router.get('/cargar', (req, res) => {
    const usuarioId = req.session.userId;

    req.daoAccesibilidad.obtenerConfiguracion(usuarioId, (err, configuracion) => {
        if (err) {
            console.error("Error al cargar la configuración de accesibilidad:", err);
            res.status(500).send("Error al cargar la configuración.");
        } else {
            res.json(configuracion || {});
        }
    });
});

router.get('/modal', (req, res) => {
    res.render('modalAccesibilidad'); // Vista que contiene solo el modal
});


module.exports = router;
