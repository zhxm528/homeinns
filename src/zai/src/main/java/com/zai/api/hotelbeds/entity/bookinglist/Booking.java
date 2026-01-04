package com.zai.api.hotelbeds.entity.bookinglist;

public class Booking {
    public String reference;
    public String clientReference;
    public String creationDate;
    public String status;
    public String creationUser;
    public Holder holder;
    public Hotel hotel;
    public InvoiceCompany invoiceCompany;
    public double totalSellingRate;
    public double totalNet;
    public double pendingAmount;
    public String currency;
}
