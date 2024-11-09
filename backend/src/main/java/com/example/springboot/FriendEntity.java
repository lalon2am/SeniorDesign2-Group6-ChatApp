package com.example.springboot;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@IdClass(FriendKey.class)
@Table(name = "friends")
public class FriendEntity {
    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Id
    @Column(name = "friend_id")
    private UUID friendId;
}
