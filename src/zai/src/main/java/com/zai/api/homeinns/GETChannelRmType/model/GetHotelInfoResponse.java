package com.zai.api.homeinns.GETChannelRmType.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class GetHotelInfoResponse {
    @JsonProperty("HotelInfos")
    private List<HotelInfo> hotelInfos;
    
    @JsonProperty("ResCode")
    private Integer resCode;
    
    @JsonProperty("ResDesc")
    private String resDesc;

    public List<HotelInfo> getHotelInfos() {
        return hotelInfos;
    }

    public void setHotelInfos(List<HotelInfo> hotelInfos) {
        this.hotelInfos = hotelInfos;
    }

    public Integer getResCode() {
        return resCode;
    }

    public void setResCode(Integer resCode) {
        this.resCode = resCode;
    }

    public String getResDesc() {
        return resDesc;
    }

    public void setResDesc(String resDesc) {
        this.resDesc = resDesc;
    }

    public static class HotelInfo {
        @JsonProperty("s_Hotel")
        private String s_Hotel;
        
        @JsonProperty("s_HotelCd")
        private String s_HotelCd;
        
        @JsonProperty("s_HotelNm")
        private String s_HotelNm;
        
        @JsonProperty("s_HotelNm_En")
        private String s_HotelNm_En;
        
        @JsonProperty("s_HotelClass")
        private String s_HotelClass;
        
        @JsonProperty("s_HotelType")
        private String s_HotelType;
        
        @JsonProperty("s_HotelNature")
        private String s_HotelNature;
        
        @JsonProperty("s_ContractNo")
        private String s_ContractNo;
        
        @JsonProperty("s_Address")
        private String s_Address;
        
        @JsonProperty("s_sAddress")
        private String s_sAddress;
        
        @JsonProperty("s_remarkAddress")
        private String s_remarkAddress;
        
        @JsonProperty("s_Tel")
        private String s_Tel;
        
        @JsonProperty("s_Fax")
        private String s_Fax;
        
        @JsonProperty("s_Zip")
        private String s_Zip;
        
        @JsonProperty("s_Contact")
        private String s_Contact;
        
        @JsonProperty("s_Email")
        private String s_Email;
        
        @JsonProperty("s_Notice")
        private String s_Notice;
        
        @JsonProperty("s_RJPMS")
        private Boolean s_RJPMS;
        
        @JsonProperty("s_ResRoom")
        private Boolean s_ResRoom;
        
        @JsonProperty("s_Region")
        private String s_Region;
        
        @JsonProperty("s_RegionDes")
        private String s_RegionDes;
        
        @JsonProperty("s_ResvClass")
        private String s_ResvClass;
        
        @JsonProperty("s_BAuditD")
        private String s_BAuditD;
        
        @JsonProperty("s_TAuditD")
        private String s_TAuditD;
        
        @JsonProperty("s_Savetel")
        private String s_Savetel;
        
        @JsonProperty("s_Savenet")
        private String s_Savenet;
        
        @JsonProperty("s_CostPoint")
        private Integer s_CostPoint;
        
        @JsonProperty("s_AssessTp")
        private Boolean s_AssessTp;
        
        @JsonProperty("s_HideWeekRate")
        private Boolean s_HideWeekRate;
        
        @JsonProperty("s_CityCode")
        private String s_CityCode;
        
        @JsonProperty("s_PayNet")
        private Boolean s_PayNet;
        
        @JsonProperty("s_Sort")
        private Integer s_Sort;
        
        @JsonProperty("s_SellerEmail")
        private String s_SellerEmail;
        
        @JsonProperty("s_ArrdTime")
        private String s_ArrdTime;
        
        @JsonProperty("s_UpperLimit_Discount")
        private Double s_UpperLimit_Discount;
        
        @JsonProperty("s_LowerLimit_Discount")
        private Double s_LowerLimit_Discount;
        
        @JsonProperty("s_HotelLevel")
        private String s_HotelLevel;
        
        @JsonProperty("s_Detail")
        private String s_Detail;
        
        @JsonProperty("s_Toairport")
        private String s_Toairport;
        
        @JsonProperty("s_ToStation")
        private String s_ToStation;
        
        @JsonProperty("s_ToCenter")
        private String s_ToCenter;
        
        @JsonProperty("s_Sight")
        private String s_Sight;
        
        @JsonProperty("s_Establishment")
        private String s_Establishment;
        
        @JsonProperty("s_Dish")
        private String s_Dish;
        
        @JsonProperty("s_BreakFast")
        private String s_BreakFast;
        
        @JsonProperty("s_Img")
        private String s_Img;
        
        @JsonProperty("s_Map")
        private String s_Map;
        
        @JsonProperty("s_Note")
        private String s_Note;
        
        @JsonProperty("s_HotelOpen")
        private String s_HotelOpen;
        
        @JsonProperty("s_Fitment")
        private String s_Fitment;
        
        @JsonProperty("s_Card")
        private String s_Card;
        
        @JsonProperty("s_PaymentTp")
        private String s_PaymentTp;
        
        @JsonProperty("s_LandMarkCd")
        private String s_LandMarkCd;
        
        @JsonProperty("s_LandMarkNm")
        private String s_LandMarkNm;
        
        @JsonProperty("lon")
        private Double lon;
        
        @JsonProperty("lat")
        private Double lat;
        
        @JsonProperty("AverageNum")
        private String averageNum;
        
        @JsonProperty("IncrementNum")
        private String incrementNum;
        
        @JsonProperty("CountNum")
        private String countNum;
        
        @JsonProperty("Decoration")
        private String decoration;
        
        @JsonProperty("Point")
        private String point;
        
        @JsonProperty("s_HotelGroupCode")
        private String s_HotelGroupCode;
        
        @JsonProperty("s_HotelStar")
        private String s_HotelStar;
        
        @JsonProperty("s_HotelGrade")
        private String s_HotelGrade;
        
        @JsonProperty("Amap_Lon")
        private Double amapLon;
        
        @JsonProperty("Amap_Lat")
        private Double amapLat;
        
        @JsonProperty("chainId")
        private String chainId;

        // Getters and Setters
        public String getS_Hotel() {
            return s_Hotel;
        }

        public void setS_Hotel(String s_Hotel) {
            this.s_Hotel = s_Hotel;
        }

        public String getS_HotelCd() {
            return s_HotelCd;
        }

        public void setS_HotelCd(String s_HotelCd) {
            this.s_HotelCd = s_HotelCd;
        }

        public String getS_HotelNm() {
            return s_HotelNm;
        }

        public void setS_HotelNm(String s_HotelNm) {
            this.s_HotelNm = s_HotelNm;
        }

        public String getS_HotelNm_En() {
            return s_HotelNm_En;
        }

        public void setS_HotelNm_En(String s_HotelNm_En) {
            this.s_HotelNm_En = s_HotelNm_En;
        }

        public String getS_HotelClass() {
            return s_HotelClass;
        }

        public void setS_HotelClass(String s_HotelClass) {
            this.s_HotelClass = s_HotelClass;
        }

        public String getS_HotelType() {
            return s_HotelType;
        }

        public void setS_HotelType(String s_HotelType) {
            this.s_HotelType = s_HotelType;
        }

        public String getS_HotelNature() {
            return s_HotelNature;
        }

        public void setS_HotelNature(String s_HotelNature) {
            this.s_HotelNature = s_HotelNature;
        }

        public String getS_ContractNo() {
            return s_ContractNo;
        }

        public void setS_ContractNo(String s_ContractNo) {
            this.s_ContractNo = s_ContractNo;
        }

        public String getS_Address() {
            return s_Address;
        }

        public void setS_Address(String s_Address) {
            this.s_Address = s_Address;
        }

        public String getS_sAddress() {
            return s_sAddress;
        }

        public void setS_sAddress(String s_sAddress) {
            this.s_sAddress = s_sAddress;
        }

        public String getS_remarkAddress() {
            return s_remarkAddress;
        }

        public void setS_remarkAddress(String s_remarkAddress) {
            this.s_remarkAddress = s_remarkAddress;
        }

        public String getS_Tel() {
            return s_Tel;
        }

        public void setS_Tel(String s_Tel) {
            this.s_Tel = s_Tel;
        }

        public String getS_Fax() {
            return s_Fax;
        }

        public void setS_Fax(String s_Fax) {
            this.s_Fax = s_Fax;
        }

        public String getS_Zip() {
            return s_Zip;
        }

        public void setS_Zip(String s_Zip) {
            this.s_Zip = s_Zip;
        }

        public String getS_Contact() {
            return s_Contact;
        }

        public void setS_Contact(String s_Contact) {
            this.s_Contact = s_Contact;
        }

        public String getS_Email() {
            return s_Email;
        }

        public void setS_Email(String s_Email) {
            this.s_Email = s_Email;
        }

        public String getS_Notice() {
            return s_Notice;
        }

        public void setS_Notice(String s_Notice) {
            this.s_Notice = s_Notice;
        }

        public Boolean getS_RJPMS() {
            return s_RJPMS;
        }

        public void setS_RJPMS(Boolean s_RJPMS) {
            this.s_RJPMS = s_RJPMS;
        }

        public Boolean getS_ResRoom() {
            return s_ResRoom;
        }

        public void setS_ResRoom(Boolean s_ResRoom) {
            this.s_ResRoom = s_ResRoom;
        }

        public String getS_Region() {
            return s_Region;
        }

        public void setS_Region(String s_Region) {
            this.s_Region = s_Region;
        }

        public String getS_RegionDes() {
            return s_RegionDes;
        }

        public void setS_RegionDes(String s_RegionDes) {
            this.s_RegionDes = s_RegionDes;
        }

        public String getS_ResvClass() {
            return s_ResvClass;
        }

        public void setS_ResvClass(String s_ResvClass) {
            this.s_ResvClass = s_ResvClass;
        }

        public String getS_BAuditD() {
            return s_BAuditD;
        }

        public void setS_BAuditD(String s_BAuditD) {
            this.s_BAuditD = s_BAuditD;
        }

        public String getS_TAuditD() {
            return s_TAuditD;
        }

        public void setS_TAuditD(String s_TAuditD) {
            this.s_TAuditD = s_TAuditD;
        }

        public String getS_Savetel() {
            return s_Savetel;
        }

        public void setS_Savetel(String s_Savetel) {
            this.s_Savetel = s_Savetel;
        }

        public String getS_Savenet() {
            return s_Savenet;
        }

        public void setS_Savenet(String s_Savenet) {
            this.s_Savenet = s_Savenet;
        }

        public Integer getS_CostPoint() {
            return s_CostPoint;
        }

        public void setS_CostPoint(Integer s_CostPoint) {
            this.s_CostPoint = s_CostPoint;
        }

        public Boolean getS_AssessTp() {
            return s_AssessTp;
        }

        public void setS_AssessTp(Boolean s_AssessTp) {
            this.s_AssessTp = s_AssessTp;
        }

        public Boolean getS_HideWeekRate() {
            return s_HideWeekRate;
        }

        public void setS_HideWeekRate(Boolean s_HideWeekRate) {
            this.s_HideWeekRate = s_HideWeekRate;
        }

        public String getS_CityCode() {
            return s_CityCode;
        }

        public void setS_CityCode(String s_CityCode) {
            this.s_CityCode = s_CityCode;
        }

        public Boolean getS_PayNet() {
            return s_PayNet;
        }

        public void setS_PayNet(Boolean s_PayNet) {
            this.s_PayNet = s_PayNet;
        }

        public Integer getS_Sort() {
            return s_Sort;
        }

        public void setS_Sort(Integer s_Sort) {
            this.s_Sort = s_Sort;
        }

        public String getS_SellerEmail() {
            return s_SellerEmail;
        }

        public void setS_SellerEmail(String s_SellerEmail) {
            this.s_SellerEmail = s_SellerEmail;
        }

        public String getS_ArrdTime() {
            return s_ArrdTime;
        }

        public void setS_ArrdTime(String s_ArrdTime) {
            this.s_ArrdTime = s_ArrdTime;
        }

        public Double getS_UpperLimit_Discount() {
            return s_UpperLimit_Discount;
        }

        public void setS_UpperLimit_Discount(Double s_UpperLimit_Discount) {
            this.s_UpperLimit_Discount = s_UpperLimit_Discount;
        }

        public Double getS_LowerLimit_Discount() {
            return s_LowerLimit_Discount;
        }

        public void setS_LowerLimit_Discount(Double s_LowerLimit_Discount) {
            this.s_LowerLimit_Discount = s_LowerLimit_Discount;
        }

        public String getS_HotelLevel() {
            return s_HotelLevel;
        }

        public void setS_HotelLevel(String s_HotelLevel) {
            this.s_HotelLevel = s_HotelLevel;
        }

        public String getS_Detail() {
            return s_Detail;
        }

        public void setS_Detail(String s_Detail) {
            this.s_Detail = s_Detail;
        }

        public String getS_Toairport() {
            return s_Toairport;
        }

        public void setS_Toairport(String s_Toairport) {
            this.s_Toairport = s_Toairport;
        }

        public String getS_ToStation() {
            return s_ToStation;
        }

        public void setS_ToStation(String s_ToStation) {
            this.s_ToStation = s_ToStation;
        }

        public String getS_ToCenter() {
            return s_ToCenter;
        }

        public void setS_ToCenter(String s_ToCenter) {
            this.s_ToCenter = s_ToCenter;
        }

        public String getS_Sight() {
            return s_Sight;
        }

        public void setS_Sight(String s_Sight) {
            this.s_Sight = s_Sight;
        }

        public String getS_Establishment() {
            return s_Establishment;
        }

        public void setS_Establishment(String s_Establishment) {
            this.s_Establishment = s_Establishment;
        }

        public String getS_Dish() {
            return s_Dish;
        }

        public void setS_Dish(String s_Dish) {
            this.s_Dish = s_Dish;
        }

        public String getS_BreakFast() {
            return s_BreakFast;
        }

        public void setS_BreakFast(String s_BreakFast) {
            this.s_BreakFast = s_BreakFast;
        }

        public String getS_Img() {
            return s_Img;
        }

        public void setS_Img(String s_Img) {
            this.s_Img = s_Img;
        }

        public String getS_Map() {
            return s_Map;
        }

        public void setS_Map(String s_Map) {
            this.s_Map = s_Map;
        }

        public String getS_Note() {
            return s_Note;
        }

        public void setS_Note(String s_Note) {
            this.s_Note = s_Note;
        }

        public String getS_HotelOpen() {
            return s_HotelOpen;
        }

        public void setS_HotelOpen(String s_HotelOpen) {
            this.s_HotelOpen = s_HotelOpen;
        }

        public String getS_Fitment() {
            return s_Fitment;
        }

        public void setS_Fitment(String s_Fitment) {
            this.s_Fitment = s_Fitment;
        }

        public String getS_Card() {
            return s_Card;
        }

        public void setS_Card(String s_Card) {
            this.s_Card = s_Card;
        }

        public String getS_PaymentTp() {
            return s_PaymentTp;
        }

        public void setS_PaymentTp(String s_PaymentTp) {
            this.s_PaymentTp = s_PaymentTp;
        }

        public String getS_LandMarkCd() {
            return s_LandMarkCd;
        }

        public void setS_LandMarkCd(String s_LandMarkCd) {
            this.s_LandMarkCd = s_LandMarkCd;
        }

        public String getS_LandMarkNm() {
            return s_LandMarkNm;
        }

        public void setS_LandMarkNm(String s_LandMarkNm) {
            this.s_LandMarkNm = s_LandMarkNm;
        }

        public Double getLon() {
            return lon;
        }

        public void setLon(Double lon) {
            this.lon = lon;
        }

        public Double getLat() {
            return lat;
        }

        public void setLat(Double lat) {
            this.lat = lat;
        }

        public String getAverageNum() {
            return averageNum;
        }

        public void setAverageNum(String averageNum) {
            this.averageNum = averageNum;
        }

        public String getIncrementNum() {
            return incrementNum;
        }

        public void setIncrementNum(String incrementNum) {
            this.incrementNum = incrementNum;
        }

        public String getCountNum() {
            return countNum;
        }

        public void setCountNum(String countNum) {
            this.countNum = countNum;
        }

        public String getDecoration() {
            return decoration;
        }

        public void setDecoration(String decoration) {
            this.decoration = decoration;
        }

        public String getPoint() {
            return point;
        }

        public void setPoint(String point) {
            this.point = point;
        }

        public String getS_HotelGroupCode() {
            return s_HotelGroupCode;
        }

        public void setS_HotelGroupCode(String s_HotelGroupCode) {
            this.s_HotelGroupCode = s_HotelGroupCode;
        }

        public String getS_HotelStar() {
            return s_HotelStar;
        }

        public void setS_HotelStar(String s_HotelStar) {
            this.s_HotelStar = s_HotelStar;
        }

        public String getS_HotelGrade() {
            return s_HotelGrade;
        }

        public void setS_HotelGrade(String s_HotelGrade) {
            this.s_HotelGrade = s_HotelGrade;
        }

        public Double getAmapLon() {
            return amapLon;
        }

        public void setAmapLon(Double amapLon) {
            this.amapLon = amapLon;
        }

        public Double getAmapLat() {
            return amapLat;
        }

        public void setAmapLat(Double amapLat) {
            this.amapLat = amapLat;
        }
        
        public String getChainId() {
            return chainId;
        }
        
        public void setChainId(String chainId) {
            this.chainId = chainId;
        }
    }
} 