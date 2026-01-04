package com.zai.api.hotelbeds.service.hotel;

import com.zai.api.hotelbeds.entity.hotel.HotelApiResponse;
import com.zai.api.hotelbeds.entity.hotel.HotelApiResponse.Hotel;
import com.zai.api.hotelbeds.entity.hotel.HotelApiResponse.Wildcard;
import com.zai.hotel.mapper.HotelMapper;
import com.zai.roomtype.entity.RoomType;
import com.zai.roomtype.mapper.RoomTypeMapper;
import com.zai.ratecode.entity.RateCode;
import com.zai.ratecode.mapper.RateCodeMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.Date;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.math.BigDecimal;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import com.zai.ZaiApplication;
import com.zai.rateplan.service.RatePlanService;
import com.zai.rateplan.entity.RatePlan;
import com.zai.rateplan.mapper.RatePlanMapper;
import com.zai.util.MakeRequestor;

/**
 * Service class for retrieving hotel list information from the Hotelbeds Hotel Content API.
 * Fetches hotel data for China, generates a report, and sends it via email.
 */
@Service
public class HotelListHotelApiService {
    private static final Logger logger = LoggerFactory.getLogger(HotelListHotelApiService.class);
    private static final String API_METHOD = "hotel-content-api/1.0/hotels";
    private static final int PAGE_SIZE = 500;

    @Value("${hotelbeds.account.name:defaultAccount}")
    private String accountName;

    @Value("${email.recipient:default@homeinns.com}")
    private String recipientEmail;

    @Autowired
    private HotelMapper hotelMapper;

    @Autowired
    private RoomTypeMapper roomTypeMapper;

    @Autowired
    private RateCodeMapper rateCodeMapper;

    @Autowired
    private RatePlanMapper ratePlanMapper;

    @Autowired
    @Lazy
    private RatePlanService ratePlanService;

    @Autowired
    private MakeRequestor makeRequestor;

    /**
     * Constructor for dependency injection.
     *
     * @param emailSender  the email sender service
     * @param makeRequestor the API requestor
     * @param hotelMapper the hotel mapper
     */
    @Autowired
    public HotelListHotelApiService() {
       
    }

    /**
     * 保存BAR价格代码和对应的房型rateplans
     * @param chainId 连锁ID
     * @param hotelId 酒店ID
     */
    private void saveRateCode(String chainId, String hotelId) {
        try {
            // 检查是否存在BAR价格代码
            List<RateCode> existingRateCodes = rateCodeMapper.selectByCondition(hotelId, chainId, "BAR", null);
            
            if (existingRateCodes == null || existingRateCodes.isEmpty()) {
                // 不存在则创建新的BAR价格代码
                RateCode rateCode = new RateCode();
                rateCode.setRateCodeId(UUID.randomUUID().toString());
                rateCode.setChainId(chainId);
                rateCode.setHotelId(hotelId);
                rateCode.setRateCode("BAR");
                rateCode.setRateCodeName("Best Available Rate");
                rateCode.setDescription("Best Available Rate");
                rateCode.setReservationType("CASH");
                rateCode.setCancellationType("FREE_CANCELLATION");
                rateCode.setCancellableAfterBooking(1);
                rateCode.setStatus(1);
                rateCodeMapper.insert(rateCode);
                logger.info("新增BAR价格代码: " + hotelId);

                // 获取该酒店的所有房型
                List<RoomType> roomTypes = roomTypeMapper.selectByHotelId(hotelId);
                
                // 为每个房型创建对应的rateplan
                for (RoomType roomType : roomTypes) {
                    // 删除已有的rateplan
                    ratePlanMapper.deleteByUnique(chainId, hotelId, roomType.getRoomTypeId(), rateCode.getRateCodeId());
                    
                    // 创建新的rateplan
                    RatePlan ratePlan = new RatePlan();
                    ratePlan.setRatePlanId(UUID.randomUUID().toString());
                    ratePlan.setChainId(chainId);
                    ratePlan.setHotelId(hotelId);
                    ratePlan.setRoomTypeId(roomType.getRoomTypeId());
                    ratePlan.setRateCodeId(rateCode.getRateCodeId());
                    ratePlan.setRateCode(rateCode.getRateCode());
                    ratePlan.setRoomType(roomType.getRoomTypeCode());
                    ratePlan.setRatePlanName(roomType.getRoomTypeName() + "-" + rateCode.getRateCodeName());
                    ratePlan.setDescription("Best Available Rate for " + roomType.getRoomTypeName());
                    ratePlan.setFinalStatus(0);
                    ratePlan.setFinalInventory(0);
                    ratePlan.setFinalPrice(new BigDecimal("0.00"));
                    ratePlanMapper.insert(ratePlan);
                    logger.info("新增房型rateplan: " + roomType.getRoomTypeCode());
                }
            } else {
                // 存在则更新
                for (RateCode existingRateCode : existingRateCodes) {
                    existingRateCode.setStatus(1);
                    rateCodeMapper.update(existingRateCode);
                }
            }
        } catch (Exception e) {
            logger.error("保存价格代码时发生错误", e);
        }
    }

