CREATE TABLE `configuracionaccesibilidad` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `usuario_id` int(11) NOT NULL,
 `paleta_colores` varchar(255) DEFAULT NULL,
 `tamano_texto` varchar(50) DEFAULT NULL,
 `configuracion_navegacion` varchar(255) DEFAULT NULL,
 PRIMARY KEY (`id`),
 KEY `usuario_id` (`usuario_id`),
 CONSTRAINT `configuracionaccesibilidad_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
eventos	CREATE TABLE `eventos` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `titulo` varchar(255) NOT NULL,
 `descripcion` text NOT NULL,
 `fecha` date NOT NULL,
 `hora` time NOT NULL,
 `ubicacion` varchar(255) NOT NULL,
 `capacidad_maxima` int(11) NOT NULL,
 `capacidad_restante` int(11) NOT NULL,
 `organizador_id` int(11) NOT NULL,
 `foto` mediumblob DEFAULT NULL,
 PRIMARY KEY (`id`),
 KEY `organizador_id` (`organizador_id`),
 CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`organizador_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
inscripciones	CREATE TABLE `inscripciones` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `usuario_id` int(11) NOT NULL,
 `evento_id` int(11) NOT NULL,
 `estado_inscripcion` enum('inscrito','lista de espera') NOT NULL,
 `fecha_inscripcion` datetime NOT NULL,
 PRIMARY KEY (`id`),
 KEY `usuario_id` (`usuario_id`),
 KEY `evento_id` (`evento_id`),
 CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
 CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
sessions	CREATE TABLE `sessions` (
 `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
 `expires` int(11) unsigned NOT NULL,
 `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
 PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
usuarios	CREATE TABLE `usuarios` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `nombre` varchar(255) NOT NULL,
 `correo` varchar(255) NOT NULL,
 `telefono` varchar(20) DEFAULT NULL,
 `facultad` varchar(255) DEFAULT NULL,
 `rol` enum('organizador','asistente') NOT NULL,
 `configuraciones_accesibilidad` varchar(255) DEFAULT NULL,
 `foto` mediumblob DEFAULT NULL,
 `password` varchar(255) NOT NULL,
 PRIMARY KEY (`id`),
 UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci