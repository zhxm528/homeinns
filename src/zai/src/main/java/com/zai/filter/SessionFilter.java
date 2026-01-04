package com.zai.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SessionFilter implements Filter {
    
    private static final Logger logger = LoggerFactory.getLogger(SessionFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.debug("SessionFilter初始化完成");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpSession session = httpRequest.getSession(false);

        // 获取请求的URI
        String requestURI = httpRequest.getRequestURI();
        logger.debug("处理请求: {}", requestURI);
        
        // 检查是否是登录页面、API登录接口或静态资源
        if (requestURI.endsWith("/login") || 
            requestURI.endsWith("/api/login") ||
            requestURI.contains("/css/") || 
            requestURI.contains("/js/") || 
            requestURI.contains("/images/")) {
            logger.debug("跳过过滤器检查: {}", requestURI);
            chain.doFilter(request, response);
            return;
        }

        // 检查session中是否存在UserId（注意大小写）
        if (session == null || session.getAttribute("UserId") == null) {
            logger.debug("未找到有效Session，重定向到登录页面");
            // 重定向到登录页面
            httpResponse.sendRedirect(httpRequest.getContextPath() + "/login");
            return;
        }

        logger.debug("Session验证通过，继续处理请求");
        // 如果session存在且UserId不为空，继续处理请求
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        logger.debug("SessionFilter销毁");
    }
} 