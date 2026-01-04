package com.zai.hotelbudget.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 酒店预算实体类
 */
public class HotelBudget {
    private String chainId;
    private String chainCode;
    private String chainName;
    private String hotelId;
    private String hotelCode;
    private String hotelName;
    private String hotelManagementModel;
    private String subjectCode;
    private String subjectName;
    private String budgetVersion;
    private Integer budgetYear;
    private BigDecimal janBudget;
    private BigDecimal janRatio;
    private BigDecimal febBudget;
    private BigDecimal febRatio;
    private BigDecimal marBudget;
    private BigDecimal marRatio;
    private BigDecimal aprBudget;
    private BigDecimal aprRatio;
    private BigDecimal mayBudget;
    private BigDecimal mayRatio;
    private BigDecimal junBudget;
    private BigDecimal junRatio;
    private BigDecimal julBudget;
    private BigDecimal julRatio;
    private BigDecimal augBudget;
    private BigDecimal augRatio;
    private BigDecimal sepBudget;
    private BigDecimal sepRatio;
    private BigDecimal octBudget;
    private BigDecimal octRatio;
    private BigDecimal novBudget;
    private BigDecimal novRatio;
    private BigDecimal decBudget;
    private BigDecimal decRatio;
    private BigDecimal annualBudget;
    private BigDecimal annualRatio;
    private BigDecimal q1Budget;
    private BigDecimal q1Ratio;
    private BigDecimal q2Budget;
    private BigDecimal q2Ratio;
    private BigDecimal q3Budget;
    private BigDecimal q3Ratio;
    private BigDecimal q4Budget;
    private BigDecimal q4Ratio;
    private Integer sort;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public String getChainId() { return chainId; }
    public void setChainId(String chainId) { this.chainId = chainId; }

    public String getChainCode() { return chainCode; }
    public void setChainCode(String chainCode) { this.chainCode = chainCode; }

    public String getChainName() { return chainName; }
    public void setChainName(String chainName) { this.chainName = chainName; }

    public String getHotelId() { return hotelId; }
    public void setHotelId(String hotelId) { this.hotelId = hotelId; }

