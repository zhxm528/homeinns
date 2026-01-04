package com.zai.api.homeinns.inithotels.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zai.api.homeinns.inithotels.entity.Hotel;
import com.zai.api.homeinns.inithotels.entity.RoomType;
import com.zai.api.homeinns.inithotels.mapper.HomeinnsHotelMapper;
import com.zai.api.homeinns.inithotels.mapper.HomeinnsRoomTypeMapper;
import com.zai.api.homeinns.inithotels.service.InitHotelsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * 初始化酒店服务实现类
 */
@Slf4j
@Service
public class InitHotelsServiceImpl implements InitHotelsService {

    private final RestTemplate restTemplate;
    private final HomeinnsHotelMapper hotelMapper;
    private final HomeinnsRoomTypeMapper roomTypeMapper;
    private final ObjectMapper objectMapper;

    @Value("${homeinns.api.base-url}")
    private String baseUrl;

    @Value("${homeinns.api.terminal.license}")
    private String terminalLicense;

    @Value("${homeinns.api.terminal.oprid}")
    private String terminalOprId;

    public InitHotelsServiceImpl(RestTemplate restTemplate, 
                               HomeinnsHotelMapper hotelMapper,
                               HomeinnsRoomTypeMapper roomTypeMapper) {
        this.restTemplate = restTemplate;
        this.hotelMapper = hotelMapper;
        this.roomTypeMapper = roomTypeMapper;
        this.objectMapper = new ObjectMapper();
        
        // 配置RestTemplate以处理text/plain响应
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
    }

