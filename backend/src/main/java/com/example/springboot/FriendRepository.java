package com.example.springboot;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FriendRepository extends JpaRepository<FriendEntity, FriendKey> {

}
