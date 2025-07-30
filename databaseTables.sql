

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cliente_id_tracker`
--

DROP TABLE IF EXISTS `cliente_id_tracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_id_tracker` (
  `cliente` varchar(100) NOT NULL,
  `ultimo_id` bigint DEFAULT NULL,
  PRIMARY KEY (`cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_id_tracker`
--

LOCK TABLES `cliente_id_tracker` WRITE;
/*!40000 ALTER TABLE `cliente_id_tracker` DISABLE KEYS */;
/*!40000 ALTER TABLE `cliente_id_tracker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_audiencias`
--

DROP TABLE IF EXISTS `data_audiencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_audiencias` (
  `id_global` int NOT NULL AUTO_INCREMENT,
  `id_unico` varchar(20) DEFAULT NULL,
  `cliente` varchar(100) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `dev` varchar(20) DEFAULT NULL,
  `qa` varchar(20) DEFAULT NULL,
  `prod` varchar(20) DEFAULT NULL,
  `detalles` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_global`),
  UNIQUE KEY `unique_cliente_idunico` (`cliente`,`id_unico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_audiencias`
--

LOCK TABLES `data_audiencias` WRITE;
/*!40000 ALTER TABLE `data_audiencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_audiencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_data_audiencias`
--

DROP TABLE IF EXISTS `log_data_audiencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_data_audiencias` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `accion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `estado` enum('ANTES','DESPUES') DEFAULT NULL,
  `id_global` int DEFAULT NULL,
  `id_unico` varchar(20) DEFAULT NULL,
  `cliente` varchar(100) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `dev` varchar(20) DEFAULT NULL,
  `qa` varchar(20) DEFAULT NULL,
  `prod` varchar(20) DEFAULT NULL,
  `detalles` varchar(100) DEFAULT NULL,
  `fecha_cambio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_data_audiencias`
--

LOCK TABLES `log_data_audiencias` WRITE;
/*!40000 ALTER TABLE `log_data_audiencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_data_audiencias` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-26 11:27:21 

-- Tabla de usuarios
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `fecha_registro` timestamp DEFAULT CURRENT_TIMESTAMP,
  `activo` boolean DEFAULT true,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`),
  CONSTRAINT `check_email_domain` CHECK (`email` LIKE '%@avaldigitallabs.com')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de sesiones (opcional, para manejo de sesiones)
CREATE TABLE `sesiones` (
  `id` varchar(128) NOT NULL,
  `usuario_id` int NOT NULL,
  `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
  `fecha_expiracion` timestamp NOT NULL,
  `activa` boolean DEFAULT true,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Modificar tabla de logs para incluir información del usuario
ALTER TABLE `log_data_audiencias` 
ADD COLUMN `usuario_id` int DEFAULT NULL,
ADD COLUMN `usuario_nombre` varchar(100) DEFAULT NULL,
ADD COLUMN `usuario_email` varchar(150) DEFAULT NULL,
ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL;

-- Insertar usuario administrador por defecto (opcional)
INSERT INTO `usuarios` (`nombre`, `email`, `password_hash`) 
VALUES ('Administrador', 'admin@avaldigitallabs.com', '$2b$10$defaulthashforadmin'); 