package com.example.springboot;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@TestConfiguration
public class TestConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}