package com.zai.api.hotelbeds.entity.bookingdetail;
import java.util.List;
public class Rates {
    public String rateClass;
    public String net;
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
