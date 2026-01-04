package com.zai.api.hotelbeds.service;

import com.zai.api.hotelbeds.entity.hotel.HotelApiResponse;
import com.zai.api.hotelbeds.entity.availability.AvailabilityResponse;
import com.zai.api.hotelbeds.entity.availability.AvailabilityHotel;
import com.zai.api.hotelbeds.entity.availability.AvailabilityRate;
import com.zai.api.hotelbeds.entity.availability.AvailabilityRoom;
import com.zai.hotel.entity.Hotel;
import com.zai.roomtype.entity.RoomType;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import com.zai.hotel.mapper.HotelMapper;
import com.zai.roomtype.mapper.RoomTypeMapper;
import java.util.UUID;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Calendar;
import java.math.BigDecimal;
import java.util.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import com.zai.availability.mapper.AvailabilityMapper;
import com.zai.ratecode.entity.RateCode;
import com.zai.ratecode.mapper.RateCodeMapper;
import java.util.Arrays;
import com.zai.api.hotelbeds.dto.CheckHotelInfoResponse;
import java.util.stream.Collectors;
import com.zai.api.hotelbeds.dto.CheckHotelAvailabilityResponse;

@Service
public class HotelBedsHotelApiService {
    private static final Logger logger = LoggerFactory.getLogger(HotelBedsHotelApiService.class);

    @Value("${hotelbeds.api.key}")
    private String apiKey;

    @Value("${hotelbeds.api.secret}")
    private String secret;

    @Value("${hotelbeds.api.base-url}")
    private String baseUrl;

    @Autowired
    private HotelMapper hotelMapper;

    @Autowired
    private RoomTypeMapper roomTypeMapper;

    @Autowired
    private AvailabilityMapper availabilityMapper;

    @Autowired
    private RateCodeMapper rateCodeMapper;

