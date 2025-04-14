package com.example.springboot;

import jakarta.persistence.*;

import java.math.BigInteger;


@Entity
@IdClass(FriendKey.class)
@Table(name = "friends")
public class FriendEntity {
    @Id
    @Column(name = "user_id")
    private BigInteger userId;

    @Id
    @Column(name = "friend_id")
    private BigInteger friendId;

    public FriendEntity(BigInteger userId, BigInteger friendId) {
        this.userId = userId;
        this.friendId = friendId;
    }

    public FriendEntity() {

    }

    public BigInteger getUserId() {
        return userId;
    }

    public BigInteger getFriendId() {
        return friendId;
    }
}
