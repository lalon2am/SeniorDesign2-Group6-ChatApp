package com.example.springboot;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface FriendRepository extends JpaRepository<FriendEntity, FriendKey> {

    @Query("select f from FriendEntity f where f.userId = :userId")
    List<FriendEntity> findByUserId(@Param("userId") UUID userId);
}
