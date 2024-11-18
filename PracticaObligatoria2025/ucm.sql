-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS AW_24;
USE AW_24;

-- Tabla de Usuarios
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    facultad VARCHAR(255), -- Ahora se almacena como texto
    rol ENUM('organizador', 'asistente') NOT NULL,
    configuraciones_accesibilidad VARCHAR(255),
    foto MEDIUMBLOB, -- Campo para almacenar la foto de perfil
    password VARCHAR(255) NOT NULL -- Campo para la contraseña
);

-- Tabla de Configuración de Accesibilidad
CREATE TABLE ConfiguracionAccesibilidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    paleta_colores VARCHAR(255),
    tamano_texto VARCHAR(50),
    configuracion_navegacion VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabla de Eventos
CREATE TABLE Eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    capacidad_maxima INT NOT NULL,
    organizador_id INT NOT NULL,
    foto MEDIUMBLOB, -- Campo para almacenar la foto del evento
    FOREIGN KEY (organizador_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabla de Inscripciones
CREATE TABLE Inscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    evento_id INT NOT NULL,
    estado_inscripcion ENUM('inscrito', 'lista de espera') NOT NULL,
    fecha_inscripcion DATETIME NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES Eventos(id) ON DELETE CASCADE
);
