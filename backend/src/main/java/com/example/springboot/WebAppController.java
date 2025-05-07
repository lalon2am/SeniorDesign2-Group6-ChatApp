// File: WebAppController.java
package com.example.springboot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class WebAppController {

    @Autowired
    private WebAppService webAppService;

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest messageRequest) {
        try {
            MessageEntity savedMessage = webAppService.saveMessage(messageRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
        } catch (IllegalArgumentException e) {
            // Return the error message in a JSON format
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            // Handle other potential exceptions and return a JSON error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to save message: " + e.getMessage()));
        }
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<MessageEntity>> getConversation(
            @RequestParam String user1,
            @RequestParam String user2) {
        List<MessageEntity> conversation = webAppService.getConversation(user1, user2);
        return ResponseEntity.ok(conversation);
    }

    // Endpoint to get all messages - CORRECTED METHOD CALL
    @GetMapping
    public ResponseEntity<List<MessageEntity>> getMessages() {
        List<MessageEntity> allMessages = webAppService.getAllMessages();
        return ResponseEntity.ok(allMessages);
    }
}