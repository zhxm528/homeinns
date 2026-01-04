package com.zai.function.dto;

/**
 * 功能列表查询请求DTO
 */
public class FunctionListRequest {
    private String functionCode;
    private String functionName;
    private String parentFunctionId;
    private String functionStatus;
    private String functionType;
    private Integer pageNum;
    private Integer pageSize;

    // Getters and Setters
    public String getFunctionCode() {
        return functionCode;
    }

    public void setFunctionCode(String functionCode) {
        this.functionCode = functionCode;
    }

    public String getFunctionName() {
        return functionName;
    }

    public void setFunctionName(String functionName) {
        this.functionName = functionName;
    }

    public String getParentFunctionId() {
        return parentFunctionId;
    }

    public void setParentFunctionId(String parentFunctionId) {
        this.parentFunctionId = parentFunctionId;
    }

    public String getFunctionStatus() {
        return functionStatus;
    }

    public void setFunctionStatus(String functionStatus) {
        this.functionStatus = functionStatus;
    }

    public String getFunctionType() {
        return functionType;
    }

    public void setFunctionType(String functionType) {
        this.functionType = functionType;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
} 