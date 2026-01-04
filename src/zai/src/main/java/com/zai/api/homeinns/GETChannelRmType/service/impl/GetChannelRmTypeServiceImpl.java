package com.zai.api.homeinns.GETChannelRmType.service.impl;

import com.zai.hotel.entity.Hotel;
import com.zai.roomtype.entity.RoomType;
import com.zai.hotel.mapper.HotelMapper;
import com.zai.roomtype.mapper.RoomTypeMapper;
import com.zai.api.homeinns.GETChannelRmType.model.GetChannelRmTypeRequest;
import com.zai.api.homeinns.GETChannelRmType.model.GetChannelRmTypeResponse;
import com.zai.api.homeinns.GETChannelRmType.service.GetChannelRmTypeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.math.BigDecimal;

@Configuration
class ObjectMapperConfig {
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}

@Service
@SpringBootApplication
@MapperScan({"com.zai.hotel.mapper", "com.zai.roomtype.mapper"})
@EntityScan({"com.zai.hotel.entity", "com.zai.roomtype.entity"})
public class GetChannelRmTypeServiceImpl implements GetChannelRmTypeService {

    private static final Logger logger = LoggerFactory.getLogger(GetChannelRmTypeServiceImpl.class);

    @Value("${homeinns.api.base-url}")
    private String baseUrl;
    
    @Value("${homeinns.api.terminal.license}")
    private String terminalLicense;
    
    @Value("${homeinns.api.terminal.seq}")
    private String terminalSeq;
    
    @Value("${homeinns.api.terminal.oprid}")
    private String terminalOprId;

    private final RestTemplate restTemplate;
    private final HotelMapper hotelMapper;
    private final RoomTypeMapper roomTypeMapper;
    private final ObjectMapper objectMapper;

    public GetChannelRmTypeServiceImpl(RestTemplate restTemplate, 
                                     HotelMapper hotelMapper,
                                     RoomTypeMapper roomTypeMapper,
                                     ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.hotelMapper = hotelMapper;
        this.roomTypeMapper = roomTypeMapper;
        this.objectMapper = objectMapper;
    }

