package com.example.springboot;

import org.springframework.messaging.handler.annotation.MessageMapping;

public class GroupController {
     private GroupManagement groupManagement = new GroupManagement();

    @MessageMapping("/chat")
    public void processMessage(MessageRequest message) {
        if (message.getGroupId() != null) {
            GroupManagement.Group group = groupManagement.getGroup(message.getGroupId());
            if (group != null) {
                for (String member : group.getMembers()) {
                    // Send message to each group member
                    System.out.println("Sending message to: " + member);
                    // Implement your message sending logic here
                }
            }
        } else if (message.getRecipient() != null) {
            // Handle direct message
            // Implement your message sending logic here
        }
    }
}
