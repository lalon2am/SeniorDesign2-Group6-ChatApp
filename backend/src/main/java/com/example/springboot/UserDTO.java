package com.example.springboot;

import java.math.BigInteger;
import java.util.UUID;

public class UserDTO {
    private BigInteger userId;
    private String username;
    private String email;
    
    public UserDTO(BigInteger userId, String username, String email) {
        this.userId = userId;
        this.username = username;
        this.email = email;
    }
    
    // Getters
    public BigInteger getUserId() {
        return userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public String getEmail() {
        return email;
    }
    
    // Setters (if needed)
    public void setUserId(BigInteger userId) {
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