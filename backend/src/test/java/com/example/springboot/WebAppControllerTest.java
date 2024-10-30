package com.example.springboot;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc
public class WebAppControllerTest {

	@Autowired
	private MockMvc mvc;

	@MockBean
	private WebAppService service;

//	@Test
//	public void getHello() throws Exception {
//		mvc.perform(MockMvcRequestBuilders.get("/").accept(MediaType.APPLICATION_JSON))
//				.andExpect(status().isOk())
//				.andExpect(content().string(equalTo("Greetings from Spring Boot!")));
//	}

	@Test
	public void getChats() throws Exception {
		// arrange
		ObjectMapper mapper = new ObjectMapper();
		JavaTimeModule module = new JavaTimeModule();
		mapper.registerModule(module);
		mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

		MessageRequest message = new MessageRequest(0L, "test", "test", Date.from(Instant.now()));
		String expected = mapper.writeValueAsString(List.of(message));

		when(service.getChats()).thenReturn(List.of(message));

		// act
		MvcResult result = mvc.perform(MockMvcRequestBuilders.get("/").accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk()).andReturn();
		String responseString = result.getResponse().getContentAsString();

		// assert
		assertEquals(expected, responseString);
	}

	@Test
	public void emptyChatsReturnsNoContent() throws Exception {
		// arrange
		when(service.getChats()).thenReturn(List.of());

		// act
		MvcResult result = mvc.perform(MockMvcRequestBuilders.get("/").accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent()).andReturn();
		String responseString = result.getResponse().getContentAsString();

		// assert
		assertEquals("", responseString);
	}
}