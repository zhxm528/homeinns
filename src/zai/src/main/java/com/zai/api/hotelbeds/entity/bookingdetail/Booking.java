package com.zai.api.hotelbeds.entity.bookingdetail;

public class Booking {
    public String reference;
    public String clientReference;
    public String creationDate;
    public String status;
    public ModificationPolicies modificationPolicies;
    public String creationUser;
    public Holder holder;
    public Hotel hotel;
    public InvoiceCompany invoiceCompany;
    public double totalNet;
    public double pendingAmount;
    public String currency;
}
