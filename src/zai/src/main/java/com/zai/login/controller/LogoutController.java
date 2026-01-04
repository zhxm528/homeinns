package com.zai.login.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.ResponseBody;
import com.zai.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/login")
public class LogoutController {
    private static final Logger logger = LoggerFactory.getLogger(LogoutController.class);
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/logout")
    @ResponseBody
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        logger.info("用户登出");
        //Spring Security 的 LogoutFilter 拦截了请求，而不是让请求到达我们的 LogoutController
        // 从请求头中获取 token
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            // 使 token 失效
            jwtUtil.validateToken(token);
        }
        
        logger.info("用户登出成功");
    }
} 