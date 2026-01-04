package com.zai.api.hotelbeds.service.bookingdetail;

import com.zai.api.hotelbeds.entity.bookingdetail.*;
import com.zai.util.MakeRequestor;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BookingDetailApiService {
    //获取酒店资料 hotel-content-api/1.0/hotels
    //获取酒店价格 hotel-api/1.0/hotels
    //hotel-api/1.0/bookings
    //https://api.test.hotelbeds.com/hotel-api/{version}/bookings
    public static BookingDetailApiService instance;
    private static final String api_method = "hotel-api/1.0/bookings/";

    @Autowired
    private MakeRequestor makeRequestor;

    public static void main(String[] args) {
        try {
            //1:中国
            //1:北京 2:上海 3:天津 4:重庆 32:广州
            BookingDetailApiService test = BookingDetailApiService.getInstance();
            //ApiResponse apiResponse = test.getApiResponse("439-5732231");// 944761,681977,940468,

            String startDate="2024-09-01";
            String endDate="2024-09-13";
            test.mainPropertysCheck(startDate,endDate);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public BookingDetailApiService() {
    }
    public static BookingDetailApiService getInstance() {
        if (instance == null) {
            return new BookingDetailApiService();
        }
        return instance;
    }

    public void mainPropertysCheck(String startDate,String endDate) throws IOException {
        try {
            //System.out.println("==========getInfoObject:context=========="+context);
            
            mainPropertyCheck(1,startDate,endDate,null);


        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void mainPropertyCheck(int propertyIdInt,
                                  String startDate,String endDate,
                                  String resNoProp) throws IOException {
        try {
           //匹配 代理通订单号
           String crsResNoProp="";
           String crsResNo="";
           double crsTotalRateChannelOrg=0.0;
           double crsTotalRatePropOrg=0.0;
           String crsCheckInDateReal="";
           String crsCheckOutDateReal="";
           String crsResvType="";
           //------------------------------------------
           if(crsResNoProp!=null){
               ApiResponse apiResponse=getApiResponse(crsResNoProp);
               if(apiResponse!=null){
                   Booking hbBooking=apiResponse.booking;
                   if(hbBooking!=null){
                       String hbReference=hbBooking.reference;// HB订单号
                       String hbClientReference=hbBooking.clientReference;// CRS订单号
                       String hbCreationDate=hbBooking.creationDate;
                       //Enum: "CONFIRMED" "CANCELLED"
                       String hbStatus=hbBooking.status;
                       ModificationPolicies hbModificationPolicies=hbBooking.modificationPolicies;
                       boolean isCancellation=false;
                       boolean isModification=false;
                       if(hbModificationPolicies!=null){
                           isCancellation=hbModificationPolicies.cancellation;
                           isModification=hbModificationPolicies.modification;
                       }
                       double hbTotalNet=hbBooking.totalNet;
                       double hbPendingAmount=hbBooking.pendingAmount;
                       Hotel hbHotel=hbBooking.hotel;
                       String hbCheckIn="";
                       String hbCheckOut="";
                       if(hbHotel!=null){
                           hbCheckIn=hbHotel.checkIn;
                           hbCheckOut=hbHotel.checkOut;
                       }

                       
                       if(isCancellation){
                           
                       }else{
                           
                       }


                       StringBuffer resvDesc6=new StringBuffer();
                       StringBuffer resvTag6=new StringBuffer();

                       if(("2".equalsIgnoreCase(crsResvType)||"CANCELLED".equalsIgnoreCase(hbStatus))
                               &&hbPendingAmount>0){
                           //是取消单 罚金>0
                       }else{
                       }

                       if(Math.abs(crsTotalRatePropOrg-hbTotalNet)>1){
                           //HB价格和CRS价格不匹配
                       }else{
                       }

                       if(!crsResNo.equalsIgnoreCase(hbClientReference)){
                           resvTag6.append("6");
                           resvDesc6.append("[HB订单关联不匹配]");
                       }
                       if(resNoProp!=null&&!"".equals(resNoProp)){
                           System.out.println("入住日期："+hbCheckIn);
                       }
                       //
                       if(!crsCheckInDateReal.equalsIgnoreCase(hbCheckIn)){
                           
                           resvTag6.append("2");
                           resvDesc6.append("[入住日期不匹配]");
                       }
                       if(resNoProp!=null&&!"".equals(resNoProp)){
                           System.out.println("离店日期："+hbCheckOut);
                       }
                       //
                       if(!crsCheckOutDateReal.equalsIgnoreCase(hbCheckOut)){
                           resvTag6.append("3");
                           resvDesc6.append("[离店日期不匹配]");
                       }

                       if(!"".equals(resvTag6.toString().trim())){
                           resvDesc6.append("[HB订单号:"+hbReference+"][HB价格:"+hbTotalNet+"]");
                           System.out.println(resvDesc6.toString());
                       }else{
                           System.out.println("[HB订单号:"+hbReference+"已核对]");
                       }
                   }
               }
           }

        }catch (Exception exception){
            exception.printStackTrace();
        }

    }

    /**
     *{
     *     "auditData": {
     *         "processTime": "397",
     *         "timestamp": "2024-09-11 12:04:51.087",
     *         "requestHost": "183.131.247.90, 130.176.213.54, 10.214.52.194, 10.214.14.127",
     *         "serverId": "ip-10-214-15-239.eu-central-1.compute.internal#A+",
     *         "environment": "[awseucentral1, awseucentral1c, ip_10_214_15_239, eucentral1, secret]",
     *         "release": "",
     *         "token": "374C345CAEF04C75B2F0E479043359DA",
     *         "internal": "null||||0|1||||||||||||1|||0|0||0|null||||"
     *     },
     *     "booking": {
     *         "reference": "439-5732231",
     *         "clientReference": "2409051606264561",
     *         "creationDate": "2024-09-05",
     *         "status": "CONFIRMED",
     *         "modificationPolicies": {
     *             "cancellation": true,
     *             "modification": false
     *         },
     *         "creationUser": "aca4d9dc837b059f78fd627f9a303d00",
     *         "holder": {
     *             "name": "王红权",
     *             "surname": "王红权"
     *         },
     *         "hotel": {
     *             "checkOut": "2024-09-07",
     *             "checkIn": "2024-09-06",
     *             "code": 940468,
     *             "name": "CitiGO Hotel Shanghai Pudong Airport Chuansha",
     *             "categoryCode": "4EST",
     *             "categoryName": "4 STARS",
     *             "destinationCode": "PVG",
     *             "destinationName": "Shanghai",
     *             "zoneCode": 1,
     *             "zoneName": "Pudong",
     *             "latitude": "31.19965300000000000000",
     *             "longitude": "121.70420600000000000000",
     *             "rooms": [
     *                 {
     *                     "status": "CONFIRMED",
     *                     "id": 1,
     *                     "code": "DBL.ST-8",
     *                     "name": "Huanxiang Double Room",
     *                     "supplierReference": "DO905080633B7E10XTBPY",
     *                     "paxes": [
     *                         {
     *                             "roomId": 1,
     *                             "type": "AD",
     *                             "name": "王红权",
     *                             "surname": "王红权"
     *                         },
     *                         {
     *                             "roomId": 1,
     *                             "type": "AD"
     *                         }
     *                     ],
     *                     "rates": [
     *                         {
     *                             "rateClass": "NOR",
     *                             "net": "206.97",
     *                             "rateComments": "Car park YES (with additional debit notes).",
     *                             "paymentType": "AT_WEB",
     *                             "packaging": false,
     *                             "boardCode": "RO",
     *                             "boardName": "ROOM ONLY",
     *                             "cancellationPolicies": [
     *                                 {
     *                                     "amount": "206.97",
     *                                     "from": "2024-09-06T22:59:59+08:00"
     *                                 }
     *                             ],
     *                             "rooms": 1,
     *                             "adults": 2,
     *                             "children": 0
     *                         }
     *                     ]
     *                 }
     *             ],
     *             "totalNet": "206.97",
     *             "currency": "CNY",
     *             "supplier": {
     *                 "name": "GULLIVERS TRAVEL ASSOCIATES (BEIJING) LIMITED",
     *                 "vatNumber": "91110101717851515E"
     *             }
     *         },
     *         "invoiceCompany": {
     *             "code": "CN4",
     *             "company": "GULLIVERS TRAVEL ASSOCIATES (BEIJING) LIMITED",
     *             "registrationNumber": "91110101717851515E"
     *         },
     *         "totalNet": 206.97,
     *         "pendingAmount": 206.97,
     *         "currency": "CNY"
     *     }
     * }
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

            requestJson.addProperty("bookingId",bookingId);

            Map<String,Object> param = new HashMap<String,Object>();
            //System.out.println("===requestJson===" + requestJson);
            // 发送 POST 请求
            String jsonResponse = makeRequestor.sendGetRequest(requestJson,api_method+bookingId,param);
            //System.out.println("===jsonResponse===" + jsonResponse);
            // 解析 JSON 响应
            Gson gson = new Gson();
            apiResponse = gson.fromJson(jsonResponse, ApiResponse.class);


            // 返回解析后的 cityInfoList
            return apiResponse;
        }catch (Exception exception){
            exception.printStackTrace();
        }
        return null;
    }


}


