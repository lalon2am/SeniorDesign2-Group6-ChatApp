package com.example.springboot;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigInteger;
import java.util.List;


public interface FriendRepository extends JpaRepository<FriendEntity, FriendKey> {

    @Query("select f from FriendEntity f where f.userId = :userId")
    List<FriendEntity> findByUserId(@Param("userId") BigInteger userId);
}
