package com.zai.api.hotelbeds.entity.checkrate;
import java.util.List;

public class Rate {
    public String rateKey;
    public String rateClass;
    public String rateType;
    public String net;
    public String allotment;
    public String rateComments;
    public String paymentType;
    public boolean packaging;
    public String boardCode;
    public String boardName;
    public List<CancellationPolicy> cancellationPolicies;
    public int rooms;
    public int adults;
    public int children;
}
