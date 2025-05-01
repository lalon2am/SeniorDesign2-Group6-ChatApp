package com.example.springboot;

import java.util.*;
import java.util.HashMap;

public class GroupManagement {
   private Map<String, Group> groups = new HashMap<>();

    public void createGroup(String groupId, String groupName, Set<String> members) {
            groups.put(groupId, new Group(groupId, groupName, members));
        }
    
        public class Group {
            private String groupId;
            private String groupName;
            private Set<String> members;
    
            public Group(String groupId, String groupName, Set<String> members) {
                this.groupId = groupId;
                this.groupName = groupName;
                this.members = members;
            }
    
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
    
    public void addMember(String groupId, String username) {
        Group group = groups.get(groupId);
        if (group != null) {
            group.getMembers().add(username);
        }
    }

    public void removeMember(String groupId, String username) {
        Group group = groups.get(groupId);
        if (group != null) {
            group.getMembers().remove(username);
        }
    }

    public Group getGroup(String groupId) {
        return groups.get(groupId);
    }

}