    /**
     * 初始化所有酒店信息
     * 
     * @param hotelCodes 酒店代码列表
     * @return JSON格式的响应字符串
     */
    public JsonObject initAllHotels(JsonArray hotelCodes) {
        try {
            JsonObject resultResponse = new JsonObject();
            JsonObject resultObject = new JsonObject();
            JsonArray hotelsArray = new JsonArray();
            // 1. 构建 URL 参数
            StringBuilder codesBuilder = new StringBuilder();
            for (int i = 0; i < hotelCodes.size(); i++) {
                if (i > 0) {
                    codesBuilder.append(",");
                }
                codesBuilder.append(hotelCodes.get(i).getAsString());
            }
            
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(baseUrl + "hotel-content-api/1.0/hotels")
                .queryParam("countryCode", "CN")
                .queryParam("codes", codesBuilder.toString())
                .queryParam("fields", "all")
                .queryParam("language", "CHI")
                .queryParam("from", 1)
                .queryParam("to", 100);

            String url = uriBuilder.build().toUriString();

            // 2. 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.set("Api-Key", apiKey);
            headers.set("Accept", "application/json;charset=UTF-8");
            headers.set("Accept-Encoding", "gzip");
            headers.set("Content-Type", "application/json;charset=UTF-8");
            headers.set("X-Signature", getSha256Str(apiKey + secret + (Calendar.getInstance().getTimeInMillis() / 1000)));

            // 3. 配置 RestTemplate
            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(HttpClients.createDefault());
            factory.setConnectTimeout(10000);
            factory.setReadTimeout(30000);
            RestTemplate restTemplate = new RestTemplate(factory);
            restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

            // 4. 发送请求
            HttpEntity<String> entity = new HttpEntity<>(headers);
            //logger.debug("Request URL: {}", url);
            //logger.debug("Request Headers: {}", headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
            );

            // 5. 记录响应信息
            //logger.debug("Response Status: {}", response.getStatusCode());
            //logger.debug("Response Headers: {}", response.getHeaders());
            //logger.debug("Response Body: {}", response.getBody());

            // 6. 解析响应结果
            Gson gson = new Gson();
            HotelApiResponse hotelApiResponse = gson.fromJson(response.getBody(), HotelApiResponse.class);
            
            // 7. 遍历酒店信息
            if (hotelApiResponse != null && hotelApiResponse.getHotels() != null) {
                for (HotelApiResponse.Hotel hotel : hotelApiResponse.getHotels()) {
                    // 保存酒店信息
                    Hotel savedHotel = saveHotel(hotel);
                    // 保存房型信息
                    if (hotel.getWildcards() != null) {
                        for (HotelApiResponse.Wildcard wildcard : hotel.getWildcards()) {
                            saveWildcardRoomType(wildcard, savedHotel);
                        }
                    }else {
                        // 保存房型信息
                        if (hotel.getRooms() != null) {
                            for (HotelApiResponse.Room room : hotel.getRooms()) {
                                saveRoomType(room, savedHotel);
                            }
                        } 
                    }
                    

                    // 保存价库
                    JsonObject hotelObject = new JsonObject();
                    JsonArray hotelDailyArray = checkHotelAvailability(savedHotel);
                    hotelObject.addProperty("hotelId", savedHotel.getHotelId());
                    hotelObject.addProperty("hotelCode", savedHotel.getHotelCode());
                    hotelObject.addProperty("hotelName", savedHotel.getHotelName());
                    hotelObject.add("hotel", hotelDailyArray);
                    hotelsArray.add(hotelObject);
                }
            }
            
            // 8. 构建响应体
            resultObject.addProperty("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            resultObject.add("hotels", hotelsArray);
            resultResponse.add("results", resultObject);
            
            return resultResponse;
        } catch (Exception e) {
            logger.error("初始化酒店信息失败: {}", e.getMessage(), e);
            
            // 构建错误响应
            JsonObject resultResponse = new JsonObject();
            resultResponse.addProperty("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
           
            return resultResponse;
        }
    }

    /**
     * 生成SHA256哈希值
     */
    private String getSha256Str(String str) {
        MessageDigest messageDigest;
        String encodeStr = "";
        try {
            messageDigest = MessageDigest.getInstance("SHA-256");
            messageDigest.update(str.getBytes(StandardCharsets.UTF_8));
            encodeStr = byte2Hex(messageDigest.digest());
        } catch (NoSuchAlgorithmException e) {
            logger.error("Error generating SHA-256 hash", e);
        }
        return encodeStr;
    }

    /**
     * 字节数组转16进制字符串
     */
    private String byte2Hex(byte[] bytes) {
        StringBuilder stringBuilder = new StringBuilder();
        String temp;
        for (byte aByte : bytes) {
            temp = Integer.toHexString(aByte & 0xFF);
            if (temp.length() == 1) {
                stringBuilder.append("0");
            }
            stringBuilder.append(temp);
        }
        return stringBuilder.toString();
    }

    /**
     * 保存酒店信息到数据库
     * 
     * @param hotel HotelBeds API返回的酒店信息
     * @return 保存后的酒店实体
     */
    public Hotel saveHotel(HotelApiResponse.Hotel hotel) {
        try {
            // 1. 检查酒店是否已存在
            String chainId = "hotelbeds";
            String hotelCode = String.valueOf(hotel.getCode());
            Hotel existingHotel = hotelMapper.selectByChainIdAndHotelCode(chainId, hotelCode);
            
            if (existingHotel != null) {
                logger.debug("酒店已存在，更新信息: chainId={}, hotelCode={}", chainId, hotelCode);
                // 更新现有酒店信息 2025-06-12 暂时不更新 因为酒店名称和描述可能为英文
                //existingHotel.setHotelName(hotel.getName().getContent());

                // if (hotel.getDescription() != null) {
                //     existingHotel.setDescription(hotel.getDescription().getContent());
                // }
                //existingHotel.setCountry(hotel.getCountryCode());
                
                // 更新地址信息 2025-06-12 暂时不更新 因为酒店名称和描述可能为英文 
                // if (hotel.getAddress() != null) {
                //     existingHotel.setAddress(hotel.getAddress().getStreet());
                // }
                
                // 更新城市信息 2025-06-12 暂时不更新 因为和本地的城市代码表对不上
                // if (hotel.getCity() != null) {
                //     existingHotel.setCityId(hotel.getCity().getContent());
                // }
                
                // 更新联系方式
                if (hotel.getPhones() != null && !hotel.getPhones().isEmpty()) {
                    existingHotel.setContactPhone(hotel.getPhones().get(0).getPhoneNumber());
                }
                // 更新酒店email
                if (hotel.getEmail() != null && !hotel.getEmail().isEmpty()) {
                    existingHotel.setContactEmail(hotel.getEmail());
                }
                
                // 更新房间数量
                if (hotel.getRooms() != null) {
                    existingHotel.setTotalPhysicalRooms(hotel.getRooms().size());
                }
                
                // 更新更新时间
                existingHotel.setUpdatedAt(new Date());
                
                // 更新到数据库
                hotelMapper.updateById(existingHotel);
                
                return existingHotel;
            }
            
            // 2. 创建新的酒店实体
            Hotel hotelEntity = new Hotel();
            hotelEntity.setChainId(chainId);
            
            // 3. 设置基本信息
            hotelEntity.setHotelId(UUID.randomUUID().toString().replace("-", ""));
            hotelEntity.setHotelCode(hotelCode);
            hotelEntity.setHotelName(hotel.getName().getContent());
            if (hotel.getDescription() != null) {
                hotelEntity.setDescription(hotel.getDescription().getContent());
            }
            hotelEntity.setCountry(hotel.getCountryCode());
            hotelEntity.setStatus(1); // 1表示正常状态
            
            // 4. 设置地址信息
            if (hotel.getAddress() != null) {
                hotelEntity.setAddress(hotel.getAddress().getStreet());
            }
            
            // 5. 设置城市信息
            if (hotel.getCity() != null) {
                hotelEntity.setCityId(hotel.getCity().getContent());
            }
            
            // 6. 设置联系方式
            if (hotel.getPhones() != null && !hotel.getPhones().isEmpty()) {
                hotelEntity.setContactPhone(hotel.getPhones().get(0).getPhoneNumber());
            }
            
            // 7. 设置房间数量
            if (hotel.getRooms() != null) {
                hotelEntity.setTotalPhysicalRooms(hotel.getRooms().size());
            }
            
            // 8. 设置创建和更新时间
            Date now = new Date();
            hotelEntity.setCreatedAt(now);
            hotelEntity.setUpdatedAt(now);
            
            // 9. 保存到数据库
            hotelMapper.insert(hotelEntity);
            
            logger.debug("酒店信息保存成功: hotelCode={}, hotelName={}", 
                hotelEntity.getHotelCode(), 
                hotelEntity.getHotelName());
            
            return hotelEntity;
        } catch (Exception e) {
            logger.error("保存酒店信息失败: {}", e.getMessage(), e);
            throw new RuntimeException("保存酒店信息失败: " + e.getMessage());
        }
    }

    /**
     * 保存房型信息到数据库
     * 
     * @param room HotelBeds API返回的房型信息
     * @param hotel 关联的酒店信息
     * @return 保存后的房型实体
     */
    public RoomType saveRoomType(HotelApiResponse.Room room, Hotel hotel) {
        try {
            // 1. 检查房型是否已存在
            RoomType existingRoomType = roomTypeMapper.selectByChainIdAndHotelIdAndRoomTypeCode(
                hotel.getChainId(), 
                hotel.getHotelId(), 
                room.getRoomCode()
            );
            
            if (existingRoomType != null) {
                logger.debug("房型已存在，更新信息: chainId={}, hotelId={}, roomTypeCode={}", 
                    hotel.getChainId(), hotel.getHotelId(), room.getRoomCode());
                
                // 更新现有房型信息
                //existingRoomType.setRoomTypeName(room.getRoomType());
                existingRoomType.setMaxOccupancy(room.getMaxPax());
                existingRoomType.setUpdatedAt(new Date());
                
                // 更新到数据库
                roomTypeMapper.updateById(existingRoomType);
                
                return existingRoomType;
            }
            
            // 2. 创建新的房型实体
            RoomType roomType = new RoomType();
            
            // 3. 设置基本信息
            roomType.setRoomTypeId(UUID.randomUUID().toString().replace("-", ""));
            roomType.setChainId(hotel.getChainId());
            roomType.setHotelId(hotel.getHotelId());
            roomType.setHotelName(hotel.getHotelName());
            roomType.setRoomTypeCode(room.getRoomCode());
            roomType.setRoomTypeName(room.getRoomType());
            
            // 4. 设置入住人数
            roomType.setMaxOccupancy(room.getMaxPax());
            
            // 5. 设置物理库存（默认为1）
            roomType.setPhysicalInventory(1);
            
            // 6. 设置状态（1表示正常）
            roomType.setStatus(1);
            
            // 7. 设置创建和更新时间
            Date now = new Date();
            roomType.setCreatedAt(now);
            roomType.setUpdatedAt(now);
            
            // 8. 保存到数据库
            roomTypeMapper.insert(roomType);
            
            logger.debug("房型信息保存成功: roomTypeCode={}, roomTypeName={}", 
                roomType.getRoomTypeCode(), 
                roomType.getRoomTypeName());
            
            return roomType;
        } catch (Exception e) {
            logger.error("保存房型信息失败: {}", e.getMessage(), e);
            throw new RuntimeException("保存房型信息失败: " + e.getMessage());
        }
    }

    /**
     * 保存通配符房型信息到数据库
     * 
     * @param wildcard HotelBeds API返回的通配符房型信息
     * @param hotel 关联的酒店信息
     * @return 保存后的房型实体
     */
    public RoomType saveWildcardRoomType(HotelApiResponse.Wildcard wildcard, Hotel hotel) {
        try {
            // 1. 检查房型是否已存在
            RoomType existingRoomType = roomTypeMapper.selectByChainIdAndHotelIdAndRoomTypeCode(
                hotel.getChainId(), 
                hotel.getHotelId(), 
                wildcard.getRoomType()
            );
            
            if (existingRoomType != null) {
                logger.debug("通配符房型已存在，更新信息: chainId={}, hotelId={}, roomTypeCode={}", 
                    hotel.getChainId(), hotel.getHotelId(), wildcard.getRoomType());
                
                // 更新现有房型信息
                if (wildcard.getHotelRoomDescription() != null) {
                    existingRoomType.setRoomTypeName(wildcard.getHotelRoomDescription().getContent());
                    existingRoomType.setDescription(wildcard.getHotelRoomDescription().getContent());
                }
                existingRoomType.setUpdatedAt(new Date());
                
                // 更新到数据库
                roomTypeMapper.updateById(existingRoomType);
                
                return existingRoomType;
            }
            
            // 2. 创建新的房型实体
            RoomType roomType = new RoomType();
            
            // 3. 设置基本信息
            roomType.setRoomTypeId(UUID.randomUUID().toString().replace("-", ""));
            roomType.setChainId(hotel.getChainId());
            roomType.setHotelId(hotel.getHotelId());
            roomType.setHotelName(hotel.getHotelName());
            roomType.setRoomTypeCode(wildcard.getRoomType());
            roomType.setRoomTypeName(wildcard.getRoomType());
            
            // 4. 设置描述信息
            if (wildcard.getHotelRoomDescription() != null) {
                roomType.setDescription(wildcard.getHotelRoomDescription().getContent());
            }
            
            // 5. 设置物理库存（默认为1）
            roomType.setPhysicalInventory(1);
            
            // 6. 设置状态（1表示正常）
            roomType.setStatus(1);
            
            // 7. 设置创建和更新时间
            Date now = new Date();
            roomType.setCreatedAt(now);
            roomType.setUpdatedAt(now);
            
            // 8. 保存到数据库
            roomTypeMapper.insert(roomType);
            
            logger.debug("通配符房型信息保存成功: roomTypeCode={}, roomTypeName={}", 
                roomType.getRoomTypeCode(), 
                roomType.getRoomTypeName());
            
            return roomType;
        } catch (Exception e) {
            logger.error("保存通配符房型信息失败: {}", e.getMessage(), e);
            throw new RuntimeException("保存通配符房型信息失败: " + e.getMessage());
        }
    }

    /**
     * 调用 HotelBeds Hotel Availability API 查询酒店可用性
     * 
     * @param hotel 酒店信息
     * @return JsonArray 响应数组
     */
    public JsonArray checkHotelAvailability(Hotel hotel) {
        try {
            // 1. 构建请求体
            JsonObject requestBody = new JsonObject();
            
            // 1.1 设置入住日期（今天）和退房日期（明天）
            JsonObject stay = new JsonObject();
            LocalDate today = LocalDate.now();
            // String checkInDate = today.format(DateTimeFormatter.ISO_DATE);
            // String checkOutDate = today.plusDays(7).format(DateTimeFormatter.ISO_DATE);
            // stay.addProperty("checkIn", checkInDate);
            // stay.addProperty("checkOut", checkOutDate);
            // requestBody.add("stay", stay);
            
            // 1.2 设置酒店代码
            JsonObject hotels = new JsonObject();
            JsonArray hotelArray = new JsonArray();
            hotelArray.add(hotel.getHotelCode());
            hotels.add("hotel", hotelArray);
            requestBody.add("hotels", hotels);
            
            // 1.3 设置入住人数
            JsonArray occupancies = new JsonArray();
            JsonObject occupancy = new JsonObject();
            occupancy.addProperty("rooms", 1);
            occupancy.addProperty("adults", 2);
            occupancy.addProperty("children", 0);
            occupancies.add(occupancy);
            requestBody.add("occupancies", occupancies);
            
            // 2. 构建 URL
            String url = baseUrl + "hotel-api/1.0/hotels";
            
            // 3. 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.set("Api-Key", apiKey);
            headers.set("Accept", "application/json");
            headers.set("Accept-Encoding", "gzip");
            headers.set("Content-Type", "application/json");
            headers.set("X-Signature", getSha256Str(apiKey + secret + (Calendar.getInstance().getTimeInMillis() / 1000)));
            
            // 4. 配置 RestTemplate
            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(HttpClients.createDefault());
            factory.setConnectTimeout(10000);
            factory.setReadTimeout(30000);
            RestTemplate restTemplate = new RestTemplate(factory);
            restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
            
            // 5. 循环调用API，获取7天的数据
            JsonArray responseArray = new JsonArray();
            for (int i = 0; i < 14; i++) {
                // 更新入住和退房日期
                LocalDate currentCheckIn = today.plusDays(i);
                LocalDate currentCheckOut = currentCheckIn.plusDays(1);
                String currentCheckInDate = currentCheckIn.format(DateTimeFormatter.ISO_DATE);
                String currentCheckOutDate = currentCheckOut.format(DateTimeFormatter.ISO_DATE);
                
                // 更新请求体中的日期
                stay.addProperty("checkIn", currentCheckInDate);
                stay.addProperty("checkOut", currentCheckOutDate);
                requestBody.add("stay", stay);
                
                // 发送请求
                HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);
                logger.debug("Request URL: {}", url);
                logger.debug("Request Headers: {}", headers);
                logger.debug("Request Body: {}", requestBody.toString());
                
                ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
                );
                
                // 记录响应信息
                logger.debug("Response Status: {}", response.getStatusCode());
                logger.debug("Response Headers: {}", response.getHeaders());
                logger.debug("Response Body: {}", response.getBody());
                
                // 解析响应结果
                Gson gson = new Gson();
                
                // 检查是否为空响应
                JsonObject responseJson = JsonParser.parseString(response.getBody()).getAsJsonObject();
                
                JsonObject resultResponse = new JsonObject();
                if (responseJson.has("hotels") && responseJson.getAsJsonObject("hotels").has("total") 
                    && responseJson.getAsJsonObject("hotels").get("total").getAsInt() == 0) {
                    
                    // 构建错误响应
                    resultResponse.addProperty("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    resultResponse.addProperty("errorCode", 4001);
                    resultResponse.addProperty("message", "HB接口查询不到价格");
                    resultResponse.addProperty("response", response.getBody());
                    resultResponse.addProperty("hotelId", hotel.getHotelCode());
                    resultResponse.addProperty("checkIn", currentCheckInDate);
                    resultResponse.addProperty("checkOut", currentCheckOutDate);
                    
                    logger.warn("HotelBeds API返回空响应: {}", resultResponse.toString());
                } else {
                    resultResponse.addProperty("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    resultResponse.addProperty("errorCode", 1000);
                    resultResponse.addProperty("message", "价格已更新");
                    resultResponse.addProperty("response", response.getBody());
                    resultResponse.addProperty("hotelId", hotel.getHotelCode());
                    resultResponse.addProperty("checkIn", currentCheckInDate);
                    resultResponse.addProperty("checkOut", currentCheckOutDate);
                
                    // 保存可用性数据
                    AvailabilityResponse availabilityResponse = gson.fromJson(response.getBody(), AvailabilityResponse.class);
                    saveAvailabilityData(availabilityResponse, hotel);
                }
                
                // 将结果添加到数组
                responseArray.add(resultResponse);
                
                // 添加延迟，避免请求过于频繁
                Thread.sleep(1000);
            }
            
            return responseArray;
        } catch (Exception e) {
            logger.error("查询酒店可用性失败: {}", e.getMessage(), e);
            throw new RuntimeException("查询酒店可用性失败: " + e.getMessage());
        }
    }

    /**
     * 保存可用性数据到数据库
     * 
     * @param availabilityResponse HotelBeds API返回的可用性数据
     * @return 保存的记录数
     */
    public int saveAvailabilityData(AvailabilityResponse availabilityResponse, Hotel hotelEnity) {
        try {
            if (availabilityResponse == null || availabilityResponse.getHotels() == null 
                || availabilityResponse.getHotels().getHotels() == null) {
                logger.warn("可用性数据为空，跳过保存");
                return 0;
            }

            List<Map<String, Object>> priceList = new ArrayList<>();
            List<Map<String, Object>> statusList = new ArrayList<>();
            int totalRecords = 0;

            String chainId = hotelEnity.getChainId();
            String checkIn = availabilityResponse.getHotels().getCheckIn();
            String checkOut = availabilityResponse.getHotels().getCheckOut();

            // 遍历酒店数据            
            for (AvailabilityHotel hotel : availabilityResponse.getHotels().getHotels()) {                
                String hotelId = hotelEnity.getHotelId();
                String hotelCode = String.valueOf(hotel.getCode());
                
                // 遍历房型数据
                if (hotel.getRooms() != null) {
                    for (AvailabilityRoom room : hotel.getRooms()) {
                        String roomTypeCode = room.getCode();
                        RoomType roomTypeEnity = getRoomTypeByCode(chainId, hotelId, roomTypeCode);
                        String roomTypeId = roomTypeEnity.getRoomTypeId();

                        // 遍历日期数据
                        if (room.getRates() != null) {
                            for (AvailabilityRate rate : room.getRates()) {
                                String rateKey = rate.getRateKey();
                                RateCode rateCodeEnity = getRateCodeByCode(chainId, hotelId, rateKey);
                                String rateCode = rateCodeEnity.getRateCode();
                                String rateCodeId = rateCodeEnity.getRateCodeId();

                                // 1. 构建价格数据
                                Map<String, Object> priceData = new HashMap<>();
                                priceData.put("priceId", UUID.randomUUID().toString().replace("-", ""));
                                priceData.put("chainId", chainId);
                                priceData.put("hotelId", hotelId);
                                priceData.put("hotelCode", hotelCode);
                                priceData.put("ratePlanId", rateKey);
                                priceData.put("roomTypeId", roomTypeId);
                                priceData.put("roomTypeCode", roomTypeCode);
                                priceData.put("rateCodeId", rateCodeId);
                                priceData.put("rateCode", rateCode);
                                priceData.put("stayDate", checkIn);
                                priceData.put("channelSingleOccupancy", rate.getNet());
                                priceData.put("channelDoubleOccupancy", rate.getNet());
                                priceData.put("hotelSingleOccupancy", rate.getNet());
                                priceData.put("hotelDoubleOccupancy", rate.getNet());
                                priceData.put("agentSingleOccupancy", rate.getNet());
                                priceData.put("agentDoubleOccupancy", rate.getNet());
                                priceList.add(priceData);

                                // 2. 构建库存状态数据
                                Map<String, Object> statusData = new HashMap<>();
                                statusData.put("statusId", UUID.randomUUID().toString().replace("-", ""));
                                statusData.put("chainId", chainId);
                                statusData.put("hotelId", hotelId);
                                statusData.put("hotelCode", hotelCode);
                                statusData.put("ratePlanId", rateKey);
                                statusData.put("roomTypeId", roomTypeId);
                                statusData.put("roomTypeCode", roomTypeCode);
                                statusData.put("rateCodeId", rateCodeId);
                                statusData.put("rateCode", rateCode);
                                statusData.put("stayDate", checkIn);
                                statusData.put("isAvailable", "BOOKABLE".equalsIgnoreCase(rate.getRateType()) ? "O" : "C");
                                statusData.put("remainingInventory", rate.getAllotment());
                                statusData.put("soldInventory", 0);
                                statusData.put("minStayDays", 0);
                                statusData.put("maxStayDays", 999);
                                statusData.put("minAdvanceDays", 0);
                                statusData.put("maxAdvanceDays", 999);
                                statusData.put("latestCancelDays", 0);
                                statusData.put("latestCancelTimeSameDay", "18:00");
                                statusData.put("paymentType", "prepay");
                                statusData.put("latestReservationTimeSameDay", "18:00");
                                statusData.put("isCancellable", true);
                                statusData.put("cancelPenalty", "0");
                                statusList.add(statusData);

                                totalRecords++;
                            }
                        }
                    }
                }
            }

            // 批量保存数据
            if (!priceList.isEmpty()) {
                availabilityMapper.batchInsertRatePrices(priceList);
            }
            if (!statusList.isEmpty()) {
                availabilityMapper.batchInsertRateInventoryStatus(statusList);
            }

            logger.debug("可用性数据保存成功，共处理 {} 条记录", totalRecords);
            return totalRecords;
        } catch (Exception e) {
            logger.error("保存可用性数据失败: {}", e.getMessage(), e);
            throw new RuntimeException("保存可用性数据失败: " + e.getMessage());
        }
    }

    /**
     * 根据chainId、hotelId和roomTypeCode查询房型信息，如果不存在则创建
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param roomTypeCode 房型代码
     * @return RoomType对象
     */
    public RoomType getRoomTypeByCode(String chainId, String hotelId, String roomTypeCode) {
        try {
            // 1. 查询现有的房型
            RoomType existingRoomType = roomTypeMapper.selectByChainIdAndHotelIdAndRoomTypeCode(chainId, hotelId, roomTypeCode);
            
            if (existingRoomType != null) {
                logger.debug("找到现有房型: chainId={}, hotelId={}, roomTypeCode={}", chainId, hotelId, roomTypeCode);
                return existingRoomType;
            }
            
            // 2. 创建新的房型
            RoomType newRoomType = new RoomType();
            newRoomType.setRoomTypeId(UUID.randomUUID().toString().replace("-", ""));
            newRoomType.setChainId(chainId);
            newRoomType.setHotelId(hotelId);
            newRoomType.setRoomTypeCode(roomTypeCode);
            newRoomType.setRoomTypeName(roomTypeCode);
            newRoomType.setDescription(roomTypeCode);
            newRoomType.setMaxOccupancy(2); // 默认最大入住人数为2
            newRoomType.setPhysicalInventory(999); // 默认物理库存为1
            newRoomType.setStatus(1); // 1表示正常状态
            
            // 4. 保存到数据库
            roomTypeMapper.insert(newRoomType);
            
            logger.debug("创建新房型: chainId={}, hotelId={}, roomTypeCode={}", chainId, hotelId, roomTypeCode);
            return newRoomType;
        } catch (Exception e) {
            logger.error("获取或创建房型失败: chainId={}, hotelId={}, roomTypeCode={}", chainId, hotelId, roomTypeCode, e);
            throw new RuntimeException("获取或创建房型失败: " + e.getMessage());
        }
    }

    /**
     * 解析rateKey字符串，提取board code
     * @param rateKey 格式如："20250611|20250612|W|439|944761|TWN.DX|ID_B2B_26|RO|HBSP30OFF|1~2~0||N@07~A-SIC~25e110~78272554~N~~~NOR~~E9ECDA207D8D49D174957203871706AACN0001000100010521bf2""
     * @return board code，如："GAR - TODOS"
     */
    private String parseBoardCodeFromRateKey(String rateKey) {
        try {
            if (rateKey == null || rateKey.isEmpty()) {
                return null;
            }
            String[] parts = rateKey.split("\\|");
            if (parts.length >= 9) {
                return parts[8];
            }
            return null;
        } catch (Exception e) {
            logger.error("解析rateKey失败: {}", rateKey, e);
            return null;
        }
    }

    /**
     * 根据chainId、hotelId和rateCode获取或创建RateCode对象
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     * @param rateCode 价格代码
     * @return RateCode对象
     */
    public RateCode getRateCodeByCode(String chainId, String hotelId, String rateKey) {
        try {
            String rateCode= parseBoardCodeFromRateKey(rateKey);
            // 1. 查询现有的RateCode
            List<RateCode> existingRateCodes = rateCodeMapper.selectByChainIdAndHotelIdAndRateCode(chainId, hotelId, rateCode);
            RateCode existingRateCode = existingRateCodes.get(0);
            
            if (existingRateCode != null) {
                logger.debug("找到现有价格代码: chainId={}, hotelId={}, rateCode={}", chainId, hotelId, rateCode);
                return existingRateCode;
            }
            
            // 2. 创建新的RateCode
            RateCode rateCodeEnity = new RateCode();
            rateCodeEnity.setChainId(chainId);
            rateCodeEnity.setHotelId(hotelId);
            rateCodeEnity.setRateCode(rateCode);
            rateCodeEnity.setRateCodeName(rateCode);
            rateCodeEnity.setDescription(rateCode);
            rateCodeEnity.setMarketCode("");
            rateCodeEnity.setChannelId("");
            rateCodeEnity.setMinlos(0);
            rateCodeEnity.setMaxlos(999);
            rateCodeEnity.setMinadv(0);
            rateCodeEnity.setMaxadv(999);
            
            // 转换日期格式
            // 设置有效期：从当前日期到一年后
            LocalDate today = LocalDate.now();
            LocalDate oneYearLater = today.plusYears(1);
            rateCodeEnity.setValidFrom(today.format(DateTimeFormatter.ISO_DATE));
            rateCodeEnity.setValidTo(oneYearLater.format(DateTimeFormatter.ISO_DATE));
            rateCodeEnity.setValidFrom(today.format(DateTimeFormatter.ISO_DATE));
            rateCodeEnity.setValidTo(oneYearLater.format(DateTimeFormatter.ISO_DATE));
            rateCodeEnity.setStayStartDate(today.format(DateTimeFormatter.ISO_DATE));
            rateCodeEnity.setStayEndDate(oneYearLater.format(DateTimeFormatter.ISO_DATE));
            rateCodeEnity.setBookingStartDate(today.format(DateTimeFormatter.ISO_DATE));
            rateCodeEnity.setBookingEndDate(oneYearLater.format(DateTimeFormatter.ISO_DATE));
            
            rateCodeEnity.setLimitStartTime("00:00");
            rateCodeEnity.setLimitEndTime("23:59");
           
            rateCodeEnity.setLimitAvailWeeks("1111111");
            rateCodeEnity.setPriceModifier("1");
            rateCodeEnity.setIsPercentage(0);
            rateCodeEnity.setReservationType("");
            rateCodeEnity.setCancellationType("");
            rateCodeEnity.setLatestCancellationDays(0);
            rateCodeEnity.setLatestCancellationTime("18:00");
            rateCodeEnity.setCancellableAfterBooking(0);//0:不可取消 1:可取消
            rateCodeEnity.setOrderRetentionTime("18:00");//入住当天最晚保留时间
            rateCodeEnity.setPriceRuleType("0");//0:固定价格 1:基础价 2:折扣价
            rateCodeEnity.setParentRateCodeId("");
            
            // 生成rateCodeId
            String rateCodeId = UUID.randomUUID().toString().replace("-", "");
            rateCodeEnity.setRateCodeId(rateCodeId);
            
            // 4. 保存到数据库
            rateCodeMapper.insert(rateCodeEnity);
            
            logger.debug("创建新的价格代码: chainId={}, hotelId={}, rateCode={}", chainId, hotelId, rateCode);
            return rateCodeEnity;
        } catch (Exception e) {
            throw new RuntimeException("获取或创建价格代码失败: " + e.getMessage());
        }
    }

    /**
     * 调用 HotelBeds API 获取酒店详情
     * @param requestBody 请求体
     * @return HotelApiResponse 响应对象
     */
    public HotelApiResponse getApiResponse(String requestBody) {
        try {
            // 1. 构建 URL
            String url = baseUrl + "hotel-content-api/1.0/hotels";
            
            // 2. 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.set("Api-Key", apiKey);
            headers.set("Accept", "application/json;charset=UTF-8");
            headers.set("Accept-Encoding", "gzip");
            headers.set("Content-Type", "application/json;charset=UTF-8");
            headers.set("X-Signature", getSha256Str(apiKey + secret + (Calendar.getInstance().getTimeInMillis() / 1000)));
            
            // 3. 配置 RestTemplate
            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(HttpClients.createDefault());
            factory.setConnectTimeout(10000);
            factory.setReadTimeout(30000);
            RestTemplate restTemplate = new RestTemplate(factory);
            restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
            
            // 4. 发送请求
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            logger.debug("Request URL: {}", url);
            logger.debug("Request Headers: {}", headers);
            logger.debug("Request Body: {}", requestBody);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
            );
            
            // 5. 记录响应信息
            logger.debug("Response Status: {}", response.getStatusCode());
            logger.debug("Response Headers: {}", response.getHeaders());
            logger.debug("Response Body: {}", response.getBody());
            
            // 6. 解析响应结果
            Gson gson = new Gson();
            return gson.fromJson(response.getBody(), HotelApiResponse.class);
        } catch (Exception e) {
            logger.error("调用 HotelBeds API 失败: {}", e.getMessage(), e);
            throw new RuntimeException("调用 HotelBeds API 失败: " + e.getMessage());
        }
    }


