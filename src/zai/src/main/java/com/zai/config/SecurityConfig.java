package com.zai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.zai.util.JwtUtil;
import com.zai.user.service.impl.UserServiceImpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private CorsConfigurationSource corsConfigurationSource;
    
    
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtUtil jwtUtil, UserServiceImpl userService) {
        return new JwtAuthenticationFilter(jwtUtil, userService);
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
    CorsConfigurationSource corsConfigurationSource,
    JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .authorizeRequests(auth -> auth
                .antMatchers("/login/**", "/api/login/**", "/login/logout").permitAll()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

            .logout(logout -> logout
                .logoutUrl("/login/logout")
                .logoutSuccessHandler((request, response, authentication) -> 
                    response.setStatus(HttpServletResponse.SC_OK))
                .permitAll()
            )
            .headers(headers -> headers.frameOptions().disable());
        
        return http.build();
    }
} 