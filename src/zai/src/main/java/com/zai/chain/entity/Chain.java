package com.zai.chain.entity;

import java.sql.Timestamp;

public class Chain {
    private String chainId;
    private String chainCode;
    private String chainName;
    private String contactEmail;
    private String contactPhone;
    private String headquartersAddress;
    private Timestamp createdAt;
    private String status;

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public String getChainId() {
        return chainId;
    }

    public void setChainId(String chainId) {
        this.chainId = chainId;
    }

    public String getChainCode() {
        return chainCode;
    }

    public void setChainCode(String chainCode) {
        this.chainCode = chainCode;
    }

    public String getChainName() {
        return chainName;
    }

    public void setChainName(String chainName) {
        this.chainName = chainName;
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

    public String getHeadquartersAddress() {
        return headquartersAddress;
    }

    public void setHeadquartersAddress(String headquartersAddress) {
        this.headquartersAddress = headquartersAddress;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Chain{" +
                "chainId='" + chainId + '\'' +
                ", chainName='" + chainName + '\'' +
                ", contactEmail='" + contactEmail + '\'' +
                ", contactPhone='" + contactPhone + '\'' +
                ", headquartersAddress='" + headquartersAddress + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
} 