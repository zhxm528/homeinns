package com.zai.chain.service.impl;

import com.zai.chain.service.HomeinnsService;
import com.zai.chain.dto.HomeinnsChannelRmTypeRequest;
import com.zai.chain.dto.HomeinnsChannelRmTypeResponse;
import com.zai.common.BaseResponse;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;
import com.zai.hotel.entity.Hotel;
import com.zai.hotel.mapper.HotelMapper;

@Service
public class HomeinnsServiceImpl implements HomeinnsService {
    
    private static final Logger logger = LoggerFactory.getLogger(HomeinnsServiceImpl.class);
    private static final Gson gson = new Gson();
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private HotelMapper hotelMapper;
    
    @Value("${homeinns.api.base-url}")
    private String baseUrl;
    
    @Value("${homeinns.api.terminal.seq}")
    private String terminalSeq;
    
    @Value("${homeinns.api.terminal.oprid}")
    private String terminalOprId;
    
    @Value("${homeinns.api.terminal.license}")
    private String terminalLicense;
    
    @Override
    public BaseResponse getChannelRmTypeStar(HomeinnsChannelRmTypeRequest request) {
        try {
            logger.debug("请求体: {}", gson.toJson(request));
            
            // 验证请求参数
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            // 构建API请求参数
            Map<String, Object> apiRequest = new HashMap<>();
            apiRequest.put("Type", "T02"); // 经济型查询
            apiRequest.put("Terminal_License", terminalLicense);
            apiRequest.put("Terminal_Seq", terminalSeq);
            apiRequest.put("Terminal_OprId", terminalOprId);
            
            // 构建请求URL
            String url = baseUrl + "/HomeinnsAgentApi/api/HotelInfo/GETChannelRmType";
            
            // 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // 创建请求实体
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(apiRequest, headers);
            
            logger.debug("API请求URL: {}", url);
            logger.debug("API请求参数: {}", gson.toJson(apiRequest));
            
            // 调用远程API，先获取原始响应字符串
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(
                url, entity, String.class);
            
            String responseBody = responseEntity.getBody();
            
            logger.debug("API响应状态码: {}", responseEntity.getStatusCode());
            logger.debug("API原始响应体: {}", responseBody);
            
            // 解析响应体
            HomeinnsChannelRmTypeResponse response = null;
            if (responseBody != null && !responseBody.trim().isEmpty()) {
                try {
                    response = gson.fromJson(responseBody, HomeinnsChannelRmTypeResponse.class);
                    logger.debug("API解析后响应结果: {}", gson.toJson(response));
                } catch (Exception e) {
                    logger.error("解析API响应失败: {}", e.getMessage(), e);
                    return BaseResponse.error("解析API响应失败: " + e.getMessage());
                }
            }
            
            // 检查API响应
            if (response == null) {
                return BaseResponse.error("API响应为空");
            }
            
            // 检查业务状态码
            if (response.getResCode() != null && response.getResCode() != 0) {
                return BaseResponse.error("API调用失败: " + response.getResDesc());
            }
            
            // 按照HotelCd字段从小到大排序
            if (response.getChannelRmtypes() != null && !response.getChannelRmtypes().isEmpty()) {
                response.getChannelRmtypes().sort((a, b) -> {
                    String hotelCdA = a.getHotelCd() != null ? a.getHotelCd() : "";
                    String hotelCdB = b.getHotelCd() != null ? b.getHotelCd() : "";
                    return hotelCdA.compareTo(hotelCdB);
                });
                logger.debug("排序后的渠道房型列表: {}", gson.toJson(response.getChannelRmtypes()));
            }
            
            // 处理酒店代码过滤和数据库操作
            HomeinnsChannelRmTypeResponse filteredResponse = processHotelCodes(response);
            
            // 返回前打印JSON格式的响应体
            String finalResponseJson = gson.toJson(filteredResponse);
            logger.debug("最终返回给前端的JSON响应体: {}", finalResponseJson);
            
            // 调试：检查filteredResponse的内容
            logger.debug("filteredResponse对象: resCode={}, resDesc={}, channelRmtypes数量={}", 
                filteredResponse.getResCode(), 
                filteredResponse.getResDesc(), 
                filteredResponse.getChannelRmtypes() != null ? filteredResponse.getChannelRmtypes().size() : 0);
            
            // 调试：检查BaseResponse的内容
            BaseResponse baseResponse = BaseResponse.success(filteredResponse);
            String baseResponseJson = gson.toJson(baseResponse);
            logger.debug("BaseResponse的JSON格式: {}", baseResponseJson);
            
            // 返回成功响应
            return baseResponse;
            
        } catch (RestClientException e) {
            logger.error("调用如家API失败", e);
            return BaseResponse.error("调用如家API失败: " + e.getMessage());
        } catch (Exception e) {
            logger.error("查询渠道房型失败", e);
            return BaseResponse.error("查询渠道房型失败: " + e.getMessage());
        }
    }
    
