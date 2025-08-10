# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/Blog-Application-AI-Intrigation-0.0.1-SNAPSHOT.jar .
EXPOSE 8080
CMD ["java", "-jar", "Blog-Application-AI-Intrigation-0.0.1-SNAPSHOT.jar"]
