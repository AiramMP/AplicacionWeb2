-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-12-2024 a las 22:36:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

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

--
-- Volcado de datos para la tabla `configuracionaccesibilidad`
--

INSERT INTO `configuracionaccesibilidad` (`id`, `usuario_id`, `paleta_colores`, `tamano_texto`) VALUES
(3, 10, 'alto-contraste', 'grande');

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
(21, 'Sistema', '10', 'Evento creado exitosamente', 'Tu evento \"Charla sobre Aplicaciones Web\" ha sido creado con éxito.', '2024-12-04 19:28:28', 0),
(22, '11', '10', 'Nueva inscripción a tu evento', 'El usuario Mike@ucm.es se ha inscrito en tu evento: Charla sobre Aplicaciones Web.', '2024-12-04 19:41:48', 0),
(23, 'Sistema', '11', 'Inscripción exitosa al evento', 'Te has inscrito exitosamente al evento: Charla sobre Aplicaciones Web.', '2024-12-04 19:41:48', 0),
(24, 'Sistema', '11', 'Te has desapuntado de un evento', 'Has cancelado tu inscripción al evento: Charla sobre Aplicaciones Web.', '2024-12-04 19:41:54', 0),
(25, '11', '10', 'Un usuario se ha desapuntado', 'El usuario Mike@ucm.es se ha desapuntado de tu evento: Charla sobre Aplicaciones Web.', '2024-12-04 19:41:54', 0),
(26, 'Sistema', '11', 'Inscripción exitosa al evento', 'Te has inscrito exitosamente al evento: Charla sobre Aplicaciones Web.', '2024-12-04 19:42:00', 0),
(27, '11', '10', 'Nueva inscripción a tu evento', 'El usuario Mike@ucm.es se ha inscrito en tu evento: Charla sobre Aplicaciones Web.', '2024-12-04 19:42:00', 0),
(28, 'Sistema', '10', 'Añadido a la lista de espera', 'Has sido añadido a la lista de espera para el evento: Charla sobre Aplicaciones Web.', '2024-12-04 19:44:48', 0),
(29, '10', '10', 'Nueva inscripción a tu evento', 'El usuario airammar@ucm.es se ha inscrito en tu evento: Charla sobre Aplicaciones Web.', '2024-12-04 19:44:48', 0),
(30, 'Sistema', '10', 'Inscripción rechazada', 'Lamentamos informarte que no has sido aceptado en el evento: Charla sobre Aplicaciones Web.', '2024-12-04 19:45:15', 0),
(31, 'Sistema', '10', 'Añadido a la lista de espera', 'Has sido añadido a la lista de espera para el evento: Charla sobre Aplicaciones Web.', '2024-12-04 19:45:20', 0),
(32, '10', '10', 'Nueva inscripción a tu evento', 'El usuario airammar@ucm.es se ha inscrito en tu evento: Charla sobre Aplicaciones Web.', '2024-12-04 19:45:20', 0),
(33, 'Sistema', '10', 'Has sido promovido al estado inscrito', 'Has sido promovido desde la lista de espera al estado inscrito en el evento: Charla sobre Aplicaciones Web.', '2024-12-04 20:00:49', 0),
(34, 'Sistema', '10', 'Un usuario ha sido promovido', 'Un usuario ha sido promovido desde la lista de espera al estado inscrito en tu evento: Charla sobre Aplicaciones Web.', '2024-12-04 20:00:49', 0),
(35, '10', '10', 'Un usuario se ha desapuntado', 'El usuario airammar@ucm.es se ha desapuntado de tu evento: Charla sobre Aplicaciones Web.', '2024-12-04 21:23:23', 0),
(36, 'Sistema', '10', 'Te has desapuntado de un evento', 'Has cancelado tu inscripción al evento: Charla sobre Aplicaciones Web.', '2024-12-04 21:23:23', 0),
(37, 'Sistema', '10', 'Inscripción exitosa al evento', 'Te has inscrito exitosamente al evento: Charla sobre Aplicaciones Web.', '2024-12-04 21:23:40', 0),
(38, '10', '10', 'Nueva inscripción a tu evento', 'El usuario airammar@ucm.es se ha inscrito en tu evento: Charla sobre Aplicaciones Web.', '2024-12-04 21:23:40', 0),
(39, 'Sistema', '10', 'Te has desapuntado de un evento', 'Has cancelado tu inscripción al evento: Charla sobre Aplicaciones Web.', '2024-12-04 21:23:52', 0),
(40, '10', '10', 'Un usuario se ha desapuntado', 'El usuario airammar@ucm.es se ha desapuntado de tu evento: Charla sobre Aplicaciones Web.', '2024-12-04 21:23:52', 0);

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

INSERT INTO `eventos` (`id`, `titulo`, `descripcion`, `fecha`, `hora`, `ubicacion`, `capacidad_maxima`, `capacidad_restante`, `organizador_id`, `foto`, `tipo`) VALUES
(3, 'Charla sobre Aplicaciones Web', 'Charla sobre Aplicaciones Web por un experto con más de 20 años de experiencia.', '2024-12-11', '10:30:00', 'Aula 16 Facultad de Informática', 24, 23, 10, NULL, 'online');

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
(37, 8, 2, 'inscrito', '2024-12-01 16:31:03'),
(39, 11, 3, 'inscrito', '2024-12-04 20:42:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(10, 'Airam', 'airammar@ucm.es', '987654321', 'Informatica', 'organizador', NULL, NULL, '1234'),
(11, 'Mike', 'Mike@ucm.es', '987654321', 'Informatica', 'asistente', NULL, NULL, '1234');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `correos`
--
ALTER TABLE `correos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