    public String getHotelCode() { return hotelCode; }
    public void setHotelCode(String hotelCode) { this.hotelCode = hotelCode; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public String getHotelManagementModel() { return hotelManagementModel; }
    public void setHotelManagementModel(String hotelManagementModel) { this.hotelManagementModel = hotelManagementModel; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getBudgetVersion() { return budgetVersion; }
    public void setBudgetVersion(String budgetVersion) { this.budgetVersion = budgetVersion; }

    public Integer getBudgetYear() { return budgetYear; }
    public void setBudgetYear(Integer budgetYear) { this.budgetYear = budgetYear; }

    public BigDecimal getJanBudget() { return janBudget; }
    public void setJanBudget(BigDecimal janBudget) { this.janBudget = janBudget; }

    public BigDecimal getJanRatio() { return janRatio; }
    public void setJanRatio(BigDecimal janRatio) { this.janRatio = janRatio; }

    public BigDecimal getFebBudget() { return febBudget; }
    public void setFebBudget(BigDecimal febBudget) { this.febBudget = febBudget; }

    public BigDecimal getFebRatio() { return febRatio; }
    public void setFebRatio(BigDecimal febRatio) { this.febRatio = febRatio; }

    public BigDecimal getMarBudget() { return marBudget; }
    public void setMarBudget(BigDecimal marBudget) { this.marBudget = marBudget; }

    public BigDecimal getMarRatio() { return marRatio; }
    public void setMarRatio(BigDecimal marRatio) { this.marRatio = marRatio; }

    public BigDecimal getAprBudget() { return aprBudget; }
    public void setAprBudget(BigDecimal aprBudget) { this.aprBudget = aprBudget; }

    public BigDecimal getAprRatio() { return aprRatio; }
    public void setAprRatio(BigDecimal aprRatio) { this.aprRatio = aprRatio; }

    public BigDecimal getMayBudget() { return mayBudget; }
    public void setMayBudget(BigDecimal mayBudget) { this.mayBudget = mayBudget; }

    public BigDecimal getMayRatio() { return mayRatio; }
    public void setMayRatio(BigDecimal mayRatio) { this.mayRatio = mayRatio; }

    public BigDecimal getJunBudget() { return junBudget; }
    public void setJunBudget(BigDecimal junBudget) { this.junBudget = junBudget; }

    public BigDecimal getJunRatio() { return junRatio; }
    public void setJunRatio(BigDecimal junRatio) { this.junRatio = junRatio; }

    public BigDecimal getJulBudget() { return julBudget; }
    public void setJulBudget(BigDecimal julBudget) { this.julBudget = julBudget; }

    public BigDecimal getJulRatio() { return julRatio; }
    public void setJulRatio(BigDecimal julRatio) { this.julRatio = julRatio; }

    public BigDecimal getAugBudget() { return augBudget; }
    public void setAugBudget(BigDecimal augBudget) { this.augBudget = augBudget; }

    public BigDecimal getAugRatio() { return augRatio; }
    public void setAugRatio(BigDecimal augRatio) { this.augRatio = augRatio; }

    public BigDecimal getSepBudget() { return sepBudget; }
    public void setSepBudget(BigDecimal sepBudget) { this.sepBudget = sepBudget; }

    public BigDecimal getSepRatio() { return sepRatio; }
    public void setSepRatio(BigDecimal sepRatio) { this.sepRatio = sepRatio; }

    public BigDecimal getOctBudget() { return octBudget; }
    public void setOctBudget(BigDecimal octBudget) { this.octBudget = octBudget; }

    public BigDecimal getOctRatio() { return octRatio; }
    public void setOctRatio(BigDecimal octRatio) { this.octRatio = octRatio; }

    public BigDecimal getNovBudget() { return novBudget; }
    public void setNovBudget(BigDecimal novBudget) { this.novBudget = novBudget; }

    public BigDecimal getNovRatio() { return novRatio; }
    public void setNovRatio(BigDecimal novRatio) { this.novRatio = novRatio; }

    public BigDecimal getDecBudget() { return decBudget; }
    public void setDecBudget(BigDecimal decBudget) { this.decBudget = decBudget; }

    public BigDecimal getDecRatio() { return decRatio; }
    public void setDecRatio(BigDecimal decRatio) { this.decRatio = decRatio; }

    public BigDecimal getAnnualBudget() { return annualBudget; }
    public void setAnnualBudget(BigDecimal annualBudget) { this.annualBudget = annualBudget; }

    public BigDecimal getAnnualRatio() { return annualRatio; }
    public void setAnnualRatio(BigDecimal annualRatio) { this.annualRatio = annualRatio; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public BigDecimal getQ1Budget() { return q1Budget; }
    public void setQ1Budget(BigDecimal q1Budget) { this.q1Budget = q1Budget; }

    public BigDecimal getQ1Ratio() { return q1Ratio; }
    public void setQ1Ratio(BigDecimal q1Ratio) { this.q1Ratio = q1Ratio; }

    public BigDecimal getQ2Budget() { return q2Budget; }    
    public void setQ2Budget(BigDecimal q2Budget) { this.q2Budget = q2Budget; }

    public BigDecimal getQ2Ratio() { return q2Ratio; }
    public void setQ2Ratio(BigDecimal q2Ratio) { this.q2Ratio = q2Ratio; }

    public BigDecimal getQ3Budget() { return q3Budget; }
    public void setQ3Budget(BigDecimal q3Budget) { this.q3Budget = q3Budget; }

    public BigDecimal getQ3Ratio() { return q3Ratio; }
    public void setQ3Ratio(BigDecimal q3Ratio) { this.q3Ratio = q3Ratio; }

    public BigDecimal getQ4Budget() { return q4Budget; }
    public void setQ4Budget(BigDecimal q4Budget) { this.q4Budget = q4Budget; }

    public BigDecimal getQ4Ratio() { return q4Ratio; }
    public void setQ4Ratio(BigDecimal q4Ratio) { this.q4Ratio = q4Ratio; }

    public Integer getSort() { return sort; }
    public void setSort(Integer sort) { this.sort = sort; }
} 