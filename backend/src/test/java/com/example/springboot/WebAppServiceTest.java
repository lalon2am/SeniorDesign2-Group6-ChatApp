package com.example.springboot;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@SpringBootTest
public class WebAppServiceTest {
	@Autowired
	private WebAppService service;

	@MockBean
	private MessageRepository repository;

	@Test
	public void getChats() throws Exception {
		// arrange
		MessageEntity message = new MessageEntity(0L, "test", "test", "test", Instant.now());
		List<MessageRequest> expected = List.of(new MessageRequest(message.getId(), message.getSender(), message.getMessage(), Date.from(message.getSentAt())));

		when(repository.findAll()).thenReturn(List.of(message));

		// act
		List<MessageRequest> result = service.getChats();

		// assert
		assertEquals(expected, result);
	}
}