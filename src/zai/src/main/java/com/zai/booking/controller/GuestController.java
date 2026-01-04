package com.zai.booking.controller;

import com.zai.booking.entity.Guest;
import com.zai.booking.service.GuestService;
import com.zai.common.BaseResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/guest")
public class GuestController {
    
    private static final Logger logger = LoggerFactory.getLogger(GuestController.class);
    
    @Autowired
    private GuestService guestService;
    
    @GetMapping({"", "/", "/index"})
    public String index() {
        logger.debug("访问客人管理页面");
        return "guest/index";
    }
    
    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<?> addGuest(@RequestBody Guest guest) {
        try {
            logger.debug("添加客人请求: {}", guest);
            
            int result = guestService.addGuest(guest);
            
            if (result > 0) {
                return ResponseEntity.ok(new BaseResponse(true, "客人添加成功", null));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "客人添加失败", null));
            }
            
        } catch (Exception e) {
            logger.error("添加客人失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "客人添加失败: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{guestId}")
    @ResponseBody
    public ResponseEntity<?> deleteGuest(@PathVariable String guestId) {
        try {
            logger.debug("删除客人: {}", guestId);
            
            guestService.deleteGuest(guestId);
            
            return ResponseEntity.ok(new BaseResponse(true, "客人删除成功", null));
            
        } catch (Exception e) {
            logger.error("删除客人失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "客人删除失败: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{guestId}")
    @ResponseBody
    public ResponseEntity<?> updateGuest(@PathVariable String guestId, @RequestBody Guest guest) {
        try {
            logger.debug("更新客人: guestId={}, guest={}", guestId, guest);
            
            guest.setGuestId(guestId);
            int result = guestService.updateGuest(guest);
            
            if (result > 0) {
                return ResponseEntity.ok(new BaseResponse(true, "客人更新成功", null));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "客人更新失败", null));
            }
            
        } catch (Exception e) {
            logger.error("更新客人失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "客人更新失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{guestId}")
    @ResponseBody
    public ResponseEntity<?> getGuestById(@PathVariable String guestId) {
        try {
            logger.debug("查询客人: {}", guestId);
            
            Guest guest = guestService.getGuestById(guestId);
            
            if (guest != null) {
                return ResponseEntity.ok(new BaseResponse(true, "查询成功", guest));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "客人不存在", null));
            }
            
        } catch (Exception e) {
            logger.error("查询客人失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询客人失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/list")
    @ResponseBody
    public ResponseEntity<?> getGuestList(
            @RequestParam(required = false) String guestName,
            @RequestParam(required = false) String guestEname,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String memberType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            logger.debug("查询客人列表: guestName={}, phone={}, page={}, size={}", guestName, phone, page, size);
            
            List<Guest> guests = guestService.getGuestList(guestName, guestEname, phone, email, memberType, page, size);
            int total = guestService.countGuests(guestName, guestEname, phone, email, memberType);
            
            Map<String, Object> result = Map.of(
                "list", guests,
                "total", total,
                "page", page,
                "size", size
            );
            
            return ResponseEntity.ok(new BaseResponse(true, "查询成功", result));
            
        } catch (Exception e) {
            logger.error("查询客人列表失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询客人列表失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/name/{guestName}")
    @ResponseBody
    public ResponseEntity<?> getGuestsByName(@PathVariable String guestName) {
        try {
            logger.debug("根据姓名查询客人: {}", guestName);
            
            List<Guest> guests = guestService.getGuestsByName(guestName);
            
            return ResponseEntity.ok(new BaseResponse(true, "查询成功", guests));
            
        } catch (Exception e) {
            logger.error("根据姓名查询客人失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/phone/{phone}")
    @ResponseBody
    public ResponseEntity<?> getGuestByPhone(@PathVariable String phone) {
        try {
            logger.debug("根据手机号查询客人: {}", phone);
            
            Guest guest = guestService.getGuestByPhone(phone);
            
            if (guest != null) {
                return ResponseEntity.ok(new BaseResponse(true, "查询成功", guest));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "客人不存在", null));
            }
            
        } catch (Exception e) {
            logger.error("根据手机号查询客人失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询失败: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/email/{email}")
    @ResponseBody
    public ResponseEntity<?> getGuestByEmail(@PathVariable String email) {
        try {
            logger.debug("根据邮箱查询客人: {}", email);
            
            Guest guest = guestService.getGuestByEmail(email);
            
            if (guest != null) {
                return ResponseEntity.ok(new BaseResponse(true, "查询成功", guest));
            } else {
                return ResponseEntity.badRequest().body(new BaseResponse(false, "客人不存在", null));
            }
            
        } catch (Exception e) {
            logger.error("根据邮箱查询客人失败", e);
            return ResponseEntity.badRequest().body(new BaseResponse(false, "查询失败: " + e.getMessage(), null));
        }
    }
} 