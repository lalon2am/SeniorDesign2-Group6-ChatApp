package com.example.springboot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class WebAppController {
    @Autowired
    private WebAppService service;

    @PostMapping("/")
    public ResponseEntity<String> addMessage(@RequestBody MessageEntity messageEntity) {
        // Display the raw JSON input
        //System.out.println("Received raw JSON message: " + jsonMessage);

        try {
            // Use ObjectMapper to convert the JSON string to a Message object
//            ObjectMapper objectMapper = new ObjectMapper();
//            Message message = objectMapper.readValue(jsonMessage, Message.class);

            // Display the formatted output
            System.out.println("Formatted output: " + messageEntity.getSender() + ": " + messageEntity.getMessage() + " " + messageEntity.getSentAt());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error parsing JSON: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<MessageRequest>> getMessages() {
        List<MessageRequest> messageEntity = service.getChats();
        if (messageEntity.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(messageEntity);
    }

	@PostMapping("/addfriend")
    public String addfriend(@RequestBody String username) {
        
		return "No friend found";
	}
//    @GetMapping("/")
//    public String index() {
//        return "Greetings from Spring Boot!";
//    }
}
