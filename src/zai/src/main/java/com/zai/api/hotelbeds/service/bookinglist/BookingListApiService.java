package com.zai.api.hotelbeds.service.bookinglist;

import com.zai.api.hotelbeds.entity.bookinglist.*;
import com.zai.util.MakeRequestor;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Service class for interacting with the Hotelbeds Booking API to retrieve and check booking information.
 * Provides methods to fetch booking data, validate bookings, and send email notifications.
 */
@Component
public class BookingListApiService {
    // Singleton instance of the service
    private static BookingListApiService instance;

    // API endpoint for booking operations
    private static final String API_METHOD = "hotel-api/1.0/bookings";

    @Autowired
    private MakeRequestor makeRequestor;

    /**
     * Default constructor for Spring-managed bean creation.
     */
    public BookingListApiService() {
    }

    /**
     * Retrieves the singleton instance of BookingListApiService.
     * Note: Consider using Spring's dependency injection instead of manual singleton pattern.
     *
     * @return the singleton instance
     */
    public static BookingListApiService getInstance() {
        if (instance == null) {
            instance = new BookingListApiService();
        }
        return instance;
    }

    /**
     * Main method for testing the service. Initiates a property check for a specific hotel and date range.
     * Note: This method is for testing and should not be used in production.
     *
     * @param args command-line arguments (not used)
     */
    public static void main(String[] args) {
        try {
            BookingListApiService test = BookingListApiService.getInstance();
            test.mainPropertysCheck();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Checks booking properties for the past 7 days and sends a summary email.
     * Generates a report of booking issues and sends it to specified recipients.
     *
     * @throws IOException if an error occurs during API request or email sending
     */
    public void mainPropertysCheck() throws IOException {
        try {
            // Initialize report buffer
            StringBuffer sb = new StringBuffer();
            LocalDateTime jobLocalDateTime = LocalDateTime.now();
            DateTimeFormatter jobTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd EEEE HH:mm:ss");
            DateTimeFormatter jobDayFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            // Append report header
            sb.append("******检查开始******\n");
            sb.append("检查时间：" + jobLocalDateTime.format(jobTimeFormatter) + "\n\n");

            int hotelTotals = 0; // Placeholder for total hotels (not updated in code)

            // Calculate date range (past 7 days to today)
            LocalDate startLocalDate = LocalDate.now().plusDays(-7);
            LocalDate endLocalDate = LocalDate.now();
            LocalDate tmpEndLocalDate = LocalDate.now().plusDays(1);

            // Format dates
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String startDate = startLocalDate.format(formatter);
            String endDate = endLocalDate.format(formatter);
            String tmpEndDate = tmpEndLocalDate.format(formatter);

            // Fetch and check bookings
            int checkTotal = 0;
            int hbTotal = mainInitiateCheckPriceBooking(sb, null, null, startDate, endDate, 1, 10);
            sb.append("----------------------------------------------------------------\n\n");
            sb.append("******检查结束******\n");
            sb.append("注意事项：代理通酒店总数" + hotelTotals + "家，如果有新增酒店请及时通知IT。\n");

            // Send email notification
            com.zai.util.EmailSender emailSender = new com.zai.util.EmailSender();
            String[] toEmails = {"jianzhou@homeinns.com"};
            String[] ccEmails = null;
            String[] bccEmails = null;
            String emailSubject = "HB检查近7天订单(" + jobLocalDateTime.format(jobDayFormatter) + ")";
            String emailBody = sb.toString();
            boolean textEmailResult = emailSender.sendTextEmail(toEmails, ccEmails, bccEmails, emailSubject, emailBody);

            // Log results
            System.out.println(sb.toString());
            System.out.println("----------------------------------------------------------------");
            System.out.println("Email sent: " + textEmailResult);
            System.out.println("Send to: " + toEmails[0]);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Initiates the booking check process by fetching the total number of bookings and triggering pagination.
     *
     * @param sb           report buffer to append results
     * @param billresvMap  map of bill reservations (optional)
     * @param hotel        hotel code (optional)
     * @param startDate    start date of the booking period
     * @param endDate      end date of the booking period
     * @param start        starting index for pagination
     * @param pageSize     number of records per page
     * @return total number of bookings
     */
    public int mainInitiateCheckPriceBooking(StringBuffer sb, Map<String, String> billresvMap, String hotel,
                                             String startDate, String endDate, int start, int pageSize) {
        try {
            int total = 0;
            // Fetch booking data
            ApiResponse apiResponse = getApiResponse(sb, billresvMap, hotel, startDate, endDate, start, start + pageSize - 1);
            if (apiResponse != null && apiResponse.bookings != null) {
                total = apiResponse.bookings.total;
            }
            // Trigger recursive pagination
            mainCheckPriceBooking(sb, billresvMap, hotel, startDate, endDate, start + pageSize, pageSize);
            return total;
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return 0;
    }

    /**
     * Recursively processes booking data in pages until all records are checked.
     *
     * @param sb           report buffer to append results
     * @param billresvMap  map of bill reservations (optional)
     * @param hotel        hotel code (optional)
     * @param startDate    start date of the booking period
     * @param endDate      end date of the booking period
     * @param start        starting index for pagination
     * @param pageSize     number of records per page
     * @return total number of bookings
     */
    public int mainCheckPriceBooking(StringBuffer sb, Map<String, String> billresvMap, String hotel,
                                     String startDate, String endDate, int start, int pageSize) {
        try {
            int total = 0;
            // Fetch booking data for the current page
            ApiResponse apiResponse = getApiResponse(sb, billresvMap, hotel, startDate, endDate, start, start + pageSize - 1);
            if (apiResponse != null && apiResponse.bookings != null) {
                total = apiResponse.bookings.total;
            }
            // Stop recursion if all records are processed
            if (start >= total) {
                return total;
            }
            // Process next page
            return mainCheckPriceBooking(sb, billresvMap, hotel, startDate, endDate, start + pageSize, pageSize);
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return 0;
    }

    /**
     * Fetches booking data from the Hotelbeds API and validates bookings against a reservation map.
     *
     * @param sb           report buffer to append results
     * @param billresvMap  map of bill reservations (optional)
     * @param hotel        hotel code (optional)
     * @param startDate    start date of the booking period
     * @param endDate      end date of the booking period
     * @param from         starting index for pagination
     * @param to           ending index for pagination
     * @return ApiResponse containing booking data
     * @throws IOException if an error occurs during API request
     */
    public ApiResponse getApiResponse(StringBuffer sb, Map<String, String> billresvMap, String hotel,
                                      String startDate, String endDate, int from, int to) throws IOException {
        try {
            if (hotel == null || hotel.trim().isEmpty()) {
                return null;
            }

            ApiResponse apiResponse = ApiResponse.getInstance();
            JsonObject requestJson = makeRequestor.buildRequestJson();

            // Build request parameters
            Map<String, Object> param = new HashMap<>();
            param.put("status", "ALL");
            param.put("hotel", hotel);
            param.put("from", String.valueOf(from));
            param.put("to", String.valueOf(to));
            param.put("start", startDate);
            param.put("end", endDate);

            // Send API request
            String jsonResponse = makeRequestor.sendGetRequest(requestJson, API_METHOD, param);

            // Parse response
            Gson gson = new Gson();
            apiResponse = gson.fromJson(jsonResponse, ApiResponse.class);

            if (apiResponse != null && apiResponse.bookings != null) {
                BookingsContainer bookingsContainer = apiResponse.bookings;
                int total = bookingsContainer.total;
                List<Booking> bookingList = bookingsContainer.bookings;

                if (bookingList != null) {
                    int index = 1;
                    for (Booking booking : bookingList) {
                        // Extract booking details
                        String hbReference = booking.reference; // Hotelbeds booking reference
                        String hbClientReference = booking.clientReference; // CRS reference
                        String hbCreationDate = booking.creationDate;
                        String hbStatus = booking.status;
                        String hbCreationUser = booking.creationUser;
                        Holder hbHolder = booking.holder;
                        String hbHolderName = hbHolder.name;
                        InvoiceCompany hbInvoiceCompany = booking.invoiceCompany;
                        double hbTotalSellingRate = booking.totalSellingRate;
                        double hbTotalNet = booking.totalNet;
                        double hbPendingAmount = booking.pendingAmount;
                        String hbCurrency = booking.currency;
                        Hotel hbHotel = booking.hotel;
                        String hbCheckOut = hbHotel.checkOut;
                        String hbCheckIn = hbHotel.checkIn;
                        int hbHotelCode = hbHotel.code;
                        String hbHotelName = hbHotel.name;
                        String hbDestinationCode = hbHotel.destinationCode;
                        List<Rooms> hbRooms = hbHotel.rooms;

                        boolean hasErrorBooking = false;
                        String checkResult = "";

                        if (hbReference != null && !hbReference.isEmpty()) {
                            if (billresvMap != null && billresvMap.containsKey(hbReference)) {
                                // Booking exists in reservation map
                                if ("CANCELLED".equalsIgnoreCase(hbStatus) && hbPendingAmount > 0) {
                                    // Cancelled booking with penalty
                                    checkResult = "【取消单需支付罚金】【HB罚金：" + hbPendingAmount + "】";
                                    hasErrorBooking = true;
                                }
                            } else {
                                // Missing booking in reservation map
                                checkResult = "【漏单】";
                                hasErrorBooking = true;
                            }

                            // Append error to report
                            if (hasErrorBooking) {
                                sb.append(index + "、");
                                sb.append(checkResult);
                                sb.append("【HB：" + hbReference + "】【CRS：" + hbClientReference + "】");
                                sb.append("【客人：" + hbHolderName + "】\n");
                                index++;
                            }
                        }
                    }
                }
            }
            return apiResponse;
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return null;
    }
}