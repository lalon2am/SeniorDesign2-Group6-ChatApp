package com.example.springboot;

import java.util.Set;
import java.util.HashSet;

public class Group {
    private String groupId;
    private String groupName;
    private Set<String> members;

    // Constructor matching the required signature
    public Group(String groupId, String groupName, Set<String> members) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.members = members != null ? new HashSet<>(members) : new HashSet<>();
    }

    // Getters and setters
    public String getGroupId() {
        return groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public Set<String> getMembers() {
        return members;
    }
}