    /**
     * 查询酒店可用性
     * 
     * @param hotels 酒店ID列表
     * @param checkDate 查询日期 (格式: yyyy-MM-dd)
     * @return JsonObject 查询结果
     */
    public List<CheckHotelAvailabilityResponse> getHotelAvailability(List<String> hotels, String checkDate) {
        try {
            
            List<CheckHotelAvailabilityResponse> hotelsArray = new ArrayList<>();
            
            // 1. 参数验证
            if (hotels == null || hotels.isEmpty()) {
                throw new IllegalArgumentException("酒店ID列表不能为空");
            }
            
            if (checkDate == null || checkDate.trim().isEmpty()) {
                throw new IllegalArgumentException("查询日期不能为空");
            }
            
            // 2. 验证日期格式
            LocalDate checkInDate;
            try {
                checkInDate = LocalDate.parse(checkDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } catch (Exception e) {
                throw new IllegalArgumentException("日期格式错误，请使用yyyy-MM-dd格式");
            }
            
            // 3. 遍历酒店列表，查询每个酒店的可用性
            for (String hotelCode : hotels) {
                try {
                    
                    List<String> hotelIds = Arrays.asList(hotelCode);
                    CheckHotelInfoResponse checkHotelInfoResponse = new CheckHotelInfoResponse();
                    CheckHotelAvailabilityResponse checkHotelAvailabilityResponse = new CheckHotelAvailabilityResponse();
                    // 获取酒店信息
                    HotelApiResponse hotelApiResponse = getHotelInfo(hotelIds);
                    if (hotelApiResponse != null) {
                        // 检查total字段，如果为0则创建空的酒店信息响应
                        if (hotelApiResponse.getTotal() == 0) {
                            logger.debug("酒店信息API返回total为0，创建空的酒店信息响应: hotelCode={}", hotelCode);
                            checkHotelInfoResponse = createEmptyHotelInfoResponse(hotelCode);
                        } else {
                            checkHotelInfoResponse = parseHotelInfo(hotelApiResponse,hotelCode);
                        }
                    } else {
                        logger.debug("酒店信息API返回null，创建空的酒店信息响应: hotelCode={}", hotelCode);
                        checkHotelInfoResponse = createEmptyHotelInfoResponse(hotelCode);
                    }

                                         // 查询酒店可用性
                     AvailabilityResponse availabilityResponse = getHotelAvailabilityByDate(hotelCode, checkDate);
                     if (availabilityResponse != null) {
                         // 检查是否有可用性数据
                         if (availabilityResponse.getHotels() != null && availabilityResponse.getHotels().getTotal() != null && availabilityResponse.getHotels().getTotal() > 0) {
                             // 有可用性数据，正常解析
                             checkHotelAvailabilityResponse = parseAvailabilityResponse(availabilityResponse);
                             checkHotelAvailabilityResponse.setHotelCode(checkHotelInfoResponse.getHotelCode());
                             checkHotelAvailabilityResponse.setHotelName(checkHotelInfoResponse.getHotelName());
                             checkHotelAvailabilityResponse.setAddress(checkHotelInfoResponse.getAddress());
                             checkHotelAvailabilityResponse.setRoomTypeNum(checkHotelInfoResponse.getRoomTypeNum());
                             checkHotelAvailabilityResponse.setRoomTypeCodes(checkHotelInfoResponse.getRoomTypeCodes());
                             checkHotelAvailabilityResponse.setCheckDate(checkDate);
                         } else {
                             // 没有可用性数据 (total: 0)，单独处理
                             checkHotelAvailabilityResponse = createEmptyAvailabilityResponse(checkHotelInfoResponse, checkDate);
                         }
                     } else {
                         // API调用失败，创建默认响应
                         checkHotelAvailabilityResponse = createEmptyAvailabilityResponse(checkHotelInfoResponse, checkDate);
                     }

                     hotelsArray.add(checkHotelAvailabilityResponse);


                   
                } catch (Exception e) {
                    
                }
                
                // 添加延迟，避免请求过于频繁
                Thread.sleep(500);
            }
            
            
            
            return hotelsArray;
            
        } catch (Exception e) {
            
        }
        return null;


        
    }

    /**
     * 根据酒店ID列表查询酒店详细信息
     * 调用HotelBeds Hotel Content API获取酒店基础信息
     * 
     * @param hotelIds 酒店ID列表
     * @return JsonObject 包含酒店详细信息的响应
     */
    public HotelApiResponse getHotelInfo(List<String> hotelIds) {
        try {
            JsonObject resultResponse = new JsonObject();
            JsonArray hotelsArray = new JsonArray();
            
            // 1. 参数验证
            if (hotelIds == null || hotelIds.isEmpty()) {
                throw new IllegalArgumentException("酒店ID列表不能为空");
            }
            
            // 2. 构建酒店代码字符串
            StringBuilder codesBuilder = new StringBuilder();
            for (int i = 0; i < hotelIds.size(); i++) {
                if (i > 0) {
                    codesBuilder.append(",");
                }
                codesBuilder.append(hotelIds.get(i));
            }
            
            // 3. 构建URL参数
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(baseUrl + "hotel-content-api/1.0/hotels")
                .queryParam("countryCode", "CN")
                .queryParam("codes", codesBuilder.toString())
                .queryParam("fields", "all")
                .queryParam("language", "CHI")
                .queryParam("from", 1)
                .queryParam("to", hotelIds.size());

            String url = uriBuilder.build().toUriString();

            // 4. 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.set("Api-Key", apiKey);
            headers.set("Accept", "application/json;charset=UTF-8");
            headers.set("Accept-Encoding", "gzip");
            headers.set("Content-Type", "application/json;charset=UTF-8");
            headers.set("X-Signature", getSha256Str(apiKey + secret + (Calendar.getInstance().getTimeInMillis() / 1000)));

            // 5. 配置RestTemplate
            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(HttpClients.createDefault());
            factory.setConnectTimeout(10000);
            factory.setReadTimeout(30000);
            RestTemplate restTemplate = new RestTemplate(factory);
            restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

            // 6. 发送请求
            HttpEntity<String> entity = new HttpEntity<>(headers);
            logger.debug("查询酒店信息 - Request URL: {}", url);
            logger.debug("查询酒店信息 - Request Headers: {}", headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
            );

            // 7. 记录响应信息
            logger.debug("查询酒店信息 - Response Status: {}", response.getStatusCode());
            logger.debug("查询酒店信息 - Response Body: {}", response.getBody());

            // 8. 解析响应结果
            Gson gson = new Gson();
            HotelApiResponse hotelApiResponse = gson.fromJson(response.getBody(), HotelApiResponse.class);
            
            
            
            return hotelApiResponse;
            
        } catch (Exception e) {
            logger.error("查询酒店信息失败: {}", e.getMessage(), e);
            
           
        }
        return null;
    }

    /**
     * 解析HotelApiResponse对象并生成CheckHotelInfoResponse对象
     * @param hotelApiResponse HotelBeds API返回的酒店详情
     * @return CheckHotelInfoResponse对象
     */
    public CheckHotelInfoResponse parseHotelInfo(HotelApiResponse hotelApiResponse,String hotelCode) {
        if (hotelApiResponse == null 
        || hotelApiResponse.getHotels() == null 
        || hotelApiResponse.getHotels().isEmpty()) {
            // 没有酒店信息，返回空的CheckHotelInfoResponse
            return createEmptyHotelInfoResponse(hotelCode);
        }

        // 获取第一个酒店信息（因为通常只查询一个酒店）
        HotelApiResponse.Hotel hotel = hotelApiResponse.getHotels().get(0);
        
        CheckHotelInfoResponse response = new CheckHotelInfoResponse();
        
        // 设置酒店代码
        response.setHotelCode(String.valueOf(hotel.getCode()));
        
        // 设置酒店名称
        if (hotel.getName() != null) {
            response.setHotelName(hotel.getName().getContent());
        }
        
        // 设置酒店地址
        if (hotel.getAddress() != null) {
            response.setAddress(hotel.getAddress().getStreet());
        }
        
        // 设置房型数量和房型代码
        if (hotel.getRooms() != null && !hotel.getRooms().isEmpty()) {
            // 如果有rooms，使用rooms的size和roomCode
            response.setRoomTypeNum(hotel.getRooms().size());
            String roomTypeCodes = hotel.getRooms().stream()
                .map(room -> room.getRoomCode())
                .collect(Collectors.joining(","));
            response.setRoomTypeCodes(roomTypeCodes);
        } else if (hotel.getWildcards() != null && !hotel.getWildcards().isEmpty()) {
            // 如果rooms为空但有wildcards，使用wildcards的size和roomType
            response.setRoomTypeNum(hotel.getWildcards().size());
            String roomTypeCodes = hotel.getWildcards().stream()
                .map(wildcard -> wildcard.getRoomType())
                .collect(Collectors.joining(","));
            response.setRoomTypeCodes(roomTypeCodes);
        } else {
            // 如果都没有，设置为0和空字符串
            response.setRoomTypeNum(0);
            response.setRoomTypeCodes("");
        }
        
        return response;
    }
    

    /**
     * 根据酒店ID和查询日期获取酒店可用性信息
     * 调用HotelBeds Hotel Availability API获取指定日期的房价和库存信息
     * 
     * @param hotelId 酒店ID
     * @param checkDate 查询日期 (格式: yyyy-MM-dd)
     * @return AvailabilityResponse 可用性响应对象
     */
    public AvailabilityResponse getHotelAvailabilityByDate(String hotelId, String checkDate) {
        try {
            // 1. 参数验证
            if (hotelId == null || hotelId.trim().isEmpty()) {
                throw new IllegalArgumentException("酒店ID不能为空");
            }
            
            if (checkDate == null || checkDate.trim().isEmpty()) {
                throw new IllegalArgumentException("查询日期不能为空");
            }
            
            // 2. 验证日期格式
            LocalDate checkInDate;
            try {
                checkInDate = LocalDate.parse(checkDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } catch (Exception e) {
                throw new IllegalArgumentException("日期格式错误，请使用yyyy-MM-dd格式");
            }
            
            // 3. 构建请求体
            JsonObject requestBody = new JsonObject();
            
            // 3.1 设置住宿信息
            JsonObject stay = new JsonObject();
            String checkInDateStr = checkInDate.format(DateTimeFormatter.ISO_DATE);
            String checkOutDateStr = checkInDate.plusDays(1).format(DateTimeFormatter.ISO_DATE);
            stay.addProperty("checkIn", checkInDateStr);
            stay.addProperty("checkOut", checkOutDateStr);
            requestBody.add("stay", stay);
            
            // 3.2 设置酒店信息
            JsonObject hotels = new JsonObject();
            JsonArray hotelArray = new JsonArray();
            hotelArray.add(hotelId);
            hotels.add("hotel", hotelArray);
            requestBody.add("hotels", hotels);
            
            // 3.3 设置入住人数
            JsonArray occupancies = new JsonArray();
            JsonObject occupancy = new JsonObject();
            occupancy.addProperty("rooms", 1);
            occupancy.addProperty("adults", 2);
            occupancy.addProperty("children", 0);
            occupancies.add(occupancy);
            requestBody.add("occupancies", occupancies);
            
            // 3.4 设置过滤条件
            JsonObject filter = new JsonObject();
            filter.addProperty("maxHotels", 1);
            filter.addProperty("maxRooms", 10);
            filter.addProperty("maxRatesPerRoom", 5);
            filter.addProperty("dailyRate", true);
            filter.addProperty("sourceMarket", "CN");
            requestBody.add("filter", filter);
            
            // 3.5 设置语言
            requestBody.addProperty("language", "CHI");
            
            // 4. 构建URL
            String url = baseUrl + "hotel-api/1.0/hotels";
            
            // 5. 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.set("Api-Key", apiKey);
            headers.set("Accept", "application/json");
            headers.set("Accept-Encoding", "gzip");
            headers.set("Content-Type", "application/json");
            headers.set("X-Signature", getSha256Str(apiKey + secret + (Calendar.getInstance().getTimeInMillis() / 1000)));
            
            // 6. 配置RestTemplate
            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(HttpClients.createDefault());
            factory.setConnectTimeout(10000);
            factory.setReadTimeout(30000);
            RestTemplate restTemplate = new RestTemplate(factory);
            restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
            
            // 7. 发送请求
            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);
            logger.debug("查询酒店可用性 - Request URL: {}", url);
            logger.debug("查询酒店可用性 - Request Body: {}", requestBody.toString());
            
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
            );
            
            // 8. 记录响应信息
            logger.debug("查询酒店可用性 - Response Status: {}", response.getStatusCode());
            logger.debug("查询酒店可用性 - Response Body: {}", response.getBody());
            
            // 9. 解析响应结果
            Gson gson = new Gson();
            AvailabilityResponse availabilityResponse = gson.fromJson(response.getBody(), AvailabilityResponse.class);
            
            if (availabilityResponse == null) {
                logger.warn("HotelBeds API返回空响应: hotelId={}, checkDate={}", hotelId, checkDate);
                return null;
            }
            
            logger.info("成功获取酒店可用性信息: hotelId={}, checkDate={}, totalHotels={}", 
                hotelId, checkDate, 
                availabilityResponse.getHotels() != null ? availabilityResponse.getHotels().getTotal() : 0);
            
            return availabilityResponse;
            
        } catch (Exception e) {
            logger.error("查询酒店可用性失败: hotelId={}, checkDate={}, error={}", 
                hotelId, checkDate, e.getMessage(), e);
            throw new RuntimeException("查询酒店可用性失败: " + e.getMessage());
        }
    }

