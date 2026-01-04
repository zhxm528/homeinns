package com.zai.config;

import com.zai.util.JwtUtil;
import com.zai.user.entity.User;
import com.zai.user.service.impl.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final UserServiceImpl userService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserServiceImpl userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.debug("开始处理请求: {}", request.getRequestURI());
        
        try {
            String token = extractToken(request);
            logger.debug("从请求头中获取到的 token: {}", token != null ? "存在" : "不存在");
            
            if (token != null && jwtUtil.validateToken(token)) {
                logger.debug("token 验证通过");
                String userId = jwtUtil.getUserIdFromToken(token);
                logger.debug("从 token 中获取到用户ID: {}", userId);
                
                List<User> users = userService.selectByUserId(userId);
                if (!users.isEmpty()) {
                    User user = users.get(0);
                    logger.debug("用户信息加载成功: {}", user.getLoginName());

                    String role = "ROLE_USER";
                    if (user.getType() != null) {
                        switch (user.getType()) {
                            case 0:
                                role = "ROLE_ADMIN";
                                break;
                            case 1:
                                role = "ROLE_GROUP";
                                break;
                            case 2:
                                role = "ROLE_HOTEL";
                                break;
                        }
                    }

                    UserDetails userDetails = org.springframework.security.core.userdetails.User
                        .withUsername(user.getLoginName())
                        .password(user.getPasswordHash() == null ? "" : user.getPasswordHash())
                        .authorities(Collections.singletonList(new SimpleGrantedAuthority(role)))
                        .build();

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("认证信息已设置到安全上下文");
                }
            }
        } catch (Exception e) {
            logger.error("JWT 认证过程发生错误: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken == null) {
            bearerToken = request.getHeader("authorization");
        }

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }
}
