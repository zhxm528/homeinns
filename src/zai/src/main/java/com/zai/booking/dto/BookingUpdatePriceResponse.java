package com.zai.booking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * 预订价格更新响应DTO
 */
public class BookingUpdatePriceResponse {
    
    /**
     * 是否成功
     */
    @JsonProperty("success")
    private boolean success;
    
    /**
     * 消息
     */
    @JsonProperty("message")
    private String message;
    
    /**
     * 总处理数量
     */
    @JsonProperty("totalCount")
    private int totalCount;
    
    /**
     * 成功处理数量
     */
    @JsonProperty("successCount")
    private int successCount;
    
    /**
     * 失败处理数量
     */
    @JsonProperty("failCount")
    private int failCount;
    
    /**
     * 处理结果详情列表
     */
    @JsonProperty("results")
    private List<UpdatePriceResult> results;
    
    // 构造函数
    public BookingUpdatePriceResponse() {}
    
    // Getter和Setter方法
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public int getTotalCount() {
        return totalCount;
    }
    
    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
    
    public int getSuccessCount() {
        return successCount;
    }
    
    public void setSuccessCount(int successCount) {
        this.successCount = successCount;
    }
    
    public int getFailCount() {
        return failCount;
    }
    
    public void setFailCount(int failCount) {
        this.failCount = failCount;
    }
    
    public List<UpdatePriceResult> getResults() {
        return results;
    }
    
    public void setResults(List<UpdatePriceResult> results) {
        this.results = results;
    }
    
    @Override
    public String toString() {
        return "BookingUpdatePriceResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", totalCount=" + totalCount +
                ", successCount=" + successCount +
                ", failCount=" + failCount +
                ", results=" + results +
                '}';
    }
    
    /**
     * 单个价格更新结果
     */
    public static class UpdatePriceResult {
        
        /**
         * 预订ID
         */
        @JsonProperty("bookingId")
        private String bookingId;
        
        /**
         * 预订日ID
         */
        @JsonProperty("bookingDailyId")
        private String bookingDailyId;
        
        /**
         * 入住日期
         */
        @JsonProperty("stayDate")
        private String stayDate;
        
        /**
         * 操作类型
         */
        @JsonProperty("action")
        private String action;
        
        /**
         * 是否新增行
         */
        @JsonProperty("isNew")
        private Boolean isNew;
        
        /**
         * 处理是否成功
         */
        @JsonProperty("success")
        private boolean success;
        
        /**
         * 处理结果消息
         */
        @JsonProperty("message")
        private String message;
        
        /**
         * 错误代码（如果失败）
         */
        @JsonProperty("errorCode")
        private String errorCode;
        
        // 构造函数
        public UpdatePriceResult() {}
        
        // Getter和Setter方法
        public String getBookingId() {
            return bookingId;
        }
        
        public void setBookingId(String bookingId) {
            this.bookingId = bookingId;
        }
        
        public String getBookingDailyId() {
            return bookingDailyId;
        }
        
        public void setBookingDailyId(String bookingDailyId) {
            this.bookingDailyId = bookingDailyId;
        }
        
        public String getStayDate() {
            return stayDate;
        }
        
        public void setStayDate(String stayDate) {
            this.stayDate = stayDate;
        }
        
        public String getAction() {
            return action;
        }
        
        public void setAction(String action) {
            this.action = action;
        }
        
        public Boolean getIsNew() {
            return isNew;
        }
        
        public void setIsNew(Boolean isNew) {
            this.isNew = isNew;
        }
        
        public boolean isSuccess() {
            return success;
        }
        
        public void setSuccess(boolean success) {
            this.success = success;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public String getErrorCode() {
            return errorCode;
        }
        
        public void setErrorCode(String errorCode) {
            this.errorCode = errorCode;
        }
        
        @Override
        public String toString() {
            return "UpdatePriceResult{" +
                    "bookingId='" + bookingId + '\'' +
                    ", bookingDailyId='" + bookingDailyId + '\'' +
                    ", stayDate='" + stayDate + '\'' +
                    ", action='" + action + '\'' +
                    ", isNew=" + isNew +
                    ", success=" + success +
                    ", message='" + message + '\'' +
                    ", errorCode='" + errorCode + '\'' +
                    '}';
        }
    }
} 