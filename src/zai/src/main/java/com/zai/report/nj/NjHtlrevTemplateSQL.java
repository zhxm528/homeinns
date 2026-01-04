package com.zai.report.nj;

import java.time.LocalDateTime;

/**
 * 酒店收入模板SQL对象
 * 包含酒店日报表数据的各个字段
 */
public class NjHtlrevTemplateSQL {
    private String bdate;
    private String cdate;
    private String hotelid;
    private String dept;
    private String deptname;
    private String class_;
    private String descript;
    private String class1;
    private String descript1;
    private Double amount;
    private Double rebate;
    private LocalDateTime createtime;

    public String getBdate() {
        return bdate;
    }

    public void setBdate(String bdate) {
        this.bdate = bdate;
    }

    public String getCdate() {
        return cdate;
    }

    public void setCdate(String cdate) {
        this.cdate = cdate;
    }

    public String getHotelid() {
        return hotelid;
    }

    public void setHotelid(String hotelid) {
        this.hotelid = hotelid;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getDeptname() {
        return deptname;
    }

    public void setDeptname(String deptname) {
        this.deptname = deptname;
    }

    public String getClass_() {
        return class_;
    }

    public void setClass_(String class_) {
        this.class_ = class_;
    }

    public String getDescript() {
        return descript;
    }

    public void setDescript(String descript) {
        this.descript = descript;
    }

    public String getClass1() {
        return class1;
    }

    public void setClass1(String class1) {
        this.class1 = class1;
    }

    public String getDescript1() {
        return descript1;
    }

    public void setDescript1(String descript1) {
        this.descript1 = descript1;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getRebate() {
        return rebate;
    }

    public void setRebate(Double rebate) {
        this.rebate = rebate;
    }

    public LocalDateTime getCreatetime() {
        return createtime;
    }

    public void setCreatetime(LocalDateTime createtime) {
        this.createtime = createtime;
    }
}
