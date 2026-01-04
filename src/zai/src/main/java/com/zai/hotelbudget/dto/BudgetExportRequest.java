package com.zai.hotelbudget.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * 预算导出请求DTO
 */
public class BudgetExportRequest {
    
    /**
     * 预算年份
     */
    @JsonProperty("year")
    private Integer year;
    
    /**
     * 连锁ID
     */
    @JsonProperty("chainId")
    private String chainId;
    
    /**
     * 导出数据列表
     */
    @JsonProperty("exportData")
    private List<ExportData> exportData;
    
    // 构造函数
    public BudgetExportRequest() {}
    
    public BudgetExportRequest(Integer year, String chainId, List<ExportData> exportData) {
        this.year = year;
        this.chainId = chainId;
        this.exportData = exportData;
    }
    
    // Getter和Setter方法
    public Integer getYear() {
        return year;
    }
    
    public void setYear(Integer year) {
        this.year = year;
    }
    
    public String getChainId() {
        return chainId;
    }
    
    public void setChainId(String chainId) {
        this.chainId = chainId;
    }
    
    public List<ExportData> getExportData() {
        return exportData;
    }
    
    public void setExportData(List<ExportData> exportData) {
        this.exportData = exportData;
    }
    
    @Override
    public String toString() {
        return "BudgetExportRequest{" +
                "year=" + year +
                ", chainId='" + chainId + '\'' +
                ", exportData=" + exportData +
                '}';
    }
    
    /**
     * 导出数据内部类
     */
    public static class ExportData {
        @JsonProperty("hotelIndex")
        private Integer hotelIndex;
        
        @JsonProperty("hotelCode")
        private String hotelCode;
        
        @JsonProperty("hotelName")
        private String hotelName;
        
        @JsonProperty("hotelId")
        private String hotelId;
        
        @JsonProperty("chainCode")
        private String chainCode;
        
        @JsonProperty("chainName")
        private String chainName;
        
        @JsonProperty("hotelManagementModel")
        private String hotelManagementModel;
        
        @JsonProperty("subjects")
        private List<Subject> subjects;
        
        // 构造函数
        public ExportData() {}
        
        // Getter和Setter方法
        public Integer getHotelIndex() { return hotelIndex; }
        public void setHotelIndex(Integer hotelIndex) { this.hotelIndex = hotelIndex; }
        
        public String getHotelCode() { return hotelCode; }
        public void setHotelCode(String hotelCode) { this.hotelCode = hotelCode; }
        
        public String getHotelName() { return hotelName; }
        public void setHotelName(String hotelName) { this.hotelName = hotelName; }
        
        public String getHotelId() { return hotelId; }
        public void setHotelId(String hotelId) { this.hotelId = hotelId; }
        
        public String getChainCode() { return chainCode; }
        public void setChainCode(String chainCode) { this.chainCode = chainCode; }
        
        public String getChainName() { return chainName; }
        public void setChainName(String chainName) { this.chainName = chainName; }
        
        public String getHotelManagementModel() { return hotelManagementModel; }
        public void setHotelManagementModel(String hotelManagementModel) { this.hotelManagementModel = hotelManagementModel; }
        
        public List<Subject> getSubjects() { return subjects; }
        public void setSubjects(List<Subject> subjects) { this.subjects = subjects; }
        
        @Override
        public String toString() {
            return "ExportData{" +
                    "hotelIndex=" + hotelIndex +
                    ", hotelCode='" + hotelCode + '\'' +
                    ", hotelName='" + hotelName + '\'' +
                    ", hotelId='" + hotelId + '\'' +
                    ", chainCode='" + chainCode + '\'' +
                    ", chainName='" + chainName + '\'' +
                    ", hotelManagementModel='" + hotelManagementModel + '\'' +
                    ", subjects=" + subjects +
                    '}';
        }
    }
    
    /**
     * 科目内部类
     */
    public static class Subject {
        @JsonProperty("subjectIndex")
        private Integer subjectIndex;
        
        @JsonProperty("item")
        private String item;
        
        @JsonProperty("subjectCode")
        private String subjectCode;
        
        @JsonProperty("year")
        private Integer year;
        
        @JsonProperty("m1")
        private Object m1;
        
        @JsonProperty("m2")
        private Object m2;
        
        @JsonProperty("m3")
        private Object m3;
        
        @JsonProperty("m4")
        private Object m4;
        
        @JsonProperty("m5")
        private Object m5;
        
        @JsonProperty("m6")
        private Object m6;
        
        @JsonProperty("m7")
        private Object m7;
        
        @JsonProperty("m8")
        private Object m8;
        
        @JsonProperty("m9")
        private Object m9;
        
        @JsonProperty("m10")
        private Object m10;
        
        @JsonProperty("m11")
        private Object m11;
        
        @JsonProperty("m12")
        private Object m12;
        
        @JsonProperty("yearTotal")
        private Object yearTotal;
        
        @JsonProperty("q1")
        private Object q1;
        
        @JsonProperty("q2")
        private Object q2;
        
        @JsonProperty("q3")
        private Object q3;
        
        @JsonProperty("q4")
        private Object q4;
        
        // 比率字段（可选）
        @JsonProperty("m1Rate")
        private Object m1Rate;
        
        @JsonProperty("m2Rate")
        private Object m2Rate;
        