    /**
     * 将酒店列表写入数据库 zai.hotels 表（如有主键冲突则更新名称）。
     */
    public void saveHotelsToDB(List<Hotel> hotels) {
        try {
            for (Hotel hb_hotel : hotels) {
                String chainId = "hotelbeds";
                // 根据 hotel_code 和 chain_id 查询是否存在
                com.zai.hotel.entity.Hotel existingHotel = hotelMapper.selectByHotelCodeAndChain(String.valueOf(hb_hotel.getCode()), chainId);
                
                if (existingHotel == null) {
                    // 不存在则新增
                    com.zai.hotel.entity.Hotel hotel = new com.zai.hotel.entity.Hotel();
                    String hotelId = UUID.randomUUID().toString();
                    hotel.setHotelId(hotelId);
                    hotel.setHotelCode(String.valueOf(hb_hotel.getCode()));
                    hotel.setHotelName(hb_hotel.getName() != null ? hb_hotel.getName().getContent() : "unknown");
                    hotel.setCityId(hb_hotel.getPostalCode() != null ? hb_hotel.getPostalCode() : "unknown");
                    hotel.setCountry(hb_hotel.getCountryCode());
                    hotel.setChainId(chainId);
                    hotel.setAddress(hb_hotel.getAddress() != null ? hb_hotel.getAddress().getContent() : "unknown");
                    hotel.setContactEmail(hb_hotel.getEmail());
                    hotel.setContactPhone(hb_hotel.getPhones() != null ? hb_hotel.getPhones().get(0).getPhoneNumber() : "unknown");
                    hotel.setDescription(hb_hotel.getDescription() != null ? hb_hotel.getDescription().getContent() : "unknown");
                    hotel.setStatus(1); // 设置状态为有效
                    hotelMapper.insert(hotel);

                    // 解析酒店房型
                    saveRoomTypes(hb_hotel.getWildcards(), hotelId, chainId);
                    
                    // 保存BAR价格代码
                    saveRateCode(chainId, hotelId);
                } else {
                    // 存在则更新
                    existingHotel.setHotelName(hb_hotel.getName() != null ? hb_hotel.getName().getContent() : "unknown");
                    existingHotel.setCityId(hb_hotel.getPostalCode() != null ? hb_hotel.getPostalCode() : "unknown");
                    existingHotel.setCountry(hb_hotel.getCountryCode());
                    existingHotel.setChainId(chainId);
                    existingHotel.setAddress(hb_hotel.getAddress() != null ? hb_hotel.getAddress().getContent() : "unknown");
                    existingHotel.setContactEmail(hb_hotel.getEmail());
                    existingHotel.setContactPhone(hb_hotel.getPhones() != null ? hb_hotel.getPhones().get(0).getPhoneNumber() : "unknown");
                    existingHotel.setDescription(hb_hotel.getDescription() != null ? hb_hotel.getDescription().getContent() : "unknown");
                    existingHotel.setStatus(1);
                    hotelMapper.update(existingHotel);

                    // 更新房型信息
                    saveRoomTypes(hb_hotel.getWildcards(), existingHotel.getHotelId(), chainId);
                    
                    // 保存BAR价格代码
                    saveRateCode(chainId, existingHotel.getHotelId());
                }
            }
        } catch (Exception e) {
            logger.error("保存酒店数据到数据库时发生错误", e);
            throw new RuntimeException("保存酒店数据失败", e);
        }
    }

