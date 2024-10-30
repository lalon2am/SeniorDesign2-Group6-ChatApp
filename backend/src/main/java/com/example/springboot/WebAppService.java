package com.example.springboot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class WebAppService {
    @Autowired
    private MessageRepository messageRepository;

    public List<MessageRequest> getChats() {
        return messageRepository
                .findAll()
                .stream()
                .map(message ->
                        new MessageRequest(message.getId(), message.getSender(), message.getMessage(), Date.from(message.getSentAt())))
                .toList();
    }
}