    public static void main(String[] args) {
        // 使用Spring Boot启动应用
        ConfigurableApplicationContext context = SpringApplication.run(GetChannelRmTypeServiceImpl.class, args);
        
        try {
            // 获取服务实例
            GetChannelRmTypeServiceImpl service = context.getBean(GetChannelRmTypeServiceImpl.class);
            
            // 创建请求对象
            GetChannelRmTypeRequest request = new GetChannelRmTypeRequest();
            request.setType("T02");
            // 使用配置的终端参数
            request.setTerminal_License(service.terminalLicense);
            request.setTerminal_Seq(service.terminalSeq);
            request.setTerminal_OprId(service.terminalOprId);
            
            // 调用服务，设置saveToDb为false表示不保存数据
            GetChannelRmTypeResponse response = service.getChannelRmType(request, false);
            
            // 打印响应结果
            System.out.println("响应代码: " + response.getResCode());
            System.out.println("响应描述: " + response.getResDesc());
            if (response.getChannelRmtypes() != null) {
                System.out.println("获取到的房型数量: " + response.getChannelRmtypes().size());
                for (GetChannelRmTypeResponse.ChannelRmType rmType : response.getChannelRmtypes()) {
                    System.out.println("酒店代码: " + rmType.getHotelCd() + ", 房型代码: " + rmType.getRmTypeCd());
                }
            }
        } catch (Exception e) {
            System.err.println("调用服务时发生错误: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // 关闭Spring上下文
            context.close();
        }
    }

    @Override
    @Transactional
    public GetChannelRmTypeResponse getChannelRmType(GetChannelRmTypeRequest request) {
        // 默认不保存数据
        return getChannelRmType(request, false);
    }

    @Override
    @Transactional
    public GetChannelRmTypeResponse getChannelRmType(GetChannelRmTypeRequest request, boolean saveToDb) {
        String url = baseUrl + "/HomeinnsAgentApi/api/HotelInfo/GETChannelRmType";
        
        try {
            // 设置终端参数
            request.setTerminal_License(terminalLicense);
            request.setTerminal_Seq(terminalSeq);
            request.setTerminal_OprId(terminalOprId);
            
            // 打印请求参数
            String requestJson = objectMapper.writeValueAsString(request);
            logger.info("API请求URL: {}", url);
            logger.info("API请求参数: {}", requestJson);
            
            // 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<GetChannelRmTypeRequest> entity = new HttpEntity<>(request, headers);
            
            // 调用API
            ResponseEntity<GetChannelRmTypeResponse> responseEntity = restTemplate.postForEntity(
                url, entity, GetChannelRmTypeResponse.class);
            
            GetChannelRmTypeResponse response = responseEntity.getBody();
            
            // 打印响应结果
            String responseJson = objectMapper.writeValueAsString(response);
            logger.info("API响应状态码: {}", responseEntity.getStatusCode());
            logger.info("API响应结果: {}", responseJson);
            
            if (saveToDb && response != null && response.getChannelRmtypes() != null) {
                // 使用Set来存储唯一的酒店代码
                Set<String> processedHotels = new HashSet<>();
                
                for (GetChannelRmTypeResponse.ChannelRmType channelRmType : response.getChannelRmtypes()) {
                    String hotelCode = channelRmType.getHotelCd().trim();
                    String roomTypeCode = channelRmType.getRmTypeCd().trim();
                    
                    // 处理酒店信息
                    if (!processedHotels.contains(hotelCode)) {
                        processHotel(hotelCode);
                        processedHotels.add(hotelCode);
                    }
                    
                    // 处理房型信息
                    processRoomType(hotelCode, roomTypeCode);
                }
            }
            
            return response;
        } catch (RestClientException e) {
            logger.error("调用API时发生错误: {}", e.getMessage());
            throw new RuntimeException("调用API失败: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("处理API响应时发生错误", e);
            throw new RuntimeException("处理API响应失败", e);
        }
    }
    
    private void processHotel(String hotelCode) {
        Hotel existingHotel = hotelMapper.selectByHotelCodeAndChain(hotelCode, "homeinns");
        
        if (existingHotel == null) {
            // 新增酒店
            Hotel hotel = new Hotel();
            hotel.setHotelId(UUID.randomUUID().toString());
            hotel.setChainId("homeinns");
            hotel.setHotelCode(hotelCode);
            hotel.setHotelName("如家酒店-" + hotelCode);
            hotel.setAddress(
                "地址-" + hotelCode
            );
            hotel.setCityId(
                "城市代码-" + hotelCode
            );
            hotel.setCountry(
                "国家代码-" + hotelCode
            );
            hotel.setDescription(
                "描述-" + hotelCode
            );
            hotel.setContactEmail(
                "联系邮箱-" + hotelCode
            );
            hotel.setContactPhone(
                "联系电话-" + hotelCode
            );
            

            hotel.setStatus(1);
            hotelMapper.insert(hotel);
        } else {
            // 更新酒店状态
            existingHotel.setStatus(1);
            hotelMapper.update(existingHotel);
        }
    }
    
    private void processRoomType(String hotelCode, String roomTypeCode) {
        Hotel hotel = hotelMapper.selectByHotelCodeAndChain(hotelCode, "homeinns");
        if (hotel == null) {
            return;
        }

        RoomType existingRoomType = roomTypeMapper.selectByRoomCodeAndHotelAndChain(
            roomTypeCode, hotel.getHotelId(), "homeinns");
        
        if (existingRoomType == null) {
            // 新增房型
            RoomType roomType = new RoomType();
            roomType.setRoomTypeId(UUID.randomUUID().toString());
            roomType.setChainId("homeinns");
            roomType.setHotelId(hotel.getHotelId());
            roomType.setHotelName(hotel.getHotelName());
            roomType.setRoomTypeCode(roomTypeCode);
            roomType.setRoomTypeName("房型-" + roomTypeCode);
            roomType.setDescription(
                "房型描述-" + roomTypeCode
            );
            roomType.setMaxOccupancy(2);
            roomType.setPhysicalInventory(99);
            roomType.setStandardPrice(BigDecimal.valueOf(9999.0));
            roomType.setStatus(1);
            roomTypeMapper.insert(roomType);
        } else {
            // 更新房型状态
            existingRoomType.setStatus(1);
            roomTypeMapper.update(existingRoomType);
        }
    }
} 