package com.zai.api.hotelbeds.service.hotel;

import com.zai.api.hotelbeds.entity.hotel.*;
import com.zai.util.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.zai.util.EmailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class InitiateHotelApiService {
    //获取酒店资料 hotel-content-api/1.0/hotels
    //获取酒店价格 hotel-api/1.0/hotels
    //hotel-api/1.0/bookings
    public static InitiateHotelApiService instance;
    private static final String api_method = "hotel-content-api/1.0/hotels";

    @Autowired
    private MakeRequestor makeRequestor;

    @Autowired
    private EmailSender emailSender;

    public static void main(String[] args) {
        try {
            InitiateHotelApiService test = InitiateHotelApiService.getInstance();
            
            String accountName=MakeRequestor.ACCOUNTNAME_YunLing;

            //广州施柏阁大酒店988683、成都青城宋品酒店988670、成都融创施柏阁酒店988673、北京天坛北门漫心酒店992224、
            // 桔子水晶青岛崂山石老人海水浴场酒店989091、北京总部基地CitiGO欢阁酒店992548、长沙环球融创施柏阁酒店992631
            String[] hotelCodes=new String[]{"1002962","944382","992651","944809","1002961"};
            for(int i=0;i<hotelCodes.length;i++){
                //雅安蒙顶山花间驿·梅源里 1023606
                String hb_hotelcode=hotelCodes[i];//7927:88396    88398

                test.initiateMain(accountName,hb_hotelcode);
            }


        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public InitiateHotelApiService() {
    }
    public static InitiateHotelApiService getInstance() {
        if (instance == null) {
            return new InitiateHotelApiService();
        }
        return instance;
    }

    
    public void initiateMain(String accountName,String hb_hotelcode) {
        try {


            StringBuffer sb=new StringBuffer();
            LocalDateTime jobLocalDateTime = LocalDateTime.now();
            DateTimeFormatter jobTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd EEEE HH:mm:ss");
            DateTimeFormatter jobDayFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat sdfTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            int chainId=2;

            String token= TokenGenerator.generateToken();

            LocalDate startLocalDate = LocalDate.now();
            //startLocalDate=startLocalDate.plusDays(1);
            LocalDate endLocalDate = LocalDate.now();
            endLocalDate=endLocalDate.plusDays(7);
            String startDate = startLocalDate.format(formatter);
            String endDate = endLocalDate.format(formatter);




            HotelApiResponse apiResponse =getApiResponse(accountName,hb_hotelcode);
            if(apiResponse!=null){
                sb.append("******酒店建壳******"+"\n");
                sb.append("【操作时间】"+jobLocalDateTime.format(jobTimeFormatter)+" 【Token】"+token+"\n\n");
                List<HotelApiResponse.Hotel> hb_hotelList = apiResponse.getHotels();
                if(hb_hotelList!=null) {
                    for (HotelApiResponse.Hotel hb_hotelObj : hb_hotelList) {
                        List<HotelApiResponse.Room> hb_roomList = hb_hotelObj.getRooms();
                        List<HotelApiResponse.Wildcard> hb_wildcardList = hb_hotelObj.getWildcards();
                        String hb_hotel = String.valueOf(hb_hotelObj.getCode()).trim();
                        sb.append("-------------------------------------\n");
                        //创建酒店
                        //获取差价


                        sb.append("-------------------------------------\n");
                        //创建大类
                        sb.append("-------------------------------------\n");
                        //创建房型
                        if(hb_wildcardList!=null&&hb_wildcardList.size()>0){
                          

                        }else{
                          

                        }
                        sb.append("-------------------------------------\n");
                        //创建房价码
                        sb.append("-------------------------------------\n");
                        //创建包价
                        sb.append("-------------------------------------\n");


                        //获取该酒店下所有产品的日期段每日价格

                        //创建商品

                        //清除该酒店下日期段内价格

                        //获取该酒店下所有产品的日期段每日价格
                        System.out.println("【初始化价格】"+startDate+" 至 "+endDate);
                        sb.append("-------------------------------------"+"\n\n");

                    }
                }
                sb.append("-------------------------------------"+"\n\n");
                sb.append("******建壳结束******"+"\n");
                System.out.println(sb.toString());

                //-------------------------------------
                // 初始化EmailSender，指定SMTP服务器信息
                // 多个收件人、抄送人和密件抄送人
                String[] toEmails = {"jianzhou@homeinns.com,cus@win-on.net"};
                String[] ccEmails = null;
                String[] bccEmails = null;
                // 发送普通文本格式的邮件

                String emailSubject="HB初始化酒店("+jobLocalDateTime.format(jobDayFormatter)+")";
                String emailBody=sb.toString();
                boolean textEmailResult = emailSender.sendTextEmail(toEmails, ccEmails, bccEmails, emailSubject, emailBody);
                //-------------------------------------

                //System.out.println(sb.toString());
                System.out.println("---------------------------------");
                System.out.println("Email sent: " + textEmailResult);
                System.out.println("Send to: " + toEmails[0]);

            }




        } catch (Exception e) {
            e.printStackTrace();
        }
    }
   
    public HotelApiResponse getApiResponse(String accountName,String hb_hotelcode) throws IOException {
        try {
            if(hb_hotelcode==null||"".equals(hb_hotelcode)){
                return null;
            }
            HotelApiResponse apiResponse = HotelApiResponse.getInstance();
            JsonObject requestJson = makeRequestor.buildRequestJson();
            Map<String,Object> param = new HashMap<>();
            param.put("codes",hb_hotelcode);
            param.put("fields","all");
            param.put("language","CHI");
            param.put("from","1");
            param.put("to","1");

            System.out.println("【请求】：");
            System.out.println(param);
            String jsonResponse = makeRequestor.sendGetRequest(requestJson,api_method,param);
            System.out.println("【响应】：");
            System.out.println(jsonResponse);

            Gson gson = new Gson();
            apiResponse = gson.fromJson(jsonResponse, HotelApiResponse.class);
            return apiResponse;
        }catch (Exception exception){
            exception.printStackTrace();
        }
        return null;
    }


    

    /**
     * {
     *   "from" : 1,
     *   "to" : 1,
     *   "total" : 1,
     *   "auditData" : {
     *     "processTime" : "17",
     *     "timestamp" : "2024-08-29 05:06:06.183",
     *     "requestHost" : "10.214.19.232",
     *     "serverId" : "hotel-content-api-798f4f4d68-l2vdg",
     *     "environment" : "[live, awseucentral1, k8s, gcpeuropewest1, secret, hotel-content-api-798f4f4d68-l2vdg]",
     *     "release" : ""
     *   },
     *   "hotels" : [ {
     *     "code" : 681977,
     *     "name" : {
     *       "content" : "杭州西湖湖滨银泰CitiGO欢阁酒店"
     *     },
     *     "description" : {
     *       "content" : "酒店位于庆春路和中河北路交叉口，临近西湖风景区，地理位置优越。酒店交通便利，距地铁2号线中河北路站很近，地铁1号线凤起路站步行约10分钟，距离机场大巴车站地铁1站路，前往周边武林广场、延安路商业街，湖滨银泰步行约20分钟，前往西湖景区步行约15分钟即可到达断桥，音乐喷泉等著名景点。\n酒店是华住集团旗下中高档酒店品牌，名字取自英文"City，Go!",表述了品牌年轻、自由、随性的风格，以及立足城市社区，打造"有趣"的高品质入住空间的匠心。住在CitiGO很"有趣"。露台酒吧、共享办公、健身房、洗衣房……庞大的公区也是当地社区的共享社交客厅。旅行者和本地居民坐在一起，认识新朋友，畅聊城中热点新闻。\n在品质和服务方面，酒店始终坚持初心，精益求精。旗下酒店均由国际知名设计师亲自执笔，将旅行、运动、城市文化等元素通过空间设计巧妙融合，打造城市旅居的独特魅力。客房则把"沐浴"和"睡眠"两个核心体验做到惊艳。淋浴设施由德国原装进口，甄选国际奢华品牌"汉斯格雅"、"高仪"。牙膏选用日本药妆级品牌"Ora2"。床垫采用泰国天然乳胶打造，羽绒床品充绒量达90%。"
     *     },
     *     "countryCode" : "CN",
     *     "stateCode" : "13",
     *     "destinationCode" : "HGH",
     *     "zoneCode" : 19,
     *     "coordinates" : {
     *       "longitude" : 120.17110790480000000000,
     *       "latitude" : 30.25949431950000000000
     *     },
     *     "categoryCode" : "4EST",
     *     "categoryGroupCode" : "GRUPO4",
     *     "chainCode" : "HUAZH",
     *     "accommodationTypeCode" : "H",
     *     "boardCodes" : [ "BB", "CE", "AI", "EO", "AL", "B1", "SC", "B2", "LC", "HB", "FB", "RO" ],
     *     "segmentCodes" : [ ],
     *     "address" : {
     *       "content" : "拱墅区中河北路3号",
     *       "street" : "拱墅区中河北路3号"
     *     },
     *     "postalCode" : "310018",
     *     "city" : {
     *       "content" : "杭州市"
     *     },
     *     "email" : "yaoyuanbo001@huazhu.com",
     *     "phones" : [ {
     *       "phoneNumber" : "+8657189980099",
     *       "phoneType" : "PHONEBOOKING"
     *     }, {
     *       "phoneNumber" : "+8657189980099",
     *       "phoneType" : "PHONEHOTEL"
     *     } ],
     *     "rooms" : [ {
     *       "roomCode" : "DBL.ST",
     *       "isParentRoom" : false,
     *       "minPax" : 1,
     *       "maxPax" : 2,
     *       "maxAdults" : 2,
     *       "maxChildren" : 1,
     *       "minAdults" : 1,
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST",
     *       "roomFacilities" : [ {
     *         "facilityCode" : 250,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 261,
     *         "facilityGroupCode" : 60,
     *         "indFee" : false,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 287,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 295,
     *         "facilityGroupCode" : 60,
     *         "number" : 26,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       } ],
     *       "roomStays" : [ {
     *         "stayType" : "BED",
     *         "order" : "1",
     *         "description" : "Bed room",
     *         "roomStayFacilities" : [ {
     *           "facilityCode" : 150,
     *           "facilityGroupCode" : 61,
     *           "number" : 1
     *         } ]
     *       } ],
     *       "PMSRoomCode" : "PK1"
     *     }, {
     *       "roomCode" : "DBL.ST-1",
     *       "isParentRoom" : false,
     *       "minPax" : 1,
     *       "maxPax" : 2,
     *       "maxAdults" : 2,
     *       "maxChildren" : 1,
     *       "minAdults" : 1,
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-1",
     *       "roomFacilities" : [ {
     *         "facilityCode" : 250,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 261,
     *         "facilityGroupCode" : 60,
     *         "indFee" : false,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 287,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 295,
     *         "facilityGroupCode" : 60,
     *         "number" : 12,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       } ],
     *       "roomStays" : [ {
     *         "stayType" : "BED",
     *         "order" : "1",
     *         "description" : "Bed room",
     *         "roomStayFacilities" : [ {
     *           "facilityCode" : 150,
     *           "facilityGroupCode" : 61,
     *           "number" : 1
     *         } ]
     *       } ],
     *       "PMSRoomCode" : "DR1"
     *     }, {
     *       "roomCode" : "DBL.ST-3",
     *       "isParentRoom" : true,
     *       "minPax" : 1,
     *       "maxPax" : 2,
     *       "maxAdults" : 2,
     *       "maxChildren" : 1,
     *       "minAdults" : 1,
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-3",
     *       "roomFacilities" : [ {
     *         "facilityCode" : 220,
     *         "facilityGroupCode" : 60,
     *         "indLogic" : false,
     *         "number" : 0,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 250,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 261,
     *         "facilityGroupCode" : 60,
     *         "indFee" : false,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 287,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 295,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 298,
     *         "facilityGroupCode" : 60,
     *         "indLogic" : false,
     *         "number" : 1,
     *         "voucher" : false
     *       } ],
     *       "roomStays" : [ {
     *         "stayType" : "BED",
     *         "order" : "1",
     *         "description" : "Bed room",
     *         "roomStayFacilities" : [ {
     *           "facilityCode" : 150,
     *           "facilityGroupCode" : 61,
     *           "number" : 1
     *         } ]
     *       } ],
     *       "PMSRoomCode" : "DRX1"
     *     }, {
     *       "roomCode" : "DBL.ST-4",
     *       "isParentRoom" : true,
     *       "minPax" : 1,
     *       "maxPax" : 2,
     *       "maxAdults" : 2,
     *       "maxChildren" : 1,
     *       "minAdults" : 1,
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-4",
     *       "roomFacilities" : [ {
     *         "facilityCode" : 220,
     *         "facilityGroupCode" : 60,
     *         "indLogic" : false,
     *         "number" : 0,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 250,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 261,
     *         "facilityGroupCode" : 60,
     *         "indFee" : false,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 287,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 295,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 298,
     *         "facilityGroupCode" : 60,
     *         "indLogic" : false,
     *         "number" : 1,
     *         "voucher" : false
     *       } ],
     *       "roomStays" : [ {
     *         "stayType" : "BED",
     *         "order" : "1",
     *         "description" : "Bed room",
     *         "roomStayFacilities" : [ {
     *           "facilityCode" : 150,
     *           "facilityGroupCode" : 61,
     *           "number" : 1
     *         } ]
     *       } ],
     *       "PMSRoomCode" : "PE1"
     *     }, {
     *       "roomCode" : "DBL.ST-5",
     *       "isParentRoom" : false,
     *       "minPax" : 1,
     *       "maxPax" : 2,
     *       "maxAdults" : 2,
     *       "maxChildren" : 1,
     *       "minAdults" : 1,
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-5",
     *       "roomFacilities" : [ {
     *         "facilityCode" : 220,
     *         "facilityGroupCode" : 60,
     *         "indLogic" : false,
     *         "number" : 0,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 250,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 261,
     *         "facilityGroupCode" : 60,
     *         "indFee" : false,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 287,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 295,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 298,
     *         "facilityGroupCode" : 60,
     *         "indLogic" : false,
     *         "number" : 1,
     *         "voucher" : false
     *       } ],
     *       "roomStays" : [ {
     *         "stayType" : "BED",
     *         "order" : "1",
     *         "description" : "Bed room",
     *         "roomStayFacilities" : [ {
     *           "facilityCode" : 150,
     *           "facilityGroupCode" : 61,
     *           "number" : 1
     *         } ]
     *       } ],
     *       "PMSRoomCode" : "SQ1"
     *     }, {
     *       "roomCode" : "TWN.ST",
     *       "isParentRoom" : false,
     *       "minPax" : 1,
     *       "maxPax" : 2,
     *       "maxAdults" : 2,
     *       "maxChildren" : 1,
     *       "minAdults" : 1,
     *       "roomType" : "TWN",
     *       "characteristicCode" : "ST",
     *       "roomFacilities" : [ {
     *         "facilityCode" : 250,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 261,
     *         "facilityGroupCode" : 60,
     *         "indFee" : false,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 287,
     *         "facilityGroupCode" : 60,
     *         "indYesOrNo" : false,
     *         "voucher" : false
     *       }, {
     *         "facilityCode" : 295,
     *         "facilityGroupCode" : 60,
     *         "number" : 30,
     *         "indYesOrNo" : true,
     *         "voucher" : false
     *       } ],
     *       "roomStays" : [ {
     *         "stayType" : "BED",
     *         "order" : "1",
     *         "description" : "Bed room",
     *         "roomStayFacilities" : [ {
     *           "facilityCode" : 1,
     *           "facilityGroupCode" : 61,
     *           "number" : 2
     *         } ]
     *       } ],
     *       "PMSRoomCode" : "DT1"
     *     } ],
     *     "facilities" : [ {
     *       "facilityCode" : 20,
     *       "facilityGroupCode" : 10,
     *       "order" : 1,
     *       "number" : 2017,
     *       "voucher" : false
     *     }, {
     *       "facilityCode" : 70,
     *       "facilityGroupCode" : 10,
     *       "order" : 1,
     *       "indYesOrNo" : true,
     *       "number" : 129,
     *       "voucher" : false
     *     }, {
     *       "facilityCode" : 10,
     *       "facilityGroupCode" : 20,
     *       "order" : 1,
     *       "indLogic" : true,
     *       "indFee" : false,
     *       "voucher" : false
     *     }, {
     *       "facilityCode" : 295,
     *       "facilityGroupCode" : 70,
     *       "order" : 2,
     *       "indYesOrNo" : false,
     *       "voucher" : false
     *     }, {
     *       "facilityCode" : 320,
     *       "facilityGroupCode" : 70,
     *       "order" : 4,
     *       "indFee" : true,
     *       "indYesOrNo" : true,
     *       "voucher" : true
     *     }, {
     *       "facilityCode" : 30,
     *       "facilityGroupCode" : 70,
     *       "order" : 1,
     *       "indYesOrNo" : true,
     *       "voucher" : false
     *     }, {
     *       "facilityCode" : 260,
     *       "facilityGroupCode" : 70,
     *       "order" : 1,
     *       "timeFrom" : "14:00:00",
     *       "voucher" : true
     *     }, {
     *       "facilityCode" : 390,
     *       "facilityGroupCode" : 70,
     *       "order" : 1,
     *       "timeTo" : "12:00:00",
     *       "voucher" : false
     *     }, {
     *       "facilityCode" : 550,
     *       "facilityGroupCode" : 70,
     *       "order" : 3,
     *       "indFee" : false,
     *       "indYesOrNo" : true,
     *       "voucher" : false
     *     } ],
     *     "images" : [ {
     *       "imageTypeCode" : "RES",
     *       "path" : "68/681977/681977a_hb_r_003.jpg",
     *       "order" : 3,
     *       "visualOrder" : 6
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_024.jpg",
     *       "roomCode" : "DBL.ST-5",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-5",
     *       "order" : 24,
     *       "visualOrder" : 316
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_022.jpeg",
     *       "roomCode" : "DBL.ST-4",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-4",
     *       "order" : 22,
     *       "visualOrder" : 314
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_023.jpeg",
     *       "roomCode" : "DBL.ST-5",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-5",
     *       "order" : 23,
     *       "visualOrder" : 315
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_021.jpg",
     *       "roomCode" : "DBL.ST-4",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-4",
     *       "order" : 21,
     *       "visualOrder" : 313
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_020.jpg",
     *       "roomCode" : "DBL.ST-4",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-4",
     *       "order" : 20,
     *       "visualOrder" : 312
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_015.jpg",
     *       "roomCode" : "DBL.ST-1",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-1",
     *       "order" : 15,
     *       "visualOrder" : 307
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_018.jpg",
     *       "roomCode" : "DBL.ST-3",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-3",
     *       "order" : 18,
     *       "visualOrder" : 310
     *     }, {
     *       "imageTypeCode" : "RES",
     *       "path" : "68/681977/681977a_hb_r_006.jpg",
     *       "order" : 6,
     *       "visualOrder" : 10
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_014.jpg",
     *       "roomCode" : "DBL.ST-1",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-1",
     *       "order" : 14,
     *       "visualOrder" : 306
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_019.jpg",
     *       "roomCode" : "DBL.ST-3",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-3",
     *       "order" : 19,
     *       "visualOrder" : 311
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_017.jpg",
     *       "roomCode" : "DBL.ST-1",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-1",
     *       "order" : 17,
     *       "visualOrder" : 309
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_025.jpg",
     *       "roomCode" : "TWN.ST",
     *       "roomType" : "TWN",
     *       "characteristicCode" : "ST",
     *       "order" : 25,
     *       "visualOrder" : 317
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_016.jpg",
     *       "roomCode" : "DBL.ST-1",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST-1",
     *       "order" : 16,
     *       "visualOrder" : 308
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_003.jpg",
     *       "roomCode" : "TWN.ST",
     *       "roomType" : "TWN",
     *       "characteristicCode" : "ST",
     *       "order" : 3,
     *       "visualOrder" : 3
     *     }, {
     *       "imageTypeCode" : "BAR",
     *       "path" : "68/681977/681977a_hb_ba_001.jpg",
     *       "order" : 1,
     *       "visualOrder" : 601
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_013.jpg",
     *       "roomCode" : "DBL.ST",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST",
     *       "order" : 13,
     *       "visualOrder" : 305
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_w_001.jpg",
     *       "order" : 1,
     *       "visualOrder" : 1
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_ro_012.jpg",
     *       "roomCode" : "DBL.ST",
     *       "roomType" : "DBL",
     *       "characteristicCode" : "ST",
     *       "order" : 12,
     *       "visualOrder" : 304
     *     }, {
     *       "imageTypeCode" : "GEN",
     *       "path" : "68/681977/681977a_hb_a_002.jpg",
     *       "order" : 0,
     *       "visualOrder" : 0
     *     }, {
     *       "imageTypeCode" : "HAB",
     *       "path" : "68/681977/681977a_hb_w_002.jpeg",
     *       "order" : 2,
     *       "visualOrder" : 201
     *     }, {
     *       "imageTypeCode" : "COM",
     *       "path" : "68/681977/681977a_hb_l_004.jpg",
     *       "order" : 4,
     *       "visualOrder" : 13
     *     }, {
     *       "imageTypeCode" : "COM",
     *       "path" : "68/681977/681977a_hb_l_007.jpg",
     *       "order" : 7,
     *       "visualOrder" : 102
     *     }, {
     *       "imageTypeCode" : "GEN",
     *       "path" : "68/681977/681977a_hb_a_003.jpg",
     *       "order" : 3,
     *       "visualOrder" : 3
     *     } ],
     *     "wildcards" : [ {
     *       "roomType" : "DBL.ST-1",
     *       "roomCode" : "DBL",
     *       "characteristicCode" : "ST-1",
     *       "hotelRoomDescription" : {
     *         "content" : "欢享大床房"
     *       }
     *     }, {
     *       "roomType" : "TWN.ST",
     *       "roomCode" : "TWN",
     *       "characteristicCode" : "ST",
     *       "hotelRoomDescription" : {
     *         "content" : "欢逸双床房"
     *       }
     *     }, {
     *       "roomType" : "DBL.ST-5",
     *       "roomCode" : "DBL",
     *       "characteristicCode" : "ST-5",
     *       "hotelRoomDescription" : {
     *         "content" : "欢阁大床房"
     *       }
     *     }, {
     *       "roomType" : "DBL.ST-4",
     *       "roomCode" : "DBL",
     *       "characteristicCode" : "ST-4",
     *       "hotelRoomDescription" : {
     *         "content" : "精选欢阁房"
     *       }
     *     }, {
     *       "roomType" : "DBL.ST",
     *       "roomCode" : "DBL",
     *       "characteristicCode" : "ST",
     *       "hotelRoomDescription" : {
     *         "content" : "欢逸大床房"
     *       }
     *     }, {
     *       "roomType" : "DBL.ST-3",
     *       "roomCode" : "DBL",
     *       "characteristicCode" : "ST-3",
     *       "hotelRoomDescription" : {
     *         "content" : "大床房"
     *       }
     *     } ],
     *     "lastUpdate" : "2024-08-05",
     *     "ranking" : 27
     *   } ]
     * }
     * @param code
     * @return
     * @throws IOException
     */


}


