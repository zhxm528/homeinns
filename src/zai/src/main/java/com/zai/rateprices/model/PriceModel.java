package com.zai.rateprices.model;

/**
 * 价格模型
 */
public class PriceModel {
    private java.math.BigDecimal singleOccupancy;
    private java.math.BigDecimal doubleOccupancy;

    public java.math.BigDecimal getSingleOccupancy() {
        return singleOccupancy;
    }

    public void setSingleOccupancy(java.math.BigDecimal singleOccupancy) {
        this.singleOccupancy = singleOccupancy;
    }

    public java.math.BigDecimal getDoubleOccupancy() {
        return doubleOccupancy;
    }

    public void setDoubleOccupancy(java.math.BigDecimal doubleOccupancy) {
        this.doubleOccupancy = doubleOccupancy;
    }
} 