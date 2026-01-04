package com.zai.hotel.controller;

import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import com.zai.hotel.service.HotelService;
import com.zai.hotel.entity.Hotel;
import com.zai.chain.service.ChainService;
import com.zai.chain.entity.Chain;
import com.zai.user.service.UserService;
import com.zai.user.entity.User;
import javax.servlet.http.HttpSession;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/session")
public class SessionController {
    private static final Logger logger = LoggerFactory.getLogger(SessionController.class);

    @Autowired
    private HotelService hotelService;

    @Autowired
    private ChainService chainService;

    @Autowired
    private UserService userService;

    @PostMapping("/hotel")
    public Map<String, Object> updateHotelSession(@RequestBody Map<String, String> request, HttpSession session) {
        // 方法入口日志
        logger.info("Enter updateHotelSession - request: {}", request);
        Map<String, Object> response = new HashMap<>();
        try {
            logger.info("更新session中的HotelId: {}, HotelName: {}", request.get("hotelId"), request.get("hotelName"));
            
            if (request.get("hotelId") != null && !request.get("hotelId").trim().isEmpty()) {
                // 更新酒店信息
                session.setAttribute("HotelId", request.get("hotelId"));
                session.setAttribute("HotelName", request.get("hotelName") != null ? request.get("hotelName") : "酒店名称");
                
                // 获取并更新集团信息
                Hotel hotel = hotelService.selectByHotelId(request.get("hotelId"));
                if (hotel != null) {
                    String chainId = hotel.getChainId();
                    if (chainId != null && !chainId.trim().isEmpty()) {
                        Chain chain = chainService.getChainById(chainId);
                        if (chain != null) {
                            session.setAttribute("ChainId", chainId);
                            session.setAttribute("ChainName", chain.getChainName());
                            logger.info("集团信息已更新到session中 - ChainId: {}, ChainName: {}", chainId, chain.getChainName());
                        }
                    }
                }
                
                logger.info("HotelId和HotelName已更新到session中");
                response.put("success", true);
                response.put("message", "Session更新成功");
            
            // 打印更新后的 Session 信息
            logger.info("更新后 Session 信息 - ChainId: {}, ChainName: {}, HotelId: {}, HotelName: {}", 
                session.getAttribute("ChainId"), session.getAttribute("ChainName"), 
                session.getAttribute("HotelId"), session.getAttribute("HotelName"));
            } else {
                // 清除酒店信息
                session.removeAttribute("HotelId");
                session.removeAttribute("HotelName");
                
                // 获取当前用户的集团信息
                String userId = (String) session.getAttribute("UserId");
                if (userId != null && !userId.trim().isEmpty()) {
                    List<User> users = userService.selectByUserId(userId);
                    if (users != null && !users.isEmpty()) {
                        User user = users.get(0);
                        String chainId = user.getChainId();
                        if (chainId != null && !chainId.trim().isEmpty()) {
                            Chain chain = chainService.getChainById(chainId);
                            if (chain != null) {
                                session.setAttribute("ChainId", chainId);
                                session.setAttribute("ChainName", chain.getChainName());
                                logger.info("已更新为用户关联的集团信息 - ChainId: {}, ChainName: {}", chainId, chain.getChainName());
                            }
                        }
                    }
                }
                
                logger.info("酒店信息已清除，集团信息已更新为用户关联的集团");
                response.put("success", true);
                response.put("message", "Session已更新");
            
            // 打印更新后的 Session 信息
            logger.info("更新后 Session 信息 - ChainId: {}, ChainName: {}, HotelId: {}, HotelName: {}", 
                session.getAttribute("ChainId"), session.getAttribute("ChainName"), 
                session.getAttribute("HotelId"), session.getAttribute("HotelName"));
            }
        } catch (Exception e) {
            logger.error("更新session失败", e);
            response.put("success", false);
            response.put("message", "更新失败：" + e.getMessage());
        } finally {
            // 统一打印最终 Session 信息
            logger.info("最终 Session 信息 - ChainId: {}, ChainName: {}, HotelId: {}, HotelName: {}", 
                session.getAttribute("ChainId"), session.getAttribute("ChainName"),
                session.getAttribute("HotelId"), session.getAttribute("HotelName"));
        }
        return response;
    }

    @GetMapping("/info")
    public Map<String, Object> getSessionInfo(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        
        try {
            // 获取集团信息
            String chainId = (String) session.getAttribute("ChainId");
            String chainName = (String) session.getAttribute("ChainName");
            data.put("chainId", chainId);
            data.put("chainName", chainName);
            
            // 获取酒店信息
            String hotelId = (String) session.getAttribute("HotelId");
            String hotelName = (String) session.getAttribute("HotelName");
            data.put("hotelId", hotelId);
            data.put("hotelName", hotelName);
            
            response.put("success", true);
            response.put("data", data);
            logger.info("获取session信息成功 - ChainId: {}, ChainName: {}, HotelId: {}, HotelName: {}", 
                chainId, chainName, hotelId, hotelName);
        } catch (Exception e) {
            logger.error("获取session信息失败", e);
            response.put("success", false);
            response.put("message", "获取信息失败：" + e.getMessage());
        }
        
        return response;
    }
} 