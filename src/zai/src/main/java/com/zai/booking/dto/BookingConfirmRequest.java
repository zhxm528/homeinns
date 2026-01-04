package com.zai.booking.dto;

/**
 * 预订确认请求类
 * 
 * @author zai
 * @since 2024-01-01
 */
public class BookingConfirmRequest {
    
    /**
     * 确认号
     */
    private String confirmNumber;
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 默认构造函数
     */
    public BookingConfirmRequest() {
    }
    
    /**
     * 带参数的构造函数
     * 
     * @param confirmNumber 确认号
     */
    public BookingConfirmRequest(String confirmNumber) {
        this.confirmNumber = confirmNumber;
    }
    
    /**
     * 获取确认号
     * 
     * @return 确认号
     */
    public String getConfirmNumber() {
        return confirmNumber;
    }
    
    /**
     * 设置确认号
     * 
     * @param confirmNumber 确认号
     */
    public void setConfirmNumber(String confirmNumber) {
        this.confirmNumber = confirmNumber;
    }
    
    /**
     * 获取用户ID
     * 
     * @return 用户ID
     */
    public String getUserId() {
        return userId;
    }
    
    /**
     * 设置用户ID
     * 
     * @param userId 用户ID
     */
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    @Override
    public String toString() {
        return "BookingConfirmRequest{" +
                "confirmNumber='" + confirmNumber + '\'' +
                ", userId='" + userId + '\'' +
                '}';
    }
} 