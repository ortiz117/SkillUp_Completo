-- ==========================================================
-- BASE DE DATOS: skillup_db
-- Compatible con PostgreSQL

-- ==========================================================
-- TABLAS BASE
-- ==========================================================

-- 🧩 Carreras
CREATE TABLE carreras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- 📘 Materias
CREATE TABLE materias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- 👤 Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('ESTUDIANTE', 'TUTOR', 'ADMIN')),
    carrera_id INT,
    CONSTRAINT fk_carrera_usuario FOREIGN KEY (carrera_id) REFERENCES carreras(id)
);

-- 🎓 Tutores (relación 1 a 1 con usuarios)
CREATE TABLE tutores (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    biografia TEXT,
    calificacion_promedio NUMERIC(3,2) DEFAULT 0,
    CONSTRAINT fk_usuario_tutor FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Relación muchos a muchos entre tutores y materias
CREATE TABLE tutores_materias (
    tutor_id INT NOT NULL,
    materia_id INT NOT NULL,
    PRIMARY KEY (tutor_id, materia_id),
    CONSTRAINT fk_tutor_materia_tutor FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE CASCADE,
    CONSTRAINT fk_tutor_materia_materia FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

-- 📜 Certificaciones
CREATE TABLE certificaciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    carrera_id INT,
    CONSTRAINT fk_carrera_certificacion FOREIGN KEY (carrera_id) REFERENCES carreras(id)
);

-- 📚 Certificaciones obtenidas
CREATE TABLE certificaciones_obtenidas (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    certificacion_id INT NOT NULL,
    fecha_obtenida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calificacion NUMERIC(5,2),
    estado VARCHAR(20) CHECK (estado IN ('PENDIENTE', 'APROBADO', 'RECHAZADO')) DEFAULT 'PENDIENTE',
    CONSTRAINT fk_cert_obt_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_cert_obt_certificacion FOREIGN KEY (certificacion_id) REFERENCES certificaciones(id) ON DELETE CASCADE
);

-- 💬 Sesiones de tutoría
CREATE TABLE sesiones_tutoria (
    id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL,
    tutor_id INT NOT NULL,
    materia_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    modalidad VARCHAR(20) CHECK (modalidad IN ('EN_LINEA', 'PRESENCIAL')) NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('SOLICITADA', 'ACEPTADA', 'CANCELADA', 'COMPLETADA')) DEFAULT 'SOLICITADA',
    descripcion TEXT,
    CONSTRAINT fk_sesion_alumno FOREIGN KEY (alumno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_sesion_tutor FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE CASCADE,
    CONSTRAINT fk_sesion_materia FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

-- ==========================================================
-- ÍNDICES Y OPTIMIZACIONES
-- ==========================================================
CREATE INDEX idx_usuario_correo ON usuarios(correo);
CREATE INDEX idx_sesion_estado ON sesiones_tutoria(estado);
CREATE INDEX idx_certificacion_nombre ON certificaciones(nombre);
CREATE INDEX idx_tutor_calificacion ON tutores(calificacion_promedio);

-- ==========================================================
-- DATOS DE EJEMPLO
-- ==========================================================

INSERT INTO carreras (nombre) VALUES 
('Ingeniería en Software'),
('Ciencias Computacionales'),
('Administración de Empresas');

INSERT INTO materias (nombre) VALUES 
('Programación Java'),
('Base de Datos'),
('Redes de Computadoras'),
('Análisis de Sistemas');

-- Usuarios
INSERT INTO usuarios (nombre, correo, contrasena, rol, carrera_id) VALUES
('Isaac Ortiz', 'isaac@skillup.com', 'hashed_password_1', 'ADMIN', NULL),
('Carlos López', 'carlos@skillup.com', 'hashed_password_2', 'ESTUDIANTE', 1),
('Laura Pérez', 'laura@skillup.com', 'hashed_password_3', 'TUTOR', 2);

-- Tutor vinculado
INSERT INTO tutores (usuario_id, biografia, calificacion_promedio) VALUES
(3, 'Especialista en bases de datos y desarrollo web.', 4.8);

-- Materias que enseña el tutor
INSERT INTO tutores_materias (tutor_id, materia_id) VALUES
(1, 2),  -- Tutor enseña Base de Datos
(1, 1);  -- Tutor enseña Programación Java

-- Certificaciones
INSERT INTO certificaciones (nombre, descripcion, carrera_id) VALUES
('Certificación en Java Avanzado', 'Domina conceptos avanzados de Java y OOP', 1),
('Certificación en Redes', 'Diseño e implementación de redes LAN y WAN', 2);

-- Sesión de tutoría de ejemplo
INSERT INTO sesiones_tutoria (alumno_id, tutor_id, materia_id, fecha, hora, modalidad, estado, descripcion) VALUES
(2, 1, 2, '2025-10-15', '10:00', 'EN_LINEA', 'SOLICITADA', 'Necesito repaso de SQL y consultas avanzadas.');

