package com.zai.api.homeinns.importcsv;

import lombok.Data;

@Data
public class CsvRecordDTO {
    private String bdate;
    private String cdate;
    private String hotelid;
    private String clazz; // 对应 class 字段，Java 保留字用 clazz
    private String descript1;
    private String rms_ttl;
    private String rms_occ;
    private String rms_oos;
    private String rms_ooo;
    private String rms_htl;
    private String rms_avl;
    private String rms_dus;
    private String rev_rm;
    private String rev_fb;
    private String rev_ot;
    private String avg_rt;
    private String urc_num;
    private String fbd_num;
    private String createtime;
}