    /**
     * 解析AvailabilityResponse对象并生成CheckHotelAvailabilityResponse对象
     * @param availabilityResponse HotelBeds API返回的可用性响应
     * @return CheckHotelAvailabilityResponse对象
     */
    public CheckHotelAvailabilityResponse parseAvailabilityResponse(AvailabilityResponse availabilityResponse) {
        if (availabilityResponse == null || availabilityResponse.getHotels() == null || 
            availabilityResponse.getHotels().getHotels() == null || availabilityResponse.getHotels().getHotels().isEmpty()) {
            return null;
        }

        // 获取第一个酒店信息（通常只查询一个酒店）
        AvailabilityHotel hotel = availabilityResponse.getHotels().getHotels().get(0);
        
        CheckHotelAvailabilityResponse response = new CheckHotelAvailabilityResponse();
        
        // 设置酒店基本信息
        response.setHotelCode(String.valueOf(hotel.getCode()));
        response.setHotelName(hotel.getName());
        
        // 设置酒店地址（如果有的话）
        if (hotel.getDestinationName() != null) {
            response.setAddress(hotel.getDestinationName());
        }
        
        // 设置查询日期
        response.setCheckDate(availabilityResponse.getHotels().getCheckIn());
        
        // 设置房型数量
        if (hotel.getRooms() != null) {
            response.setRoomTypeNum(hotel.getRooms().size());
            
            // 设置房型代码列表
            String roomTypeCodes = hotel.getRooms().stream()
                .map(room -> room.getCode())
                .collect(Collectors.joining(","));
            response.setRoomTypeCodes(roomTypeCodes);
        } else {
            response.setRoomTypeNum(0);
            response.setRoomTypeCodes("");
        }
        
        // 设置价格信息（取最低价格）
        String minPrice = "0.00";
        if (hotel.getRooms() != null && !hotel.getRooms().isEmpty()) {
            for (AvailabilityRoom room : hotel.getRooms()) {
                if (room.getRates() != null && !room.getRates().isEmpty()) {
                    for (AvailabilityRate rate : room.getRates()) {
                        if (rate.getNet() != null && !rate.getNet().trim().isEmpty()) {
                            try {
                                double currentPrice = Double.parseDouble(rate.getNet());
                                double minPriceValue = Double.parseDouble(minPrice);
                                if (currentPrice < minPriceValue || minPriceValue == 0.0) {
                                    minPrice = rate.getNet();
                                }
                            } catch (NumberFormatException e) {
                                logger.warn("无法解析价格: {}", rate.getNet());
                            }
                        }
                    }
                }
            }
        }
        response.setPrice(minPrice);
        
        // 设置房价码和库存信息（取第一个房型的第一个价格）
        if (hotel.getRooms() != null && !hotel.getRooms().isEmpty()) {
            AvailabilityRoom firstRoom = hotel.getRooms().get(0);
            if (firstRoom.getRates() != null && !firstRoom.getRates().isEmpty()) {
                AvailabilityRate firstRate = firstRoom.getRates().get(0);
                
                // 设置房价码（从rateKey中提取boardCode）
                String rateCode = parseBoardCodeFromRateKey(firstRate.getRateKey());
                response.setRateCode(rateCode != null ? rateCode : firstRate.getBoardCode());
                
                // 设置库存信息
                if (firstRate.getAllotment() != null) {
                    response.setInventory(String.valueOf(firstRate.getAllotment()));
                } else {
                    response.setInventory("0");
                }
                
                // 设置状态（根据rateType判断）
                if ("BOOKABLE".equalsIgnoreCase(firstRate.getRateType())) {
                    response.setStatus("可预订");
                } else if ("RECHECK".equalsIgnoreCase(firstRate.getRateType())) {
                    response.setStatus("需确认");
                } else {
                    response.setStatus("不可预订");
                }
            } else {
                response.setRateCode("");
                response.setInventory("0");
                response.setStatus("无价格信息");
            }
        } else {
            response.setRateCode("");
            response.setInventory("0");
            response.setStatus("无房型信息");
        }
        
        return response;
    }

