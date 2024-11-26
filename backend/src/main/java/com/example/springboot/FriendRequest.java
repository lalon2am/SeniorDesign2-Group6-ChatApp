package com.example.springboot;

public class FriendRequest {
    private String userId;

    private String friendId;

    private String friendEmail;

    public FriendRequest() {

    }

    public FriendRequest(String userId, String friendId, String friendEmail) {
        this.userId = userId;
        this.friendId = friendId;
        this.friendEmail = friendEmail;
    }

    public String getUserId() {
        return userId;
    }

    public String getFriendId() {
        return friendId;
    }

    public String getFriendEmail() {
        return friendEmail;
    }
}
