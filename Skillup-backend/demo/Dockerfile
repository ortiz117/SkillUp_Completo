# ----- ETAPA 1: Construcción (Build) -----
# Usamos una imagen de Maven con Java 21 para construir el proyecto
FROM maven:3.9-eclipse-temurin-21 AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos primero el pom.xml para aprovechar el caché de Docker
COPY pom.xml .

# Copiamos el código fuente
COPY src ./src

# Ejecutamos el comando de Maven para construir el .jar (sin tests)
RUN mvn package -DskipTests


# ----- ETAPA 2: Ejecución (Run) -----
# Usamos la imagen ligera de Java 21 que ya tenías
FROM openjdk:21-slim

WORKDIR /app

# Copiamos SOLAMENTE el .jar de la etapa anterior (builder)
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]