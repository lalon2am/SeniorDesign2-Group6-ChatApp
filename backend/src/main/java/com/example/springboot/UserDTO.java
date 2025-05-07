package com.example.springboot;

import java.util.UUID;

public class UserDTO {
    private UUID userId;
    private String username;
    private String email;
    
    public UserDTO(UUID userId, String username, String email) {
        this.userId = userId;
        this.username = username;
        this.email = email;
    }
    
    // Getters
    public UUID getUserId() {
        return userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public String getEmail() {
        return email;
    }
    
    // Setters (if needed)
    public void setUserId(UUID userId) {
        this.userId = userId;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    // Optional: equals(), hashCode() and toString()
    @Override
    public String toString() {
        return "UserDTO{" +
               "userId=" + userId +
               ", username='" + username + '\'' +
               ", email='" + email + '\'' +
               '}';
    }
}