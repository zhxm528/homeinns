package com.zai.api.homeinns.GETChannelRmType.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zai.api.homeinns.GETChannelRmType.model.GetHotelInfoRequest;
import com.zai.api.homeinns.GETChannelRmType.model.GetHotelInfoResponse;
import com.zai.api.homeinns.GETChannelRmType.service.GetHotelInfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GetHotelInfoServiceImpl implements GetHotelInfoService {
    private static final Logger logger = LoggerFactory.getLogger(GetHotelInfoServiceImpl.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${homeinns.api.base-url}")
    private String baseUrl;

    @Override
    public GetHotelInfoResponse getHotelInfo(GetHotelInfoRequest request) {
        try {
            String url = baseUrl + "/HomeinnsAgentApi/api/HotelInfo/GetHotelInfo";
            
            // 记录请求参数
            String requestJson = objectMapper.writeValueAsString(request);
            logger.info("调用获取酒店信息接口，请求参数：{}", requestJson);
            //调用接口，获取接口响应的原始json格式的字符串
            String responseJson = restTemplate.postForObject(url, request, String.class);
            logger.info("获取酒店信息原始接口响应：{}", responseJson);
            //将原始json格式的字符串转换为GetHotelInfoResponse对象
            GetHotelInfoResponse response = objectMapper.readValue(responseJson, GetHotelInfoResponse.class);
            logger.info("获取酒店信息接口响应：{}", response);
            
            // 记录响应结果
            //String responseJson = objectMapper.writeValueAsString(response);
            //logger.info("获取酒店信息接口响应：{}", responseJson);
            
            return response;
        } catch (Exception e) {
            logger.error("获取酒店信息失败", e);
            throw new RuntimeException("获取酒店信息失败: " + e.getMessage());
        }
    }
} 