    /**
     * 处理酒店代码过滤和数据库操作
     * @param response 原始API响应
     * @return 过滤后的响应
     */
    private HomeinnsChannelRmTypeResponse processHotelCodes(HomeinnsChannelRmTypeResponse response) {
        if (response == null || response.getChannelRmtypes() == null || response.getChannelRmtypes().isEmpty()) {
            logger.warn("响应数据为空，无法处理酒店代码");
            return response;
        }
        
        // 使用新的批量处理方法
        return processHotelCodesBatch(response);
    }
    
    /**
     * 批量处理酒店代码过滤和数据库操作
     * @param response 原始API响应
     * @return 过滤后的响应
     */
    private HomeinnsChannelRmTypeResponse processHotelCodesBatch(HomeinnsChannelRmTypeResponse response) {
        if (response == null || response.getChannelRmtypes() == null || response.getChannelRmtypes().isEmpty()) {
            logger.warn("响应数据为空，无法处理酒店代码");
            return response;
        }
        
        List<HomeinnsChannelRmTypeResponse.ChannelRmType> originalList = response.getChannelRmtypes();
        logger.debug("开始批量处理酒店代码，原始数据数量: {}", originalList.size());
        
        // 1. 从响应体中获取所有hotelCd，组成一个字符串
        List<String> allHotelCds = new ArrayList<>();
        for (HomeinnsChannelRmTypeResponse.ChannelRmType channelRmType : originalList) {
            String hotelCd = channelRmType.getHotelCd();
            if (hotelCd != null && !hotelCd.trim().isEmpty()) {
                allHotelCds.add(hotelCd);
            }
        }
        
        if (allHotelCds.isEmpty()) {
            logger.warn("没有有效的酒店代码，返回空响应");
            HomeinnsChannelRmTypeResponse emptyResponse = new HomeinnsChannelRmTypeResponse();
            emptyResponse.setResCode(response.getResCode());
            emptyResponse.setResDesc(response.getResDesc());
            emptyResponse.setChannelRmtypes(new ArrayList<>());
            return emptyResponse;
        }
        
        logger.debug("提取到 {} 个有效酒店代码", allHotelCds.size());
        
        // 2. 用一条SQL语句查询所有已存在的hotelCd
        List<String> existingHotelCds = new ArrayList<>();
        try {
            existingHotelCds = hotelMapper.selectExistingHotelCodes(allHotelCds);
            logger.debug("查询到 {} 个已存在的酒店代码", existingHotelCds.size());
        } catch (Exception e) {
            logger.error("批量查询酒店代码失败: {}", e.getMessage(), e);
            // 查询失败时，返回原始响应
            return response;
        }
        
        // 3. 获取不存在的hotelCd列表并去重
        List<String> newHotelCds = new ArrayList<>();
        for (String hotelCd : allHotelCds) {
            if (!existingHotelCds.contains(hotelCd) && !newHotelCds.contains(hotelCd)) {
                newHotelCds.add(hotelCd);
            }
        }
        
        logger.debug("需要新增 {} 个酒店代码", newHotelCds.size());
        
        // 4. 循环遍历不存在的hotelCd列表，插入每条酒店记录
        for (String hotelCd : newHotelCds) {
            try {
                Hotel newHotel = new Hotel();
                newHotel.setHotelId(UUID.randomUUID().toString());
                
                // 根据酒店代码前缀设置不同的chainId
                String chainId = determineChainId(hotelCd);
                newHotel.setChainId(chainId);
                
                newHotel.setHotelCode(hotelCd);
                newHotel.setHotelName("如家酒店-" + hotelCd);
                newHotel.setStatus(1); // 1表示正常状态
                
                hotelMapper.insert(newHotel);
                logger.info("成功新增酒店记录: hotelId={}, hotelCode={}, chainId={}", 
                    newHotel.getHotelId(), newHotel.getHotelCode(), newHotel.getChainId());
                    
            } catch (Exception e) {
                logger.error("新增酒店记录失败: hotelCode={}, error={}", hotelCd, e.getMessage(), e);
            }
        }
        
        // 5. 使用新增的hotelCd列表过滤原始的HomeinnsChannelRmTypeResponse
        List<HomeinnsChannelRmTypeResponse.ChannelRmType> filteredList = new ArrayList<>();
        for (HomeinnsChannelRmTypeResponse.ChannelRmType channelRmType : originalList) {
            String hotelCd = channelRmType.getHotelCd();
            // 只保留新增的酒店代码对应的记录
            if (hotelCd != null && !hotelCd.trim().isEmpty() && newHotelCds.contains(hotelCd)) {
                filteredList.add(channelRmType);
                //logger.debug("保留新增酒店代码的记录: hotelCd={}, rmTypeCd={}", hotelCd, channelRmType.getRmTypeCd());
            } else {
                //判断hotelCd=NY0014才打印
                if ("NY0014".equals(hotelCd)) {
                    logger.debug("过滤掉已存在酒店代码的记录: hotelCd={}", hotelCd);
                }
                
            }
        }
        
        // 创建新的响应对象
        HomeinnsChannelRmTypeResponse filteredResponse = new HomeinnsChannelRmTypeResponse();
        filteredResponse.setResCode(response.getResCode());
        filteredResponse.setResDesc(response.getResDesc());
        filteredResponse.setChannelRmtypes(filteredList);
        
        logger.debug("批量处理完成，过滤后数据数量: {}, 原始数量: {}", 
            filteredList.size(), originalList.size());
        
        return filteredResponse;
    }
    