    /**
     * 保存房型信息
     * @param rooms 房型列表
     * @param hotelId 酒店ID
     * @param chainId 连锁ID
     */
    private void saveRoomTypes(List<Wildcard> wildcards, String hotelId, String chainId) {
        if (wildcards != null) {
            for (Wildcard wildcard : wildcards) {
                String roomType = wildcard.getRoomType();
                if (roomType != null) {
                    // 检查房型是否已存在
                    RoomType existingRoomType = roomTypeMapper.selectByRoomCodeAndHotelAndChain(roomType, hotelId, chainId);
                    
                    if (existingRoomType == null) {
                        // 不存在则新增
                        RoomType newRoomType = new RoomType();
                        String roomTypeId = UUID.randomUUID().toString();
                        newRoomType.setRoomTypeId(roomTypeId);
                        newRoomType.setRoomTypeCode(roomType);
                        newRoomType.setRoomTypeName(wildcard.getHotelRoomDescription() != null ? 
                        wildcard.getHotelRoomDescription().getContent() : "unknown");
                        newRoomType.setHotelId(hotelId);
                        newRoomType.setChainId(chainId);
                        newRoomType.setDescription(wildcard.getHotelRoomDescription() != null ? 
                            wildcard.getHotelRoomDescription().getContent() : "unknown");
                        newRoomType.setStatus(1);
                        roomTypeMapper.insert(newRoomType);
                    } else {
                        // 存在则更新
                        existingRoomType.setDescription(wildcard.getHotelRoomDescription() != null ? 
                            wildcard.getHotelRoomDescription().getContent() : "unknown");
                        existingRoomType.setStatus(1);
                        roomTypeMapper.update(existingRoomType);
                    }
                }
            }
        }
    }

    /**
     * Fetches the hotel list for China and sends a summary email.
     *
     * @throws IOException if an error occurs during API request or email sending
     */
    public List<Hotel> getHotelList() throws IOException {
        return getHotelList(0); // 0表示获取所有酒店
    }

    /**
     * Fetches the hotel list for China with a maximum limit.
     *
     * @param max 要获取的最大酒店数量，如果为0或负数则获取所有酒店
     * @throws IOException if an error occurs during API request or email sending
     */
    public List<Hotel> getHotelList(int max) throws IOException {
        // 直接获取酒店列表并返回，限制最大数量为max
        return fetchHotelList(1, PAGE_SIZE, max);
    }

    /**
     * Fetches hotel data iteratively with a maximum limit.
     *
     * @param start    starting index for pagination
     * @param pageSize number of records per page
     * @param max      要获取的最大酒店数量，如果为0或负数则获取所有酒店
     * @return List of hotels
     * @throws IOException if an error occurs during API request
     */
    private List<Hotel> fetchHotelList(int start, int pageSize, int max) throws IOException {
        List<Hotel> allHotels = new ArrayList<>();
        int total = 0;
        while ((start <= total || total == 0) && (max <= 0 || allHotels.size() < max)) {
            HotelApiResponse response = getApiResponse(start, start + pageSize - 1);
            if (response != null && response.getHotels() != null) {
                total = response.getTotal();
                if (max > 0 && allHotels.size() + response.getHotels().size() > max) {
                    // 如果添加整个response.hotels会超过max，只添加需要的部分
                    int remaining = max - allHotels.size();
                    allHotels.addAll(response.getHotels().subList(0, remaining));
                } else {
                    allHotels.addAll(response.getHotels());
                }
            }
            start += pageSize;
        }
        return allHotels;
    }

    /**
     * Fetches hotel data from the Hotelbeds API for a specified range.
     *
     * @param from starting index for pagination
     * @param to   ending index for pagination
     * @return ApiResponse containing hotel data, or null if an error occurs
     * @throws IOException if an error occurs during API request
     */
    private HotelApiResponse getApiResponse(int from, int to) throws IOException {
        try {
            JsonObject requestJson = makeRequestor.buildRequestJson();
            Map<String, Object> params = buildRequestParams(from, to);
            String jsonResponse = makeRequestor.sendGetRequest(requestJson, API_METHOD, params);
            return new Gson().fromJson(jsonResponse, HotelApiResponse.class);
        } catch (IOException e) {
            throw e;
        } catch (Exception e) {
            logger.info("Unexpected error while fetching hotel data", e);
            return null;
        }
    }

    /**
     * Builds request parameters for the API call.
     *
     * @param from starting index
     * @param to   ending index
     * @return map of request parameters
     */
    private Map<String, Object> buildRequestParams(int from, int to) {
        Map<String, Object> params = new HashMap<>();
        params.put("countryCode", "CN");
        params.put("fields", "all");
        params.put("language", "CHI");
        params.put("from", String.valueOf(from));
        params.put("to", String.valueOf(to));
        return params;
    }

    

    
    public static void main(String[] args) {
        try {
            // 创建Spring Boot应用程序上下文
            ConfigurableApplicationContext context = SpringApplication.run(ZaiApplication.class, args);
            
            // 从上下文中获取服务实例
            HotelListHotelApiService service = context.getBean(HotelListHotelApiService.class);
            
            // 获取酒店列表（限制 5 条）
            List<Hotel> hotels = service.getHotelList(0);
            System.out.println("酒店总数(实际获取条数): " + hotels.size());

            // 保存到数据库
            service.saveHotelsToDB(hotels);
            System.out.println("已写入数据库 hotels 表!");
            
            // 关闭上下文
            context.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}