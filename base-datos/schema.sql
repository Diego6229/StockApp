-- Esquema de la base de datos de StockApp (solo como referencia).
-- No hace falta ejecutarlo: al arrancar la aplicación, Spring Boot crea la base de datos
-- y las tablas automáticamente (createDatabaseIfNotExist + JPA ddl-auto=update)
-- y carga datos de ejemplo si está vacía (stock/config/DatosDemo.java).

CREATE DATABASE IF NOT EXISTS stock_db;
USE stock_db;

CREATE TABLE usuarios (
  id          BIGINT NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(255),
  contraseña  VARCHAR(255),          -- hash BCrypt
  rol         VARCHAR(255),          -- ADMIN o EMPLEADO
  foto        LONGTEXT,              -- imagen en base64
  PRIMARY KEY (id)
);

CREATE TABLE categorias (
  id      BIGINT NOT NULL AUTO_INCREMENT,
  nombre  VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE productos (
  id            BIGINT NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(255),
  precio        DOUBLE NOT NULL,
  stock_actual  INT NOT NULL,
  stock_minimo  INT NOT NULL,
  id_categoria  BIGINT,
  PRIMARY KEY (id),
  FOREIGN KEY (id_categoria) REFERENCES categorias (id)
);

CREATE TABLE movimientos_stock (
  id           BIGINT NOT NULL AUTO_INCREMENT,
  tipo         VARCHAR(255),         -- ENTRADA o SALIDA (venta)
  cantidad     INT NOT NULL,
  fecha        DATETIME(6),
  id_producto  BIGINT,
  id_usuario   BIGINT,
  PRIMARY KEY (id),
  FOREIGN KEY (id_producto) REFERENCES productos (id),
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
);
