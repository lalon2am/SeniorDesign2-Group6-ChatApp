package com.example.springboot;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @Column(name = "id")
    private UUID userId;

    private String username;

    private String password;

    private String email;
}
