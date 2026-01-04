package com.zai.common;

public class BaseResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public BaseResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public static <T> BaseResponse<T> success(T data) {
        return new BaseResponse<>(true, "操作成功", data);
    }

    public static <T> BaseResponse<T> success(String message) {
        return new BaseResponse<>(true, message, null);
    }

    public static <T> BaseResponse<T> error(String message) {
        return new BaseResponse<>(false, message, null);
    }

    // Getters and Setters
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

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
} 