    /**
     * 根据酒店代码前缀确定连锁ID
     * @param hotelCd 酒店代码
     * @return 连锁ID
     */
    private String determineChainId(String hotelCd) {
        if (hotelCd == null || hotelCd.trim().isEmpty()) {
            logger.warn("酒店代码为空，使用默认chainId: homeinns");
            return "homeinns";
        }
        
        String upperHotelCd = hotelCd.toUpperCase();
        
        if (upperHotelCd.startsWith("JG") || upperHotelCd.startsWith("NY") || 
            upperHotelCd.startsWith("JL") || upperHotelCd.startsWith("NH")) {
            logger.debug("酒店代码 {} 以JG/NY/JL/NH开头，设置chainId为: jianguo", hotelCd);
            return "jianguo";
        } else if (upperHotelCd.startsWith("UC")) {
            logger.debug("酒店代码 {} 以UC开头，设置chainId为: yifei", hotelCd);
            return "yifei";
        } else if (upperHotelCd.startsWith("WX")) {
            logger.debug("酒店代码 {} 以WX开头，设置chainId为: wanxin", hotelCd);
            return "wanxin";
        } else {
            logger.debug("酒店代码 {} 不匹配任何前缀，使用默认chainId: homeinns", hotelCd);
            return "homeinns";
        }
    }
}
