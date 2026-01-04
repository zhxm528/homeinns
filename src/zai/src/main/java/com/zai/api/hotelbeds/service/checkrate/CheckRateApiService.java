package com.zai.api.hotelbeds.service.checkrate;

import com.zai.util.MakeRequestor;
import com.zai.api.hotelbeds.entity.checkrate.*;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.List;

@Service
public class CheckRateApiService {
    private static final String api_method = "hotel-api/1.0/checkrates";

    @Autowired
    private MakeRequestor makeRequestor;

    public String getRateKey(String rateKey) throws IOException {
        try {
            ApiResponse apiResponse = getApiResponse(rateKey);
            if(apiResponse!=null){
                Hotel hb_hotel=apiResponse.hotel;
                if(hb_hotel!=null){
                    List<Room> roomList=hb_hotel.rooms;
                    if(roomList!=null){
                        for(Room roomObj:roomList){
                            List<Rate> rateList=roomObj.rates;
                            if(rateList!=null){
                                for(Rate rateObj:rateList){
                                    String hb_rateType=rateObj.rateType;
                                    String hb_newRateKey=rateObj.rateKey;
                                    if("BOOKABLE".equalsIgnoreCase(hb_rateType)){
                                        return hb_newRateKey;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }catch (Exception exception){
            exception.printStackTrace();
        }
        return null;
    }

    public ApiResponse getApiResponse(String rateKey) throws IOException {
        try {
            if(rateKey!=null&&!"".equalsIgnoreCase(rateKey)){
                ApiResponse apiResponse = ApiResponse.getInstance();
                JsonObject requestJson = makeRequestor.buildRequestJson();
                requestJson.addProperty("language","CHI");
                JsonArray rooms = new JsonArray();
                JsonObject roomObj = new JsonObject();
                roomObj.addProperty("rateKey",rateKey);
                rooms.add(roomObj);
                requestJson.add("rooms",rooms);

                System.out.println("【CheckRate请求】：");
                System.out.println(requestJson);
                String jsonResponse = makeRequestor.sendPostRequest(requestJson,api_method);
                System.out.println("【CheckRate响应】：");
                System.out.println(jsonResponse);

                Gson gson = new Gson();
                apiResponse = gson.fromJson(jsonResponse, ApiResponse.class);

                if(apiResponse!=null){
                    return apiResponse;
                }
            }
        }catch (Exception exception){
            exception.printStackTrace();
        }
        return null;
    }
}


