package com.example.springboot;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebAppController {

    // Create a nested class to represent the message structure
    public static class Message {
        private String text;
        private String user;
        private String timestamp;

        // Getters and Setters
        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public String getUser() {
            return user;
        }

        public void setUser(String user) {
            this.user = user;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(String timestamp) {
            this.timestamp = timestamp;
        }
    }

    @PostMapping("/")
    public void addMessage(@RequestBody String jsonMessage) {
        // Display the raw JSON input
        System.out.println("Received raw JSON message: " + jsonMessage);

        try {
            // Use ObjectMapper to convert the JSON string to a Message object
            ObjectMapper objectMapper = new ObjectMapper();
            Message message = objectMapper.readValue(jsonMessage, Message.class);

            // Display the formatted output
            System.out.println("Formatted output: " + message.getUser() + ": " + message.getText() + " " + message.getTimestamp());
        } catch (Exception e) {
            System.err.println("Error parsing JSON: " + e.getMessage());
        }
    }

    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }
}
