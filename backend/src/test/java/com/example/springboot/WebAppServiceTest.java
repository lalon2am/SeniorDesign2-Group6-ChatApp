package com.example.springboot;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.Instant;
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
		List<MessageEntity> expected = List.of(new MessageEntity(0L, "test", "test", "test", Instant.MIN));

		when(repository.findAll()).thenReturn(expected);

		// act
		List<MessageEntity> result = service.getChats();

		// assert
		assertEquals(expected, result);
	}
}