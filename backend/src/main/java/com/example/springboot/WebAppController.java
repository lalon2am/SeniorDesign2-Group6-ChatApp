package com.example.springboot;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> addfriend(@RequestBody FriendRequest friend) {

        // verify friend user exists and current exists
        // updates friends table with link between users
		return ResponseEntity.ok("No friend found");
	}

    @GetMapping("/getfriend")
    public ResponseEntity<List<FriendRequest>> getFriends(@RequestParam("userId") String currentUser) {
        // verify current user exists
        // retrieve list of friend ids
        // retireve friend info from user table
        return ResponseEntity.internalServerError().build();
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRequest user) {
        return ResponseEntity.internalServerError().build();
    }

    @GetMapping("/login")
    public ResponseEntity<UserRequest> login(@RequestBody UserRequest user) {
        return ResponseEntity.internalServerError().build();
    }
    // login

}
