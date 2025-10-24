# ----- ETAPA 1: Construcción (Build) -----
# Usa una imagen de Maven con Java 21 para compilar el proyecto.
FROM maven:3.9-eclipse-temurin-21 AS builder

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copia primero el pom.xml para aprovechar el caché de Docker.
# Solo volverá a descargar dependencias si el pom.xml cambia.
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia el resto del código fuente.
COPY src ./src

# Ejecuta el comando de Maven para construir el .jar ejecutable.
# -DskipTests se salta las pruebas para acelerar la construcción.
RUN mvn package -DskipTests


# ----- ETAPA 2: Ejecución (Run) -----
# Usa una imagen de Java 21 optimizada y ligera (sin Maven).
FROM openjdk:21-slim

# Establece el directorio de trabajo.
WORKDIR /app

# Copia SOLAMENTE el archivo .jar generado en la etapa anterior.
# Esto hace que la imagen final sea mucho más pequeña.
COPY --from=builder /app/target/*.jar app.jar

# Expone el puerto en el que corre la aplicación Spring Boot.
EXPOSE 8080

# Comando que se ejecutará cuando el contenedor arranque.
ENTRYPOINT ["java", "-jar", "app.jar"]