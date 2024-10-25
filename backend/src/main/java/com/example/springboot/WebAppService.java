package com.example.springboot;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class WebAppService {
    public List<WebAppController.Message> getChats() {
        return List.of(new WebAppController.Message("test", "test", Instant.now()));
    }
}
