package com.zai.api.hotelbeds.service.bookingcancellation;

import com.zai.api.hotelbeds.entity.bookinglist.ApiResponse;
import com.zai.util.MakeRequestor;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class BookingCancellationApiService {
    //获取酒店资料 hotel-content-api/1.0/hotels
    //获取酒店价格 hotel-api/1.0/hotels
    //hotel-api/1.0/bookings
    //https://api.test.hotelbeds.com/hotel-api/{version}/bookings
    public static BookingCancellationApiService instance;
    private static final String api_method = "hotel-api/1.0/bookings/";

    @Autowired
    private MakeRequestor makeRequestor;

    public static void main(String[] args) {
        try {
            //1:中国
            //1:北京 2:上海 3:天津 4:重庆 32:广州
            BookingCancellationApiService test = BookingCancellationApiService.getInstance();
            ApiResponse apiResponse = test.getApiResponse("439-5838387");//

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public BookingCancellationApiService() {
    }

    public static BookingCancellationApiService getInstance() {
        if (instance == null) {
            return new BookingCancellationApiService();
        }
        return instance;
    }

    /**
     *
     * @param bookingId
     * @return
     * @throws IOException
     */
    public ApiResponse getApiResponse(String bookingId) throws IOException {
        try {
            // 从 JSP 获取参数
            ApiResponse apiResponse = ApiResponse.getInstance();

            // 构建请求体 JSON
            JsonObject requestJson = makeRequestor.buildRequestJson();

            requestJson.addProperty("bookingId", bookingId);

            Map<String, Object> param = new HashMap<String, Object>();
            param.put("cancellationFlag", "CANCELLATION");

            System.out.println("【取消预订请求】：");
            System.out.println(requestJson);
            // 发送 POST 请求
            String jsonResponse = makeRequestor.sendDelRequest(requestJson, api_method + bookingId, param);
            System.out.println("【取消预订响应】：");
            System.out.println(jsonResponse);

            // 解析 JSON 响应
            //Gson gson = new Gson();
            //apiResponse = gson.fromJson(jsonResponse, ApiResponse.class);

            // 返回解析后的 cityInfoList
            return apiResponse;
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return null;
    }
}


