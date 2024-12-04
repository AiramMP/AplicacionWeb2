-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-12-2024 a las 19:40:37
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aw_24`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracionaccesibilidad`
--

CREATE TABLE `configuracionaccesibilidad` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `paleta_colores` varchar(255) DEFAULT NULL,
  `tamano_texto` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `correos`
--

CREATE TABLE `correos` (
  `id` int(11) NOT NULL,
  `CorreoEmisor` varchar(255) NOT NULL,
  `CorreoReceptor` varchar(255) NOT NULL,
  `Asunto` varchar(100) NOT NULL,
  `Mensaje` text NOT NULL,
  `Fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `Visto` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `correos`
--

INSERT INTO `correos` (`id`, `CorreoEmisor`, `CorreoReceptor`, `Asunto`, `Mensaje`, `Fecha`, `Visto`) VALUES
(2, '2', '9', 'Nueva inscripción a tu evento', 'El usuario a@ucm.es se ha inscrito en tu evento con ID 2.', '2024-11-30 20:53:16', 1),
(3, '2', '9', 'Un usuario se ha desapuntado', 'El usuario a@ucm.es se ha desapuntado de tu evento con ID 2.', '2024-11-30 22:12:34', 0),
(4, '2', '1', 'Nueva inscripción a tu evento', 'El usuario a@ucm.es se ha inscrito en tu evento con ID 1.', '2024-11-30 22:12:41', 0),
(5, '2', '9', 'Nueva inscripción a tu evento', 'El usuario a@ucm.es se ha inscrito en tu evento con ID 2.', '2024-11-30 22:12:43', 0),
(6, '6', '1', 'Nueva inscripción a tu evento', 'El usuario b@ucm.es se ha inscrito en tu evento con ID 1.', '2024-11-30 22:12:53', 0),
(7, '6', '9', 'Nueva inscripción a tu evento', 'El usuario b@ucm.es se ha inscrito en tu evento con ID 2.', '2024-11-30 22:12:55', 0),
(8, '7', '9', 'Nueva inscripción a tu evento', 'El usuario c@ucm.es se ha inscrito en tu evento con ID 2.', '2024-11-30 22:13:02', 1),
(9, 'Sistema', '7', 'Has sido promovido al estado inscrito', 'Has sido promovido desde la lista de espera al estado inscrito en el evento: 2.', '2024-11-30 22:13:17', 0),
(10, 'Sistema', '9', 'Un usuario ha sido promovido', 'Un usuario ha sido promovido desde la lista de espera al estado inscrito en tu evento: 2.', '2024-11-30 22:13:17', 0),
(11, '7', '9', 'Nueva inscripción a tu evento', 'El usuario c@ucm.es se ha inscrito en tu evento con ID 2.', '2024-12-01 15:04:51', 1),
(12, '5', '9', 'Nueva inscripción a tu evento', 'El usuario d@ucm.es se ha inscrito en tu evento con ID 2.', '2024-12-01 15:06:19', 0),
(13, 'Sistema', '5', 'Has sido promovido al estado inscrito', 'Has sido promovido desde la lista de espera al estado inscrito en el evento: 2.', '2024-12-01 15:06:38', 0),
(14, 'Sistema', '9', 'Un usuario ha sido promovido', 'Un usuario ha sido promovido desde la lista de espera al estado inscrito en tu evento: 2.', '2024-12-01 15:06:38', 0),
(15, '5', '9', 'Nueva inscripción a tu evento', 'El usuario d@ucm.es se ha inscrito en tu evento con ID 2.', '2024-12-01 15:14:54', 0),
(16, 'Sistema', '5', 'Inscripción rechazada', 'Lamentamos informarte que no has sido aceptado en el evento: 2.', '2024-12-01 15:28:30', 0),
(17, '8', '9', 'Nueva inscripción a tu evento', 'El usuario e@ucm.es se ha inscrito en tu evento con ID 2.', '2024-12-01 15:31:03', 0),
(18, '2', '9', 'Un usuario se ha desapuntado', 'El usuario a@ucm.es se ha desapuntado de tu evento con ID 2.', '2024-12-01 15:31:14', 0),
(19, 'Sistema', '8', 'Has sido promovido al estado inscrito', 'Has sido promovido desde la lista de espera al estado inscrito en el evento: 2.', '2024-12-01 15:31:28', 0),
(20, 'Sistema', '9', 'Un usuario ha sido promovido', 'Un usuario ha sido promovido desde la lista de espera al estado inscrito en tu evento: 2.', '2024-12-01 15:31:28', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `capacidad_maxima` int(11) NOT NULL,
  `capacidad_restante` int(11) NOT NULL,
  `organizador_id` int(11) NOT NULL,
  `foto` mediumblob DEFAULT NULL,
  `tipo` enum('presencial','online') NOT NULL DEFAULT 'presencial'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos`
--



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `evento_id` int(11) NOT NULL,
  `estado_inscripcion` enum('inscrito','lista de espera') NOT NULL,
  `fecha_inscripcion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id`, `usuario_id`, `evento_id`, `estado_inscripcion`, `fecha_inscripcion`) VALUES
(30, 2, 1, 'inscrito', '2024-11-30 23:12:41'),
(32, 6, 1, 'inscrito', '2024-11-30 23:12:53'),
(33, 6, 2, 'inscrito', '2024-11-30 23:12:55'),
(37, 8, 2, 'inscrito', '2024-12-01 16:31:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('NyRZhf7Z_1Kjaiag_70wKDfCyWlPGOT4', 1733070919, '{\"cookie\":{\"originalMaxAge\":3600000,\"expires\":\"2024-12-01T16:34:41.014Z\",\"httpOnly\":true,\"path\":\"/\"},\"userId\":9,\"usuario\":\"admin@ucm.es\",\"foto\":null,\"nombre\":\"admin\",\"rol\":\"organizador\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `facultad` varchar(255) DEFAULT NULL,
  `rol` enum('organizador','asistente') NOT NULL,
  `configuraciones_accesibilidad` varchar(255) DEFAULT NULL,
  `foto` mediumblob DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `telefono`, `facultad`, `rol`, `configuraciones_accesibilidad`, `foto`, `password`) VALUES
(1, 'm', 'm1@ucm.es', '123456789', 'Bellas Artes', 'organizador', NULL, NULL, '123'),
(2, 'a', 'a@ucm.es', '123456789', 'Informatica', 'asistente', NULL, NULL, '123'),
(5, 'd', 'd@ucm.es', '123456789', 'Bellas Artes', 'asistente', NULL, NULL, '123'),
(6, 'b', 'b@ucm.es', '123456789', 'Enfermeria, Fisioterapia y Podologia', 'asistente', NULL, NULL, '123'),
(7, 'c', 'c@ucm.es', '123456789', 'Optica y Optometria', 'asistente', NULL, NULL, '123'),
(8, 'e', 'e@ucm.es', '123456798', 'Medicina', 'asistente', NULL, NULL, '123'),
(9, 'admin', 'admin@ucm.es', '123456789', 'Filosofia', 'organizador', NULL, NULL, '123');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `configuracionaccesibilidad`
--
ALTER TABLE `configuracionaccesibilidad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `correos`
--
ALTER TABLE `correos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizador_id` (`organizador_id`);

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `evento_id` (`evento_id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `configuracionaccesibilidad`
--
ALTER TABLE `configuracionaccesibilidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `correos`
--
ALTER TABLE `correos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `configuracionaccesibilidad`
--
ALTER TABLE `configuracionaccesibilidad`
  ADD CONSTRAINT `configuracionaccesibilidad_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`organizador_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
