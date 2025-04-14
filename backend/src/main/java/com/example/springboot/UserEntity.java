package com.example.springboot;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigInteger;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @Column(name = "id")
    @GeneratedValue
    private BigInteger userId;

    private String username;

    private String password;

    private String email;

    public BigInteger getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}
