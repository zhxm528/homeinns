package com.zai.booking.entity;

import java.util.Date;

/**
 * 预订日志实体类
 */
public class BookingLog {
    
    /**
     * 日志主键ID
     */
    private String bookingLogId;
    
    /**
     * 预订ID
     */
    private String bookingId;
    
    /**
     * 预订版本号
     */
    private String version;
    
    /**
     * 操作类型，如CREATE、UPDATE、CANCEL
     */
    private String operation;
    
    /**
     * 操作人用户名或ID
     */
    private String operator;
    
    /**
     * 操作人姓名
     */
    private String operatorName;
    
    /**
     * 操作时间
     */
    private Date operateTime;
    
    /**
     * 预订当前状态快照（完整数据JSON）
     */
    private String bookingSnapshot;
    
    /**
     * 变更摘要（变动字段及前后值）
     */
    private String changeSummary;
    
    // 构造函数
    public BookingLog() {}
    
    public BookingLog(String bookingLogId, String bookingId, String version, String operation, 
                     String operator, Date operateTime, String bookingSnapshot, String changeSummary) {
        this.bookingLogId = bookingLogId;
        this.bookingId = bookingId;
        this.version = version;
        this.operation = operation;
        this.operator = operator;
        this.operatorName = operatorName;
        this.operateTime = operateTime;
        this.bookingSnapshot = bookingSnapshot;
        this.changeSummary = changeSummary;
    }
    
    // Getter和Setter方法
    public String getBookingLogId() {
        return bookingLogId;
    }
    
    public void setBookingLogId(String bookingLogId) {
        this.bookingLogId = bookingLogId;
    }
    
    public String getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }
    
    public String getVersion() {
        return version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }
    
    public String getOperation() {
        return operation;
    }
    
    public void setOperation(String operation) {
        this.operation = operation;
    }
    
    public String getOperator() {
        return operator;
    }
    
    public void setOperator(String operator) {
        this.operator = operator;
    }
    
    public Date getOperateTime() {
        return operateTime;
    }
    
    public void setOperateTime(Date operateTime) {
        this.operateTime = operateTime;
    }
    
    public String getBookingSnapshot() {
        return bookingSnapshot;
    }
    
    public void setBookingSnapshot(String bookingSnapshot) {
        this.bookingSnapshot = bookingSnapshot;
    }
    
    public String getChangeSummary() {
        return changeSummary;
    }
    
    public void setChangeSummary(String changeSummary) {
        this.changeSummary = changeSummary;
    }
    
    public String getOperatorName() {
        return operatorName;
    }
    
    public void setOperatorName(String operatorName) {
        this.operatorName = operatorName;
    }
    
    @Override
    public String toString() {
        return "BookingLog{" +
                "bookingLogId='" + bookingLogId + '\'' +
                ", bookingId='" + bookingId + '\'' +
                ", version='" + version + '\'' +
                ", operation='" + operation + '\'' +
                ", operator='" + operator + '\'' +
                ", operatorName='" + operatorName + '\'' +
                ", operateTime=" + operateTime +
                ", bookingSnapshot='" + bookingSnapshot + '\'' +
                ", changeSummary='" + changeSummary + '\'' +
                '}';
    }
} 