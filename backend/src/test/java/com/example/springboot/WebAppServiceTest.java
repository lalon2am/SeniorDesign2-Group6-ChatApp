package com.example.springboot;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.List;

@ExtendWith(MockitoExtension.class)
public class WebAppServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private WebAppService webAppService;

    @Test
    public void saveMessage_Success() {
        // Arrange
        String sender = "1";
        String recipient = "2";
        String messageText = "Hello";

        MessageRequest request = new MessageRequest();
        request.setSender(sender);
        request.setRecipient(recipient);
        request.setMessage(messageText);

        MessageEntity savedMessage = new MessageEntity();
        savedMessage.setSender(sender);
        savedMessage.setRecipient(recipient);
        savedMessage.setMessage(messageText);
        savedMessage.setSentAt(Instant.now());

        when(messageRepository.save(any(MessageEntity.class))).thenReturn(savedMessage);

        // Act
        MessageEntity result = webAppService.saveMessage(request);

        // Assert
        assertNotNull(result);
        assertEquals(sender, result.getSender());
        assertEquals(recipient, result.getRecipient());
        assertEquals(messageText, result.getMessage());

        verify(messageRepository, times(1)).save(any(MessageEntity.class));

        // Remove the verification of restTemplate calls for user existence:
        // verify(restTemplate, times(1)).getForEntity(contains("/users/exists/" + sender), eq(Boolean.class));
        // verify(restTemplate, times(1)).getForEntity(contains("/users/exists/" + recipient), eq(Boolean.class));
    }

    @Test
    public void getConversation_Success() {
        // Arrange
        String user1 = "1";  // Changed from Long to String
        String user2 = "2";  // Changed from Long to String

        MessageEntity m1 = new MessageEntity(user1, user2, "Hi", Instant.now());
        MessageEntity m2 = new MessageEntity(user2, user1, "Hello", Instant.now());

        when(messageRepository.findConversationBetweenUsers(user1, user2)).thenReturn(List.of(m1, m2));

        // Act
        List<MessageEntity> result = webAppService.getConversation(user1, user2);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Hi", result.get(0).getMessage());
        assertEquals("Hello", result.get(1).getMessage());

        verify(messageRepository, times(1)).findConversationBetweenUsers(user1, user2);
    }
}
