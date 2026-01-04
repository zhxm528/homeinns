package com.zai.function.dto;

/**
 * 功能新增请求DTO
 */
public class FunctionAddRequest {
    private String functionCode;
    private String functionName;
    private String parentFunctionId;
    private String functionIcon;
    private Integer functionSort;
    private String functionPath;
    private String functionStatus;
    private String functionType;
    private String functionDescription;

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

    public String getFunctionIcon() {
        return functionIcon;
    }

    public void setFunctionIcon(String functionIcon) {
        this.functionIcon = functionIcon;
    }

    public Integer getFunctionSort() {
        return functionSort;
    }

    public void setFunctionSort(Integer functionSort) {
        this.functionSort = functionSort;
    }

    public String getFunctionPath() {
        return functionPath;
    }

    public void setFunctionPath(String functionPath) {
        this.functionPath = functionPath;
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

    public String getFunctionDescription() {
        return functionDescription;
    }

    public void setFunctionDescription(String functionDescription) {
        this.functionDescription = functionDescription;
    }
} 