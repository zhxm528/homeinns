package com.zai.api.hotelbeds.service.availability;

import com.zai.api.hotelbeds.entity.availability.*;
import com.zai.api.hotelbeds.service.hotel.HotelApiService;
import com.zai.util.MakeRequestor;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.List;

@Service
public class AvailabilityApiService {
    //获取酒店资料 hotel-content-api/1.0/hotels
    //获取酒店价格 hotel-api/1.0/hotels
    //hotel-api/1.0/bookings
    public static AvailabilityApiService instance;
    private static final String api_method = "hotel-api/1.0/hotels";
    
    @Autowired
    private MakeRequestor makeRequestor;
    
    @Autowired
    private HotelApiService hotelApiService;

    public AvailabilityApiService() {
    }
    public static AvailabilityApiService getInstance() {
        if (instance == null) {
            return new AvailabilityApiService();
        }
        return instance;
    }
    public void mainFirstStep() throws IOException {
        try {
            String bookingHotelcode="";

            // 循环遍历日期，直到结束日期为止
            LocalDate currentLocalDate = LocalDate.now();
            LocalDate nextLocalDate = currentLocalDate.plusDays(1);
            String currentDateString = currentLocalDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            String nextDateString = nextLocalDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            getApiResponse(bookingHotelcode,
                    currentDateString,
                    nextDateString,
                    1);
            currentLocalDate = currentLocalDate.plusDays(1);
           

        }catch (Exception exception){
            exception.printStackTrace();
        }

    }
    public AvailabilityResponse getApiResponse(String bookingHotelcode,
                                      String startDate,
                                      String endDate,
                                      int bookingRooms) throws IOException {
        try {
            // 从 JSP 获取参数
            AvailabilityResponse apiResponse = new AvailabilityResponse();

            // 构建请求体 JSON
            JsonObject requestJson = makeRequestor.buildRequestJson();

            requestJson.addProperty("language","CHI"); //"CHI" ENG
            //stay
            JsonObject stay = new JsonObject();
            stay.addProperty("checkIn", startDate);
            stay.addProperty("checkOut", endDate);
            //System.out.print("【checkIn】：" + startDate+"   ");
            //System.out.println("【checkOut】：" + endDate);
            //rooms参数不起作用
//            if(bookingRoomType!=null&&!"".equalsIgnoreCase(bookingRoomType)){
//                JsonObject rooms = new JsonObject();
//                JsonArray room = new JsonArray();
//                room.add(bookingRoomType);
//                rooms.add("room", room);
//                rooms.addProperty("included", true);
//                stay.add("rooms", rooms);
//            }
            requestJson.add("stay", stay);


            JsonObject hotels = new JsonObject();
            JsonArray hotel = new JsonArray();
            hotel.add(Integer.parseInt(bookingHotelcode));  //
            hotels.add("hotel", hotel);
            requestJson.add("hotels", hotels);


            JsonObject occupancy = new JsonObject();
            occupancy.addProperty("rooms", bookingRooms);
            occupancy.addProperty("adults", 1);
            occupancy.addProperty("children", 0);

            // 将 JSON 对象添加到 JSON 数组
            JsonArray occupancies = new JsonArray();
            occupancies.add(occupancy);

            // 创建主 JSON 对象并将 JSON 数组添加到其中
            requestJson.add("occupancies", occupancies);



            System.out.println("【Availability获取RateKey请求】：");
            System.out.println(requestJson);
            // 发送 POST 请求
            String jsonResponse = makeRequestor.sendPostRequest(requestJson,api_method);
            System.out.println("【Availability获取RateKey响应】：");
            System.out.println(jsonResponse);

            //System.out.println("【API响应参数】：" + jsonResponse);
            // 解析 JSON 响应
            Gson gson = new Gson();
            apiResponse = gson.fromJson(jsonResponse, AvailabilityResponse.class);
            //System.out.println("===apiResponse===" +  apiResponse);

            if(apiResponse!=null&&apiResponse.getHotels()!=null){
                List<AvailabilityHotel> hb_hotelList = apiResponse.getHotels().getHotels();

                //System.out.println("【酒店数】：" + apiResponse.hotels.total);

                if(hb_hotelList!=null){
                    for (AvailabilityHotel hb_hotelObj : hb_hotelList) {
                        String name=hb_hotelObj.getName();

                        List<AvailabilityRoom> hb_roomList = hb_hotelObj.getRooms();
                        if(apiResponse.getHotels().getTotal()==0){
                            System.out.println("【酒店无价格"+apiResponse.getHotels().getTotal()+"】");
                        }else{
                            System.out.println("【酒店有价格】【房型" + hb_roomList.size()+"个】");
                        }
                        if(hb_roomList!=null) {
                            for (AvailabilityRoom hb_roomObj : hb_roomList) {
                                List<AvailabilityRate> hb_rateList = hb_roomObj.getRates();
                                if(hb_rateList!=null) {
                                    for (AvailabilityRate hb_rateObj : hb_rateList) {
                                        if(hb_rateObj.getRateType()!=null&&"BOOKABLE".equalsIgnoreCase(hb_rateObj.getRateType())){
                                            //System.out.println("【酒店: " +  name+"】【房型："+hb_roomObj.code+"】");
                                            System.out.println("【RateKey: " +  hb_rateObj.getRateKey()+"】");
                                        }else{
                                            //System.out.println("【RECHECK】【酒店: " +  name+"】【房型："+hb_roomObj.code+"】");
                                        }
                                    }
                                }
                            }
                        }
                    }
                    String checkIn=apiResponse.getHotels().getCheckIn();
                    String checkOut=apiResponse.getHotels().getCheckOut();
                    //System.out.println("checkIn: " +  checkIn);
                    //System.out.println("checkOut: " +  checkOut);
                }

            }





            // 返回解析后的 cityInfoList
            return apiResponse;
        }catch (Exception exception){
            exception.printStackTrace();
        }
        return null;
    }


