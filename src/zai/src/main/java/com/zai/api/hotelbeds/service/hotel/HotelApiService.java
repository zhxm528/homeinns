package com.zai.api.hotelbeds.service.hotel;

import com.zai.api.hotelbeds.entity.hotel.HotelApiResponse;
import com.zai.api.hotelbeds.entity.hotel.HotelApiResponse.Hotel;
import com.zai.util.MakeRequestor;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.*;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import com.zai.ZaiApplication;

@Service
public class HotelApiService {
    //获取酒店资料 hotel-content-api/1.0/hotels
    //获取酒店价格 hotel-api/1.0/hotels
    //hotel-api/1.0/bookings
    public static HotelApiService instance;
    private static final String api_method = "hotel-content-api/1.0/hotels";
    public static void main(String[] args) {
        try {
            // 创建Spring Boot应用程序上下文
            ConfigurableApplicationContext context = SpringApplication.run(ZaiApplication.class, args);
            
            // 从上下文中获取服务实例
            HotelApiService service = context.getBean(HotelApiService.class);
            service.getApiResponse("944761,681977,940468");// 944761,681977,940468,"992556"

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public HotelApiService() {
        this.makeRequestor = new MakeRequestor();
    }
    public static HotelApiService getInstance() {
        if (instance == null) {
            return new HotelApiService();
        }
        return instance;
    }

    @Autowired
    private MakeRequestor makeRequestor;

    public List getApiResponse(String jsonCodes) throws IOException {
        try {
            // 打印前端传入的原始参数
            //System.out.println("前端传入的原始参数: " + jsonCodes);
            
            HotelApiResponse apiResponse = HotelApiResponse.getInstance();
            JsonObject requestJson = makeRequestor.buildRequestJson();

            // 使用 Gson 解析 JSON 字符串
            Gson gson = new Gson();
            JsonObject jsonObject = gson.fromJson(jsonCodes, JsonObject.class);
            JsonArray hotelCodes = jsonObject.getAsJsonArray("hotelCodes");
            
            // 收集所有的 id 值
            List<String> codes = new ArrayList<>();
            for (int i = 0; i < hotelCodes.size(); i++) {
                codes.add(hotelCodes.get(i).getAsString());
            }
            
            // 将 codes 转换为逗号分隔的字符串
            String codesStr = String.join(",", codes);
            // 打印转换后的参数
            //System.out.println("转换后的参数: " + codesStr);

            Map<String,Object> param = new HashMap<>();
            param.put("countryCode","CN");
            if(!codesStr.isEmpty()){
                param.put("codes", codesStr);
            }
            param.put("fields","all");
            param.put("language","CHI");
            param.put("from","1");
            param.put("to","10");

            // 打印完整的请求参数
            //System.out.println("请求参数: " + param);

            String jsonResponse = makeRequestor.sendGetRequest(requestJson,api_method,param);
            apiResponse = gson.fromJson(jsonResponse, HotelApiResponse.class);
            System.out.println("Response Body: " + jsonResponse);
            // 构建返回的 JSON 数组
            List<Hotel> result = new ArrayList<>();
            if (apiResponse != null && apiResponse.getHotels() != null) {
                result=apiResponse.getHotels();
            }

            return result;
        }catch (Exception exception){
            System.out.println("处理请求时发生错误: " + exception.getMessage());
            exception.printStackTrace();
            return null;
        }
    }




}


