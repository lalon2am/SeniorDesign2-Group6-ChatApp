package com.example.springboot;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.flyway.enabled=false"
})
public class WebAppControllerTest {

    @Autowired
    private MockMvc mvc;

    private ObjectMapper objectMapper;

    @MockBean
    private WebAppService webAppService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    public void sendMessage_Success() throws Exception {
        MessageEntity testMessage = new MessageEntity();
        testMessage.setId(100L);
        testMessage.setSender("1");
        testMessage.setRecipient("2");
        testMessage.setMessage("Hello");
        testMessage.setSentAt(Instant.parse("2023-01-01T00:00:00Z"));

        MessageRequest request = new MessageRequest();
        request.setSender("1");
        request.setRecipient("2");
        request.setMessage("Hello");

        when(webAppService.saveMessage(any(MessageRequest.class))).thenReturn(testMessage);

        MvcResult result = mvc.perform(MockMvcRequestBuilders.post("/api/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated()) // Expecting 201 Created on success
                .andReturn();

        MessageEntity response = objectMapper.readValue(result.getResponse().getContentAsString(), MessageEntity.class);

        assertEquals(testMessage.getSender(), response.getSender());
        assertEquals(testMessage.getRecipient(), response.getRecipient());
        assertEquals(testMessage.getMessage(), response.getMessage());
        assertEquals(testMessage.getSentAt(), response.getSentAt());
        assertNotNull(response.getId());
    }

    @Test
    public void sendMessage_SenderDoesNotExist_ReturnsBadRequestWithErrorMessage() throws Exception {
        MessageRequest request = new MessageRequest();
        request.setSender("nonExistentSender");
        request.setRecipient("2");
        request.setMessage("Hello");

        String errorMessage = "Sender does not exist: nonExistentSender";
        when(webAppService.saveMessage(any(MessageRequest.class))).thenThrow(new IllegalArgumentException(errorMessage));

        MvcResult result = mvc.perform(MockMvcRequestBuilders.post("/api/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)) // Expect JSON response
                .andReturn();

        Map<String, String> errorResponse = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                new TypeReference<>() {}
        );

        assertEquals(errorMessage, errorResponse.get("message"));
    }

    @Test
    public void getConversation_Success() throws Exception {
        Instant fixedTimestamp = Instant.parse("2023-01-01T00:00:00Z");
        List<MessageEntity> mockMessages = List.of(
                new MessageEntity(
                        "1",
                        "2",
                        "Hi",
                        fixedTimestamp
                )
        );

        when(webAppService.getConversation("1", "2"))
                .thenReturn(mockMessages);

        MvcResult result = mvc.perform(MockMvcRequestBuilders.get("/api/messages/conversation")
                        .param("user1", "1")
                        .param("user2", "2"))
                .andExpect(status().isOk())
                .andReturn();

        List<MessageEntity> response = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                new TypeReference<>() {}
        );

        assertEquals(1, response.size());
        assertEquals("Hi", response.get(0).getMessage());
    }
}