    /**
     * {
     *     "auditData": {
     *         "requestHost": "103.158.15.72, 3.172.30.100, 10.193.52.215, 10.193.26.167",
     *         "environment": "[awsapsoutheast1, awsapsoutheast1b, ip_10_193_26_223, apsoutheast1, secret]",
     *         "internal": "0|E8D89C6458C04F5172537304430806|CN|08|52|334||||||||||||1600||1~2~2~0|0|52||1|aca4d9dc837b059f78fd627f9a303d00||||",
     *         "release": "",
     *         "serverId": "ip-10-193-26-223.ap-southeast-1.compute.internal",
     *         "processTime": "193",
     *         "timestamp": "2024-09-03 14:17:24.501",
     *         "token": "86C21995B85148898483B9A4731F0898"
     *     },
     *     "hotels": {
     *         "total": 52,
     *         "checkIn": "2024-09-03",
     *         "hotels": [
     *             {
     *                 "rooms": [
     *                     {
     *                         "code": "TWN.SU",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1026762|TWN.SU|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~25e1b0~2079759912~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010820917c",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 5,
     *                                 "packaging": false,
     *                                 "net": "380.09",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Superior Twin Room"
     *                     },
     *                     {
     *                         "code": "DBL.SU",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1026762|DBL.SU|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~25e1b0~1192881163~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010820917c",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 6,
     *                                 "packaging": false,
     *                                 "net": "380.09",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Superior Double Room"
     *                     },
     *                     {
     *                         "code": "TWN.BS",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1026762|TWN.BS|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~2121cd~709646892~N~~~NOR~~E8D89C6458C04F5172537304430806AACN00520052000108258194",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 5,
     *                                 "packaging": false,
     *                                 "net": "404.88",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Business Twin Room"
     *                     },
     *                     {
     *                         "code": "DBL.DX",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1026762|DBL.DX|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~25e2c8~1707938077~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010825a271",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 6,
     *                                 "packaging": false,
     *                                 "net": "625.90",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Deluxe Double Room"
     *                     },
     *                     {
     *                         "code": "DBL.EJ",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1026762|DBL.EJ|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~2062d7~-485929808~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010821e27e",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 6,
     *                                 "packaging": false,
     *                                 "net": "638.30",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Executive Double Room"
     *                     },
     *                     {
     *                         "code": "SUI.DX",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1026762|SUI.DX|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~2063ef~-1390065283~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010820b374",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 6,
     *                                 "packaging": false,
     *                                 "net": "884.11",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Deluxe Suite"
     *                     },
     *                     {
     *                         "code": "SUI.EJ",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1026762|SUI.EJ|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~258591~-1705371272~N~~~NOR~~E8D89C6458C04F5172537304430806AACN005200520001082514e3",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 3,
     *                                 "packaging": false,
     *                                 "net": "1251.81",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Executive Suite"
     *                     }
     *                 ],
     *                 "code": 1026762,
     *                 "latitude": "30.66040200000000000000",
     *                 "categoryCode": "4EST",
     *                 "maxRate": "1251.81",
     *                 "categoryName": "4 STARS",
     *                 "destinationCode": "IMN",
     *                 "destinationName": "Tianmen - Hubei",
     *                 "name": "Madison Hotel Tianmen Wanda Plaza",
     *                 "minRate": "380.09",
     *                 "currency": "CNY",
     *                 "zoneName": "Tianmen Area",
     *                 "zoneCode": 1,
     *                 "longitude": "113.19012000000000000000"
     *             },
     *             {
     *                 "rooms": [
     *                     {
     *                         "code": "DBL.ST",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|DBL.ST|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~2061bf~333304239~N~~~NOR~~E8D89C6458C04F5172537304430806AACN00520052000108230188",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "392.48",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|DBL.ST|ID_B2B_26|B1|BNRBF1CN|2~2~0||N@07~A-SIC~21230d~-543927750~N~~~NOR~~E8D89C6458C04F5172537304430806AACN005200520001082512ad",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B1",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "685.81",
     *                                 "boardName": "Breakfast for one guest",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|DBL.ST|ID_B2B_26|B2|BNRBF2CN|2~2~0||N@07~A-SIC~2523aa~848394917~N~~~NOR~~E8D89C6458C04F5172537304430806AACN00520052000108215338",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B2",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "824.21",
     *                                 "boardName": "Breakfast for two guests",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Double Room"
     *                     },
     *                     {
     *                         "code": "TWN.DX",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|TWN.DX|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~25e1d8~1716246138~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010821419f",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 9,
     *                                 "packaging": false,
     *                                 "net": "415.20",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|TWN.DX|ID_B2B_26|B1|BNRBF1CN|2~2~0||N@07~A-SIC~252332~804561531~N~~~NOR~~E8D89C6458C04F5172537304430806AACN005200520001082562ce",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B1",
     *                                 "allotment": 9,
     *                                 "packaging": false,
     *                                 "net": "718.86",
     *                                 "boardName": "Breakfast for one guest",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|TWN.DX|ID_B2B_26|B2|BNRBF2CN|2~2~0||N@07~A-SIC~22f3d0~1671532377~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010821a359",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B2",
     *                                 "allotment": 9,
     *                                 "packaging": false,
     *                                 "net": "857.26",
     *                                 "boardName": "Breakfast for two guests",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Deluxe Twin Room"
     *                     },
     *                     {
     *                         "code": "DBL.DX",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|DBL.DX|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~2121f5~-1276612543~N~~~NOR~~E8D89C6458C04F5172537304430806AACN005200520001082631b7",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 3,
     *                                 "packaging": false,
     *                                 "net": "439.99",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|DBL.DX|ID_B2B_26|B1|BNRBF1CN|2~2~0||N@07~A-SIC~21235d~-116311755~N~~~NOR~~E8D89C6458C04F5172537304430806AACN005200520001082042f4",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B1",
     *                                 "allotment": 3,
     *                                 "packaging": false,
     *                                 "net": "756.04",
     *                                 "boardName": "Breakfast for one guest",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|DBL.DX|ID_B2B_26|B2|BNRBF2CN|2~2~0||N@07~A-SIC~22f3f8~-1531626108~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010822637c",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B2",
     *                                 "allotment": 3,
     *                                 "packaging": false,
     *                                 "net": "892.38",
     *                                 "boardName": "Breakfast for two guests",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Deluxe Double Room"
     *                     },
     *                     {
     *                         "code": "TWN.EJ",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|TWN.EJ|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~229211~-1514649532~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010824e1d0",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 9,
     *                                 "packaging": false,
     *                                 "net": "464.78",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|TWN.EJ|ID_B2B_26|B1|BNRBF1CN|2~2~0||N@07~A-SIC~252382~1702962284~N~~~NOR~~E8D89C6458C04F5172537304430806AACN00520052000108209315",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B1",
     *                                 "allotment": 9,
     *                                 "packaging": false,
     *                                 "net": "789.09",
     *                                 "boardName": "Breakfast for one guest",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|TWN.EJ|ID_B2B_26|B2|BNRBF2CN|2~2~0||N@07~A-SIC~20c41e~-641834617~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010822b39d",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B2",
     *                                 "allotment": 9,
     *                                 "packaging": false,
     *                                 "net": "925.43",
     *                                 "boardName": "Breakfast for two guests",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Executive Twin Room"
     *                     },
     *                     {
     *                         "code": "DBL.EJ",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|DBL.EJ|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~23521f~-536150638~N~~~NOR~~E8D89C6458C04F5172537304430806AACN005200520001082111dd",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 2,
     *                                 "packaging": false,
     *                                 "net": "477.17",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|DBL.EJ|ID_B2B_26|B1|BNRBF1CN|2~2~0||N@07~A-SIC~241395~-1913161443~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010823e325",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B1",
     *                                 "allotment": 2,
     *                                 "packaging": false,
     *                                 "net": "805.62",
     *                                 "boardName": "Breakfast for one guest",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|DBL.EJ|ID_B2B_26|B2|BNRBF2CN|2~2~0||N@07~A-SIC~25e430~-860540081~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010825f3ad",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B2",
     *                                 "allotment": 2,
     *                                 "packaging": false,
     *                                 "net": "941.95",
     *                                 "boardName": "Breakfast for two guests",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Executive Double Room"
     *                     },
     *                     {
     *                         "code": "FAM.ST",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|FAM.ST|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~23b29e~-268321956~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010824824c",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "588.72",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|FAM.ST|ID_B2B_26|B1|BNRBF1CN|2~2~0||N@07~A-SIC~20c446~-1984531396~N~~~NOR~~E8D89C6458C04F5172537304430806AACN005200520001082373c0",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B1",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "960.55",
     *                                 "boardName": "Breakfast for one guest",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|FAM.ST|ID_B2B_26|B2|BNRBF2CN|2~2~0||N@07~A-SIC~2294e1~-8032257~N~~~NOR~~E8D89C6458C04F5172537304430806AACN00520052000108258448",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B2",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "1096.88",
     *                                 "boardName": "Breakfast for two guests",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Family Room"
     *                     },
     *                     {
     *                         "code": "FAM.DX",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|FAM.DX|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~2062d7~-1332517912~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010821e27e",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 2,
     *                                 "packaging": false,
     *                                 "net": "638.30",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|FAM.DX|ID_B2B_26|B1|BNRBF1CN|2~2~0||N@07~A-SIC~20c496~-1550093983~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010824e406",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B1",
     *                                 "allotment": 2,
     *                                 "packaging": false,
     *                                 "net": "1030.78",
     *                                 "boardName": "Breakfast for one guest",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|FAM.DX|ID_B2B_26|B2|BNRBF2CN|2~2~0||N@07~A-SIC~229531~2129688474~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010820b48f",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B2",
     *                                 "allotment": 2,
     *                                 "packaging": false,
     *                                 "net": "1167.11",
     *                                 "boardName": "Breakfast for two guests",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Deluxe Family Room"
     *                     },
     *                     {
     *                         "code": "SUI.DX",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|SUI.DX|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~2062d7~1122414237~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010821e27e",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 3,
     *                                 "packaging": false,
     *                                 "net": "638.30",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|SUI.DX|ID_B2B_26|B1|BNRBF1CN|2~2~0||N@07~A-SIC~20c496~2131328012~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010824e406",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B1",
     *                                 "allotment": 3,
     *                                 "packaging": false,
     *                                 "net": "1030.78",
     *                                 "boardName": "Breakfast for one guest",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|SUI.DX|ID_B2B_26|B2|BNRBF2CN|2~2~0||N@07~A-SIC~229531~1516143173~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010820b48f",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B2",
     *                                 "allotment": 3,
     *                                 "packaging": false,
     *                                 "net": "1167.11",
     *                                 "boardName": "Breakfast for two guests",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Deluxe Suite"
     *                     },
     *                     {
     *                         "code": "SUI.EJ",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|SUI.EJ|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~25e408~593392592~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010825438a",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "906.84",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|SUI.EJ|ID_B2B_26|B1|BNRBF1CN|2~2~0||N@07~A-SIC~247644~-314832719~N~~~NOR~~E8D89C6458C04F5172537304430806AACN00520052000108250580",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B1",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "1408.80",
     *                                 "boardName": "Breakfast for one guest",
     *                                 "paymentType": "AT_WEB"
     *                             },
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002950|SUI.EJ|ID_B2B_26|B2|BNRBF2CN|2~2~0||N@07~A-SIC~2006e0~1976822523~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010820e609",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "B2",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "1545.14",
     *                                 "boardName": "Breakfast for two guests",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Executive Suite"
     *                     }
     *                 ],
     *                 "code": 1002950,
     *                 "latitude": "37.70530000000000000000",
     *                 "categoryCode": "4EST",
     *                 "maxRate": "1545.14",
     *                 "categoryName": "4 STARS",
     *                 "destinationCode": "JIZ",
     *                 "destinationName": "Jinzhong - Shanxi",
     *                 "name": "Grand Madison Jingzhong Yuci Haitangwan",
     *                 "minRate": "392.48",
     *                 "currency": "CNY",
     *                 "zoneName": "Yuci",
     *                 "zoneCode": 1,
     *                 "longitude": "112.72400000000000000000"
     *             },
     *             {
     *                 "rooms": [
     *                     {
     *                         "code": "DBL.IN-SU",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002979|DBL.IN-SU|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~2062d7~1544029605~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010821e27e",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 2,
     *                                 "packaging": false,
     *                                 "net": "638.30",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Superior Double Room (no window)"
     *                     },
     *                     {
     *                         "code": "DBL.IN-1",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002979|DBL.IN-1|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~2062ff~148677816~N~~~NOR~~E8D89C6458C04F5172537304430806AACN005200520001082292a1",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "673.41",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Comfort Double Room (no window)"
     *                     },
     *                     {
     *                         "code": "DBL.DX",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002979|DBL.DX|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~21d31b~-1033271109~N~~~NOR~~E8D89C6458C04F5172537304430806AACN005200520001082142ba",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "698.20",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Deluxe Double Room"
     *                     },
     *                     {
     *                         "code": "DBL.BS",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002979|DBL.BS|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~235337~-1430848849~N~~~NOR~~E8D89C6458C04F5172537304430806AACN005200520001082632d2",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "722.99",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Business Double Room"
     *                     },
     *                     {
     *                         "code": "SUI.ST",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240903|20240904|W|439|1002979|SUI.ST|ID_B2B_26|RO|HBSP30OFF|2~2~0||N@07~A-SIC~206507~-311146884~N~~~NOR~~E8D89C6458C04F5172537304430806AACN0052005200010825d469",
     *                                 "rateType": "RECHECK",
     *                                 "rateClass": "NOR",
     *                                 "rooms": 2,
     *                                 "children": 0,
     *                                 "adults": 2,
     *                                 "boardCode": "RO",
     *                                 "allotment": 4,
     *                                 "packaging": false,
     *                                 "net": "1129.93",
     *                                 "boardName": "ROOM ONLY",
     *                                 "paymentType": "AT_WEB"
     *                             }
     *                         ],
     *                         "name": "Suite"
     *                     }
     *                 ],
     *                 "code": 1002979,
     *                 "latitude": "31.28670000000000000000",
     *                 "categoryCode": "4EST",
     *                 "maxRate": "1129.93",
     *                 "categoryName": "4 STARS",
     *                 "destinationCode": "PVG",
     *                 "destinationName": "Shanghai",
     *                 "name": "Orange Crystal Hotel Shanghai Wujiaochang Big Cypr",
     *                 "minRate": "638.30",
     *                 "currency": "CNY",
     *                 "zoneName": "Hongkou",
     *                 "zoneCode": 26,
     *                 "longitude": "121.49100000000000000000"
     *             }
     *         ],
     *         "checkOut": "2024-09-04"
     *     }
     * }
     * @param code
     * @return
     * @throws IOException
     */
    /**
     * {
     *     "auditData": {
     *         "processTime": "33",
     *         "timestamp": "2024-09-03 15:11:30.786",
     *         "requestHost": "54.72.183.143, 130.176.209.151, 10.214.58.162, 10.214.38.28",
     *         "serverId": "ip-10-214-45-98.eu-central-1.compute.internal",
     *         "environment": "[awseucentral1, awseucentral1b, ip_10_214_45_98, eucentral1, secret]",
     *         "release": "",
     *         "token": "AC8D8B01475C402585FD2C00187642BB",
     *         "internal": "0|0D36109C02534E1172537629075305|CN|05|1|1||||||||||||1||1~1~2~0|0|1||1|aca4d9dc837b059f78fd627f9a303d00||||"
     *     },
     *     "hotels": {
     *         "hotels": [
     *             {
     *                 "code": 1001649,
     *                 "name": "Song Hotel Ji'nan Fengming",
     *                 "categoryCode": "5EST",
     *                 "categoryName": "5 STARS",
     *                 "destinationCode": "TNA",
     *                 "destinationName": "Ji'nan - Shandong",
     *                 "zoneCode": 1,
     *                 "zoneName": "Jinan",
     *                 "latitude": "36.65830000000000000000",
     *                 "longitude": "117.19100000000000000000",
     *                 "rooms": [
     *                     {
     *                         "code": "DBL.B1-1",
     *                         "name": "One bedroom Valley",
     *                         "rates": [
     *                             {
     *                                 "rateKey": "20240904|20240905|W|439|1001649|DBL.B1-1|ID_B2B_26|RO|HBSP30OFF|1~2~0||N@07~A-SIC~22f5b0~63091727~N~~~NOR~~0D36109C02534E1172537629075305AACN0001000100010521d51b",
     *                                 "rateClass": "NOR",
     *                                 "rateType": "RECHECK",
     *                                 "net": "1307.29",
     *                                 "allotment": 9,
     *                                 "paymentType": "AT_WEB",
     *                                 "packaging": false,
     *                                 "boardCode": "RO",
     *                                 "boardName": "ROOM ONLY",
     *                                 "rooms": 1,
     *                                 "adults": 2,
     *                                 "children": 0
     *                             }
     *                         ]
     *                     }
     *                 ],
     *                 "minRate": "1307.29",
     *                 "maxRate": "1307.29",
     *                 "currency": "CNY"
     *             }
     *         ],
     *         "checkIn": "2024-09-04",
     *         "total": 1,
     *         "checkOut": "2024-09-05"
     *     }
     * }
     * @param bookingHotelcode
     * @return
     * @throws IOException
     */

}


