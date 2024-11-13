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

	@PostMapping("/addFriend")
    public ResponseEntity<FriendRequest> addfriend(@RequestBody FriendRequest friend) {
        FriendRequest savedFriend = service.addFriend(friend);
        if (savedFriend != null)
		    return ResponseEntity.ok(savedFriend);
        return ResponseEntity.internalServerError().build();
	}

    @GetMapping("/getFriends")
    public ResponseEntity<List<FriendRequest>> getFriends(@RequestParam("userId") String currentUser) {
        List<FriendRequest> friends = service.getFriends(currentUser);
        if (friends == null)
            return ResponseEntity.internalServerError().build();
        if (friends.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(friends);
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<FriendRequest> deleteFriend(@PathVariable String id) {
//        FriendRequest deletedFriend = service.deleteFriend(id);
//        if (deletedFriend != null)
//            return ResponseEntity.ok(deletedFriend);
//        return ResponseEntity.internalServerError().build();
//    }
    @PostMapping("/register")
    public ResponseEntity<UserRequest> registerUser(@RequestBody UserRequest user) {
        UserRequest userResponse = service.register(user);
        if (userResponse != null)
            return ResponseEntity.ok(userResponse);
        return ResponseEntity.internalServerError().build();
    }

    @GetMapping("/login")
    public ResponseEntity<UserRequest> login(@RequestBody UserRequest user) {
        UserRequest userResponse = service.login(user);
        if (userResponse != null)
            return ResponseEntity.ok(userResponse);
        return ResponseEntity.internalServerError().build();
    }
}
