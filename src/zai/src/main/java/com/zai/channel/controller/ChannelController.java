package com.zai.channel.controller;

import com.zai.channel.entity.Channel;
import com.zai.channel.service.ChannelService;
import com.zai.channel.dto.ChannelSelectComponentRequest;
import com.zai.util.IdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/channel")
public class ChannelController {
    private static final Logger logger = LoggerFactory.getLogger(ChannelController.class);

    @Autowired
    private ChannelService channelService;

    @GetMapping
    public String index() {
        return "channel/index";
    }

    @GetMapping("/list")
    @ResponseBody
    public List<Channel> list(@RequestParam(required = false) String channelName,
                            @RequestParam(required = false) String contactEmail,
                            @RequestParam(required = false) String contactPhone,
                            @RequestParam(required = false) String channelCode) {
        return channelService.getChannelsByCondition(channelName, contactEmail, contactPhone, channelCode);
    }

    @GetMapping("/detail/{channelId}")
    @ResponseBody
    public Channel detail(@PathVariable String channelId) {
        return channelService.getChannelById(channelId);
    }

    @PostMapping("/add")
    @ResponseBody
    public void add(@RequestBody Channel channel) {
        logger.info("开始添加渠道，接收到的数据：");
        logger.info("channelCode: {}", channel.getChannelCode());
        logger.info("channelName: {}", channel.getChannelName());
        logger.info("contactEmail: {}", channel.getContactEmail());
        logger.info("contactPhone: {}", channel.getContactPhone());

        channelService.addChannel(channel);
    }

    @PutMapping("/update")
    @ResponseBody
    public void update(@RequestBody Channel channel) {
        channelService.updateChannel(channel);
    }

    @DeleteMapping("/delete/{channelId}")
    @ResponseBody
    public void delete(@PathVariable String channelId) {
        channelService.deleteChannel(channelId);
    }

    @PostMapping("/select")
    @ResponseBody
    public Map<String, Object> search(@RequestBody Map<String, String> params) {
        String channelCode = params.get("channelCode");
        String channelName = params.get("channelName");
        
        logger.info("开始模糊查询渠道，查询条件：channelCode={}, channelName={}", channelCode, channelName);
        
        List<Channel> channels = channelService.getChannelsByCondition(channelName, null, null, channelCode);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", channels);
        
        logger.info("查询结果：{}", response);
        return response;
    }

    @PostMapping("/select/component")
    @ResponseBody
    public Map<String, Object> selectChannelComponent(@RequestBody ChannelSelectComponentRequest request) {
        try {
            logger.debug("查询渠道组件，接收到的数据：{}", request);
            
            List<Channel> channels = channelService.selectChannelComponent();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", channels);
            
            logger.debug("查询渠道组件结果：{}", response);
            return response;
        } catch (Exception e) {
            logger.debug("查询渠道组件时发生错误", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return response;
        }
    }
} 