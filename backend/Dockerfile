FROM openjdk:21-jdk

WORKDIR /app

# Install xargs (findutils package)
RUN microdnf update && microdnf install -y findutils

# Copy the Gradle wrapper and settings files
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle settings.gradle ./

# Ensure the Gradle wrapper has execute permissions
RUN chmod +x ./gradlew

# Download dependencies without building the app
RUN ./gradlew build -x test --no-daemon

# Copy the source code
COPY src ./src

# Command to run the Spring Boot app using the Gradle wrapper
CMD ["./gradlew", "bootRun", "--no-daemon"]
