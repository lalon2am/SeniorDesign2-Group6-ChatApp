package com.example.springboot;

import java.util.Date;
import java.util.UUID;

public class MessageRequest {
    private UUID id;

    private String user;

    private String recipient;

    private String text;

    private Date timestamp;

    public MessageRequest(UUID id, String user, String recipient, String text, Date timestamp) {
        this.id = id;
        this.user = user;
        this.recipient = recipient;
        this.text = text;
        this.timestamp = timestamp;
    }

    public UUID getId() {
        return id;
    }

    public String getUser() {
        return user;
    }

    public String getText() {
        return text;
    }

    public String getRecipient() { return recipient; }

    public Date getTimestamp() {
        return timestamp;
    }
}
