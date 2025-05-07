//MessageRequest.java
package com.example.springboot;

import java.util.Date;

public class MessageRequest {
    private String sender;  // Changed to String for sender
    private String recipient;  // Changed to String for recipient
    private String message;
    private Date timestamp;

    // Constructors
    public MessageRequest() {}

    public MessageRequest(String sender, String recipient, String message, Date timestamp) {
        this.sender = sender;
        this.recipient = recipient;
        this.message = message;
        this.timestamp = new Date();
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}
