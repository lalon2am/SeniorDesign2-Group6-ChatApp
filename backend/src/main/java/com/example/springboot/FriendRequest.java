package com.example.springboot;

import java.util.UUID;

public class FriendRequest {
    private UUID userId;

    private UUID friendId;

    private String friendEmail;

    public FriendRequest() {

    }

    public FriendRequest(UUID userId, UUID friendId, String friendEmail) {
        this.userId = userId;
        this.friendId = friendId;
        this.friendEmail = friendEmail;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getFriendId() {
        return friendId;
    }

    public String getFriendEmail() {
        return friendEmail;
    }
}