    @Override
    public String getAllHotelRoomType() {
        try {
            
            // 1. 获取所有酒店房型列表
            Map<String, Object> channelRmTypeReq = new HashMap<>();
            channelRmTypeReq.put("Type", "T02");
            channelRmTypeReq.put("Terminal_License", terminalLicense);
            channelRmTypeReq.put("Terminal_Seq", generateTerminalSeq());
            channelRmTypeReq.put("Terminal_OprId", terminalOprId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(channelRmTypeReq, headers);

            String url = baseUrl + "/HomeinnsAgentApi/api/HotelInfo/GETChannelRmType";
            log.info("开始调用 GETChannelRmType 接口 - URL: {}", url);
            log.info("请求参数: {}", objectMapper.writeValueAsString(channelRmTypeReq));
            
            String responseStr = restTemplate.postForObject(url, request, String.class);
            log.info("GETChannelRmType接口返回原始数据: {}", responseStr);
            
            // 将响应字符串转换为Map
            Map<String, Object> response = objectMapper.readValue(responseStr, Map.class);
            //log.info("GETChannelRmType接口返回解析后数据: {}", objectMapper.writeValueAsString(response));

            if (response == null || !Objects.equals(response.get("ResCode"), 0)) {
                log.error("获取酒店房型列表失败: {}", response);
                return "获取酒店房型列表失败";
            }

            List<Map<String, String>> channelRmtypes = (List<Map<String, String>>) response.get("ChannelRmtypes");
            if (channelRmtypes == null || channelRmtypes.isEmpty()) {
                return "没有找到酒店房型数据";
            }

            // 2. 按酒店分组处理
            Map<String, List<String>> hotelRoomTypes = new HashMap<>();
            for (Map<String, String> rmType : channelRmtypes) {
                String hotelCode = rmType.get("HotelCd");
                String roomTypeCode = rmType.get("RmTypeCd");
                hotelRoomTypes.computeIfAbsent(hotelCode, k -> new ArrayList<>()).add(roomTypeCode);
            }
            
            
            

            // 3. 处理每个酒店
            for (Map.Entry<String, List<String>> entry : hotelRoomTypes.entrySet()) {
                String hotelCode = entry.getKey();
                List<String> roomTypeCodes = entry.getValue();

                // 3.1 获取酒店详情
                Map<String, Object> hotelInfoReq = new HashMap<>();
                hotelInfoReq.put("HotelCd", hotelCode);
                hotelInfoReq.put("Terminal_License", terminalLicense);
                hotelInfoReq.put("Terminal_Seq", generateTerminalSeq());
                hotelInfoReq.put("Terminal_OprId", terminalOprId);

                request = new HttpEntity<>(hotelInfoReq, headers);
                //log.debug("request: {}", hotelInfoReq);
                url = baseUrl + "/HomeinnsAgentApi/api/HotelInfo/GetHotelInfo";
                log.info("开始调用 GetHotelInfo 接口 - URL: {}", url);
                log.info("请求参数: {}", objectMapper.writeValueAsString(hotelInfoReq));
                Map<String, Object> hotelResponse = restTemplate.postForObject(url, request, Map.class);
                //log.debug("hotelResponse: {}", hotelResponse);
                Hotel hotel = new Hotel();
                if (hotelResponse != null && Objects.equals(hotelResponse.get("ResCode"), 0)) {
                    List<Map<String, Object>> hotelInfos = (List<Map<String, Object>>) hotelResponse.get("HotelInfos");
                    if (hotelInfos != null && !hotelInfos.isEmpty()&&hotelInfos.size()>0) {
                        //if(hotel.getHotelCode()!=null&&"JL0008".equals(hotel.getHotelCode())){
                            //log.debug("hotelInfos: {}", hotelInfos.get(0));                            
                        //}
                        hotel = saveHotel(hotelInfos.get(0));
                        //log.debug("hotelId: {}", hotel.getHotelId());
                        //log.debug("hotelCode: {}", hotel.getHotelCode());
                        //log.debug("chainId: {}", hotel.getChainId());

                        
                        // 3.2 获取每个房型的详情
                        for (String roomTypeCode : roomTypeCodes) {
                            Map<String, Object> roomTypeReq = new HashMap<>();
                            roomTypeReq.put("HotelCd", hotelCode);
                            roomTypeReq.put("StRmTypeCd", roomTypeCode);
                            roomTypeReq.put("Terminal_License", terminalLicense);
                            roomTypeReq.put("Terminal_Seq", generateTerminalSeq());
                            roomTypeReq.put("Terminal_OprId", terminalOprId);

                            request = new HttpEntity<>(roomTypeReq, headers);
                            url = baseUrl + "/HomeinnsAgentApi/api/HotelInfo/GetHotelRmMc";
                            log.info("开始调用 GetHotelRmMc 接口 - URL: {}", url);
                            log.info("请求参数: {}", objectMapper.writeValueAsString(roomTypeReq));

                            String roomTypeResponseStr = restTemplate.postForObject(url, request, String.class);
                            log.info("GetHotelRmMc 接口返回原始数据: {}", roomTypeResponseStr);
                            Map<String, Object> roomTypeResponse = objectMapper.readValue(roomTypeResponseStr, Map.class);
                            //log.info("GetHotelRmMc接口返回解析后数据: {}", objectMapper.writeValueAsString(roomTypeResponse));

                            if (roomTypeResponse != null && Objects.equals(roomTypeResponse.get("ResCode"), 0)) {
                                List<Map<String, Object>> roomTypes = (List<Map<String, Object>>) roomTypeResponse.get("HotelRmMc");
                                if (roomTypes != null && !roomTypes.isEmpty()) {
                                    //log.debug("roomTypes: {}", roomTypes.get(0));
                                    saveRoomType(roomTypes.get(0),hotel);
                                }
                            }
                        }
                    }
                }

                
            }

            return "处理完成";
        } catch (Exception e) {
            log.error("处理酒店房型信息失败", e);
            throw new RuntimeException("处理酒店房型信息失败", e);
        }
    }

    /**
     * 保存酒店信息
     */
    private Hotel saveHotel(Map<String, Object> hotelInfo) {
        Hotel hotel = new Hotel();
        hotel.setHotelId(UUID.randomUUID().toString().replace("-", "")); 
        String hotelCode = (String) hotelInfo.get("s_HotelCd");     //酒店编号
        hotel.setHotelCode(hotelCode);
         // 根据酒店代码前缀设置集团ID
         String chainId;
         if (hotelCode.startsWith("UC")) {
             chainId = "yifei";
         } else if (hotelCode.startsWith("JG") || hotelCode.startsWith("JL")) {
             chainId = "jianguo";
         } else if (hotelCode.startsWith("WX")) {
             chainId = "wanxin";
         } else if (hotelCode.startsWith("NY")) {
             chainId = "nanyuan";
         } else {
             chainId = null;
         }
        hotel.setChainId(chainId);//集团ID
        hotel.setHotelName((String) hotelInfo.get("s_HotelNm"));//酒店名称
        hotel.setAddress((String) hotelInfo.get("s_Address"));//酒店地址
        hotel.setDescription((String) hotelInfo.get("s_Notice"));//酒店描述
        hotel.setCityId((String) hotelInfo.get("s_CityCode"));//城市编号
        hotel.setContactEmail((String) hotelInfo.get("s_Email"));//酒店邮箱
        hotel.setContactPhone((String) hotelInfo.get("s_Tel"));//酒店电话
        hotel.setBrand((String) hotelInfo.get("s_Brand"));//酒店品牌
        hotel.setOpeningDate(parseDate((String) hotelInfo.get("s_HotelOpen")));//酒店开业日期
        hotel.setLastRenovationDate(parseDate((String) hotelInfo.get("s_HotelOpen")));//酒店装修日期
        hotel.setClosureDate(parseDate((String) hotelInfo.get("s_HotelOpen")));//酒店关闭日期
        hotel.setTotalPhysicalRooms(parseInteger((String) hotelInfo.get("CountNum")));//总物理房间数
        hotelMapper.save(hotel);
        return hotel;
    }

    /**
     * 保存房型信息
     */
    private void saveRoomType(Map<String, Object> roomTypeInfo,Hotel hotel) {
        RoomType roomType = new RoomType();    
        roomType.setRoomTypeId(UUID.randomUUID().toString().replace("-", ""));   
        roomType.setChainId(hotel.getChainId());
        roomType.setHotelId(hotel.getHotelId());
        roomType.setRoomTypeCode((String) roomTypeInfo.get("StRmTypeCd"));//房型编号
        roomType.setRoomTypeName((String) roomTypeInfo.get("RmTypeDesp"));//房型名称
        roomType.setDescription((String) roomTypeInfo.get("RoomDesp"));//房型描述
        roomTypeMapper.save(roomType);
    }

    /**
     * 生成终端流水号
     */
    private String generateTerminalSeq() {
        return String.format("%06d", new Random().nextInt(1000000));
    }

    /**
     * 解析日期字符串
     */
    private java.time.LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }
        try {
            return java.time.LocalDate.parse(dateStr.split("T")[0]);
        } catch (Exception e) {
            log.warn("解析日期失败: {}", dateStr);
            return null;
        }
    }

    /**
     * 解析整数
     */
    private Integer parseInteger(String str) {
        if (str == null || str.isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(str);
        } catch (Exception e) {
            log.warn("解析整数失败: {}", str);
            return null;
        }
    }

    /**
     * 解析小数
     */
    private BigDecimal parseDecimal(String str) {
        if (str == null || str.isEmpty()) {
            return null;
        }
        try {
            return new BigDecimal(str);
        } catch (Exception e) {
            log.warn("解析小数失败: {}", str);
            return null;
        }
    }
} 