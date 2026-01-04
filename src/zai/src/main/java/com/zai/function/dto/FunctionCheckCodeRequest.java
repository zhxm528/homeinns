package com.zai.function.dto;

/**
 * 功能代码验证请求DTO
 */
public class FunctionCheckCodeRequest {
    private String functionCode;
    private String functionId;

    // Getters and Setters
    public String getFunctionCode() {
        return functionCode;
    }

    public void setFunctionCode(String functionCode) {
        this.functionCode = functionCode;
    }

    public String getFunctionId() {
        return functionId;
    }

    public void setFunctionId(String functionId) {
        this.functionId = functionId;
    }
} 