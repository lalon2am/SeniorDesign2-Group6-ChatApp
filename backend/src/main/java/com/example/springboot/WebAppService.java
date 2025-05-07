// File: WebAppService.java
package com.example.springboot;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.List;

@Service
public class WebAppService {

    private static final Logger logger = LoggerFactory.getLogger(WebAppService.class);

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String NODE_API_URL = "http://localhost:3000/api";

    @Transactional
    public MessageEntity saveMessage(MessageRequest messageRequest) {
        String sender = messageRequest.getSender();
        String recipient = messageRequest.getRecipient();

        // Verify users exist via Node.js API
        // if (!verifyUserExists(sender)) {
        //     throw new IllegalArgumentException("Sender does not exist: " + sender);
        // }
        // if (!verifyUserExists(recipient)) {
        //     throw new IllegalArgumentException("Recipient does not exist: " + recipient);
        // }

        // Create the message entity and save
        MessageEntity message = new MessageEntity(
                sender,
                recipient,
                messageRequest.getMessage(),
                Instant.now()
        );

        return messageRepository.save(message);
    }

    public List<MessageEntity> getConversation(String user1, String user2) {
        logger.info("Getting conversation between: {} and {}", user1, user2);

        if (user1 == null || user2 == null) {
            throw new IllegalArgumentException("User IDs must not be null");
        }

        return messageRepository.findConversationBetweenUsers(user1, user2);
    }

    private boolean verifyUserExists(String userId) {
        String userExistsUrl = NODE_API_URL + "/users/exists/" + userId;
        try {
            ResponseEntity<Boolean> response = restTemplate.getForEntity(userExistsUrl, Boolean.class);
            return response.getStatusCode().is2xxSuccessful() && Boolean.TRUE.equals(response.getBody());
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) {
                logger.warn("User with ID {} not found on Node.js backend.", userId);
                return false;
            } else {
                logger.error("Error verifying user existence for userId: {}. Status: {}", userId, ex.getStatusCode(), ex);
                return false;
            }
        } catch (Exception e) {
            logger.error("Error verifying user existence for userId: {}", userId, e);
            return false;
        }
    }

    private boolean verifyFriendship(String user1, String user2) {
        try {
            return restTemplate.getForObject(
                    NODE_API_URL + "/friends/verify?user1=" + user1 + "&user2=" + user2,
                    Boolean.class
            );
        } catch (Exception e) {
            return false;
        }
    }

    // Method to retrieve all messages
    public List<MessageEntity> getAllMessages() {
        return messageRepository.findAll();
    }
}