package com.zai.channel.entity;

import java.io.Serializable;
import java.sql.Timestamp;

public class Channel implements Serializable {
    private String channelId;
    private String channelCode;
    private String channelName;
    private String description;
    private String contactEmail;
    private String contactPhone;
    private Timestamp createdAt;

    // Getters and Setters
    public String getChannelCode() {
        return channelCode;
    }

    public void setChannelCode(String channelCode) {
        this.channelCode = channelCode;
    }
    public String getChannelId() {
        return channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Channel{" +
                "channelId='" + channelId + '\'' +
                ", channelName='" + channelName + '\'' +
                ", description='" + description + '\'' +
                ", contactEmail='" + contactEmail + '\'' +
                ", contactPhone='" + contactPhone + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
} 