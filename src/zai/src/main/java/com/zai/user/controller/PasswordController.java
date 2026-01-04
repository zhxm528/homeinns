package com.zai.user.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.zai.user.service.UserService;
import com.zai.user.entity.User;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpSession;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Controller
public class PasswordController {
    private static final Logger logger = LoggerFactory.getLogger(PasswordController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/password")
    public String password() {
        return "user/password";
    }

    @PostMapping("/api/password/change")
    @ResponseBody
    public Map<String, Object> changePassword(@RequestBody Map<String, String> passwordData,
                                            HttpSession session) {
        String oldPassword = passwordData.get("oldPassword");
        String newPassword = passwordData.get("newPassword");
        String confirmPassword = passwordData.get("confirmPassword");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 获取当前登录用户ID
            String userId = (String) session.getAttribute("UserId");
            if (userId == null) {
                response.put("success", false);
                response.put("message", "用户未登录");
                return response;
            }

            // 获取用户信息
            List<User> users = userService.selectByUserId(userId);
            if (users == null || users.isEmpty()) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return response;
            }

            User user = users.get(0);
            
            // 验证新密码和确认密码是否一致
            if (!newPassword.equals(confirmPassword)) {
                response.put("success", false);
                response.put("message", "新密码和确认密码不一致");
                return response;
            }

            // 对原密码和新密码进行SHA-256加密
            String oldPasswordHash = sha256(oldPassword);
            String newPasswordHash = sha256(newPassword);

            // 验证原密码是否正确或原密码为空
            if (user.getPasswordHash() != null && !user.getPasswordHash().isEmpty() 
                && !user.getPasswordHash().equals(oldPasswordHash)) {
                response.put("success", false);
                response.put("message", "原密码错误");
                return response;
            }

            // 更新密码
            user.setPasswordHash(newPasswordHash);
            userService.update(user);
            
            logger.info("用户 {} 修改密码成功", userId);
            response.put("success", true);
            response.put("message", "密码修改成功");
            return response;
            
        } catch (Exception e) {
            logger.error("修改密码出错: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "系统错误，请稍后重试");
            return response;
        }
    }

    // SHA-256加密方法
    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes());
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
            logger.error("SHA-256加密出错: {}", e.getMessage(), e);
            throw new RuntimeException("密码加密失败", e);
        }
    }
} 