    /**
     * 创建空的可用性响应对象（当没有可用性数据时）
     * @param checkHotelInfoResponse 酒店信息响应
     * @param checkDate 查询日期
     * @return CheckHotelAvailabilityResponse对象
     */
    private CheckHotelAvailabilityResponse createEmptyAvailabilityResponse(CheckHotelInfoResponse checkHotelInfoResponse, String checkDate) {
        CheckHotelAvailabilityResponse response = new CheckHotelAvailabilityResponse();
        
        // 设置酒店基本信息
        if (checkHotelInfoResponse != null) {
            response.setHotelCode(checkHotelInfoResponse.getHotelCode());
            response.setHotelName(checkHotelInfoResponse.getHotelName());
            response.setAddress(checkHotelInfoResponse.getAddress());
            response.setRoomTypeNum(checkHotelInfoResponse.getRoomTypeNum());
            response.setRoomTypeCodes(checkHotelInfoResponse.getRoomTypeCodes());
            response.setCheckDate(checkDate);
            response.setPrice("无价格");
            response.setRateCode("无房价码");
            response.setInventory("无库存");
            response.setStatus("无状态");
        } else {
            // 如果酒店信息也为空，设置默认值
            response.setHotelCode("");
            response.setHotelName("");
            response.setAddress("");
            response.setRoomTypeNum(0);
            response.setRoomTypeCodes("");
            response.setCheckDate(checkDate);
            response.setPrice("无价格");
            response.setRateCode("无房价码");
            response.setInventory("无库存");
            response.setStatus("无状态");
        }
        
        // 设置查询日期
        response.setCheckDate(checkDate);
        
        // 设置空的可用性信息
        response.setPrice("0.00");
        response.setRateCode("");
        response.setInventory("0");
        response.setStatus("无可用性数据");
        
        return response;
    }

    /**
     * 创建空的酒店信息响应对象（当没有酒店信息时）
     * @return CheckHotelInfoResponse对象
     */
    private CheckHotelInfoResponse createEmptyHotelInfoResponse(String hotelCode) {
        CheckHotelInfoResponse response = new CheckHotelInfoResponse();
        
        // 设置空的酒店信息
        response.setHotelCode(hotelCode);
        response.setHotelName("查无酒店");
        response.setAddress("");
        response.setRoomTypeNum(0);
        response.setRoomTypeCodes("");
        
        return response;
    }

    
} 