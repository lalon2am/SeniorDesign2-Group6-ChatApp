package com.example.springboot;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class WebAppService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private UserRepository userRepository;

    public List<MessageRequest> getChats() {
        return messageRepository
                .findAll()
                .stream()
                .map(message ->
                        new MessageRequest(message.getId(), message.getSender(), message.getMessage(), Date.from(message.getSentAt())))
                .toList();
    }

    public UserRequest register(UserRequest userRequest) {
        if (userRepository.findByEmail(userRequest.getEmail()).isEmpty()) {
            UserEntity createdUser = new UserEntity();
            createdUser.setEmail(userRequest.getEmail());
            createdUser.setPassword(userRequest.getPassword());
            createdUser.setUsername(userRequest.getUsername());
            userRepository.save(createdUser);
            userRequest.setId(createdUser.getUserId().toString());
            return userRequest;
        }
        return null;
    }

    public UserRequest login(UserRequest userRequest) {
        // get user with email and password
        // return entity w/ info
        return null;
    }
}
