package com.example.springboot;

import jakarta.transaction.Transactional;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WebAppService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private UserRepository userRepository;

    public MessageRequest addChat(MessageRequest messageRequest) {
        MessageEntity messageEntity = new MessageEntity();
        messageEntity.setMessage(messageRequest.getText());
        messageEntity.setSender(messageRequest.getUser());
        messageEntity.setRecipient(messageRequest.getRecipient());
        messageEntity.setSentAt(messageRequest.getTimestamp().toInstant());
        messageEntity = messageRepository.save(messageEntity);
        return new MessageRequest(messageEntity.getId(), messageEntity.getSender(), messageEntity.getRecipient(), messageEntity.getMessage(), Date.from(messageEntity.getSentAt()));
    }

    public List<MessageRequest> getChats() {
        return messageRepository
                .findAll()
                .stream()
                .map(message ->
                        new MessageRequest(message.getId(), message.getSender(), message.getRecipient(), message.getMessage(), Date.from(message.getSentAt())))
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
        Optional<UserEntity> optionalUser = userRepository.findByEmailAndPassword(userRequest.getEmail(), userRequest.getPassword());
        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();
            userRequest.setId(user.getUserId().toString());
            userRequest.setUsername(user.getUsername());
            return userRequest;
        }
        return null;
    }

    public FriendRequest addFriend(FriendRequest friend) {
        Optional<UserEntity> currentUser = userRepository.findById(UUID.fromString(friend.getUserId()));
        Optional<UserEntity> friendUser = userRepository.findById(UUID.fromString(friend.getFriendId()));
        if (currentUser.isPresent() && friendUser.isPresent()) {
            FriendEntity entity = new FriendEntity(UUID.fromString(friend.getUserId()), UUID.fromString(friend.getFriendId()));
            entity = friendRepository.save(entity);
            return new FriendRequest(entity.getUserId().toString(), entity.getFriendId().toString(), friend.getFriendEmail());
        }
        return null;
    }

    public List<FriendRequest> getFriends(String currentUser) {
        List<FriendEntity> friendEntities = friendRepository.findByUserId(UUID.fromString(currentUser));
        if (friendEntities.isEmpty()) {
            return List.of();
        }
        return friendEntities.stream()
                .map(friendEntity -> new FriendRequest(friendEntity.getUserId().toString(), friendEntity.getFriendId().toString(), ""))
                .toList();
    }

//    public void deleteFriend(String friendId) {
//    }
}
