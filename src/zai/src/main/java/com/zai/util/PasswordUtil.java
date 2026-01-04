package com.zai.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 密码加密工具类
 */
public class PasswordUtil {
    
    /**
     * 使用SHA-256算法加密密码
     * @param password 原始密码
     * @return 加密后的密码
     */
    public static String encryptPassword(String password) {
        try {
            // 创建MessageDigest对象，指定使用SHA-256算法
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            
            // 将密码转换为字节数组并加密
            byte[] hash = md.digest(password.getBytes());
            
            // 将字节数组转换为十六进制字符串
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("密码加密失败", e);
        }
    }
    
    /**
     * 验证密码是否正确
     * @param inputPassword 用户输入的密码
     * @param storedPassword 数据库中存储的加密密码
     * @return 密码是否正确
     */
    public static boolean verifyPassword(String inputPassword, String storedPassword) {
        String encryptedInput = encryptPassword(inputPassword);
        return encryptedInput.equals(storedPassword);
    }
} 