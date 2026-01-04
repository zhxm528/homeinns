package com.zai.user.dto;

/**
 * 用户更新请求DTO
 */
public class UserUpdateRequest {
    private String loginName;
    private String username;
    private String email;
    private String phone;
    private String type;
    private String status;
    private String hotelId;
    private String userId;

    // Getters and Setters
    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "UserUpdateRequest{" +
                "loginName='" + loginName + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", type='" + type + '\'' +
                ", status='" + status + '\'' +
                ", hotelId='" + hotelId + '\'' +
                ", userId='" + userId + '\'' +
                '}';
    }
} 