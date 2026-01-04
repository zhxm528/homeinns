package com.zai.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import javax.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.security.Key;
import java.util.Date;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {
    private Key key;
    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME; // 1 day in milliseconds
    @Value("${jwt.secret}")
    private String SECRET;

    @PostConstruct
    public void init() {
        byte[] apiKeySecretBytes = SECRET.getBytes(StandardCharsets.UTF_8);
        this.key = new SecretKeySpec(apiKeySecretBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    // 生成 JWT
    public String generateToken(String userId, String role) {
        return Jwts.builder()
                .setSubject(userId) // 存储用户 ID
                .claim("role", role) // 存储用户角色
                .setIssuedAt(new Date()) // 签发时间
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 过期时间
                .signWith(SignatureAlgorithm.HS256, key)
                .compact();
    }

    // 验证 JWT
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(key).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 从 JWT 获取用户 ID
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // 从 JWT 获取用户角色
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("role", String.class);
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}