        @JsonProperty("m3Rate")
        private Object m3Rate;
        
        @JsonProperty("m4Rate")
        private Object m4Rate;
        
        @JsonProperty("m5Rate")
        private Object m5Rate;
        
        @JsonProperty("m6Rate")
        private Object m6Rate;
        
        @JsonProperty("m7Rate")
        private Object m7Rate;
        
        @JsonProperty("m8Rate")
        private Object m8Rate;
        
        @JsonProperty("m9Rate")
        private Object m9Rate;
        
        @JsonProperty("m10Rate")
        private Object m10Rate;
        
        @JsonProperty("m11Rate")
        private Object m11Rate;
        
        @JsonProperty("m12Rate")
        private Object m12Rate;
        
        @JsonProperty("yearTotalRate")
        private Object yearTotalRate;
        
        // 构造函数
        public Subject() {}
        
        // Getter和Setter方法
        public Integer getSubjectIndex() { return subjectIndex; }
        public void setSubjectIndex(Integer subjectIndex) { this.subjectIndex = subjectIndex; }
        
        public String getItem() { return item; }
        public void setItem(String item) { this.item = item; }
        
        public String getSubjectCode() { return subjectCode; }
        public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
        
        public Integer getYear() { return year; }
        public void setYear(Integer year) { this.year = year; }
        
        public Object getM1() { return m1; }
        public void setM1(Object m1) { this.m1 = m1; }
        
        public Object getM2() { return m2; }
        public void setM2(Object m2) { this.m2 = m2; }
        
        public Object getM3() { return m3; }
        public void setM3(Object m3) { this.m3 = m3; }
        
        public Object getM4() { return m4; }
        public void setM4(Object m4) { this.m4 = m4; }
        
        public Object getM5() { return m5; }
        public void setM5(Object m5) { this.m5 = m5; }
        
        public Object getM6() { return m6; }
        public void setM6(Object m6) { this.m6 = m6; }
        
        public Object getM7() { return m7; }
        public void setM7(Object m7) { this.m7 = m7; }
        
        public Object getM8() { return m8; }
        public void setM8(Object m8) { this.m8 = m8; }
        
        public Object getM9() { return m9; }
        public void setM9(Object m9) { this.m9 = m9; }
        
        public Object getM10() { return m10; }
        public void setM10(Object m10) { this.m10 = m10; }
        
        public Object getM11() { return m11; }
        public void setM11(Object m11) { this.m11 = m11; }
        
        public Object getM12() { return m12; }
        public void setM12(Object m12) { this.m12 = m12; }
        
        public Object getYearTotal() { return yearTotal; }
        public void setYearTotal(Object yearTotal) { this.yearTotal = yearTotal; }
        
        public Object getQ1() { return q1; }
        public void setQ1(Object q1) { this.q1 = q1; }
        
        public Object getQ2() { return q2; }
        public void setQ2(Object q2) { this.q2 = q2; }
        
        public Object getQ3() { return q3; }
        public void setQ3(Object q3) { this.q3 = q3; }
        
        public Object getQ4() { return q4; }
        public void setQ4(Object q4) { this.q4 = q4; }
        
        public Object getM1Rate() { return m1Rate; }
        public void setM1Rate(Object m1Rate) { this.m1Rate = m1Rate; }
        
        public Object getM2Rate() { return m2Rate; }
        public void setM2Rate(Object m2Rate) { this.m2Rate = m2Rate; }
        
        public Object getM3Rate() { return m3Rate; }
        public void setM3Rate(Object m3Rate) { this.m3Rate = m3Rate; }
        
        public Object getM4Rate() { return m4Rate; }
        public void setM4Rate(Object m4Rate) { this.m4Rate = m4Rate; }
        
        public Object getM5Rate() { return m5Rate; }
        public void setM5Rate(Object m5Rate) { this.m5Rate = m5Rate; }
        
        public Object getM6Rate() { return m6Rate; }
        public void setM6Rate(Object m6Rate) { this.m6Rate = m6Rate; }
        
        public Object getM7Rate() { return m7Rate; }
        public void setM7Rate(Object m7Rate) { this.m7Rate = m7Rate; }
        
        public Object getM8Rate() { return m8Rate; }
        public void setM8Rate(Object m8Rate) { this.m8Rate = m8Rate; }
        
        public Object getM9Rate() { return m9Rate; }
        public void setM9Rate(Object m9Rate) { this.m9Rate = m9Rate; }
        
        public Object getM10Rate() { return m10Rate; }
        public void setM10Rate(Object m10Rate) { this.m10Rate = m10Rate; }
        
        public Object getM11Rate() { return m11Rate; }
        public void setM11Rate(Object m11Rate) { this.m11Rate = m11Rate; }
        
        public Object getM12Rate() { return m12Rate; }
        public void setM12Rate(Object m12Rate) { this.m12Rate = m12Rate; }
        
        public Object getYearTotalRate() { return yearTotalRate; }
        public void setYearTotalRate(Object yearTotalRate) { this.yearTotalRate = yearTotalRate; }
        
        @Override
        public String toString() {
            return "Subject{" +
                    "subjectIndex=" + subjectIndex +
                    ", item='" + item + '\'' +
                    ", subjectCode='" + subjectCode + '\'' +
                    ", year=" + year +
                    ", yearTotal=" + yearTotal +
                    '}';
        }
    }
} 