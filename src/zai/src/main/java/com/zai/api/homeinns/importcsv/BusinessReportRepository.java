package com.zai.api.homeinns.importcsv;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Value;

import java.sql.Timestamp;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class BusinessReportRepository {

    private final JdbcTemplate jdbcTemplate;
    @Value("${csv.file.offset}")
    private int csvFileOffset;

    public boolean exists(BusinessReportEntity e) {
        String sql = "SELECT COUNT(*) FROM hotel_daily_business_report WHERE chain_id=? AND hotel_id=? AND business_date=? AND category_code=?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class,
                e.getChainId(), e.getHotelId(), e.getBusinessDate(), e.getCategoryCode());
        return count != null && count > 0;
    }

    public void batchInsert(List<BusinessReportEntity> list) {
        String sql = "INSERT INTO hotel_daily_business_report (" +
                "hotel_daily_business_id, business_date, collection_date, hotel_id, chain_id, category_code, category_name, " +
                "total_rooms, occupied_rooms, occupancy_rate, maintenance_rooms, out_of_order_rooms, " +
                "self_use_rooms, available_rooms, free_rooms, room_revenue, room_group_revenue, room_fit_revenue, " +
                "food_beverage_revenue, fb_restaurant_revenue, fb_mic_revenue, other_revenue, total_revenue, " +
                "average_rate, revpar_rate, adult_occupants, food_beverage_guests, create_time" +
                ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.batchUpdate(sql, list, csvFileOffset, (ps, e) -> {
            ps.setString(1, e.getHotelDailyBusinessId());
            ps.setDate(2, new java.sql.Date(e.getBusinessDate().getTime()));
            ps.setTimestamp(3, new Timestamp(e.getCollectionDate().getTime()));
            ps.setString(4, e.getHotelId());
            ps.setString(5, e.getChainId());
            ps.setString(6, e.getCategoryCode());
            ps.setString(7, e.getCategoryName());
            ps.setBigDecimal(8, e.getTotalRooms());
            ps.setBigDecimal(9, e.getOccupiedRooms());
            ps.setBigDecimal(10, e.getOccupancyRate());
            ps.setBigDecimal(11, e.getMaintenanceRooms());
            ps.setBigDecimal(12, e.getOutOfOrderRooms());
            ps.setBigDecimal(13, e.getSelfUseRooms());
            ps.setBigDecimal(14, e.getAvailableRooms());
            ps.setBigDecimal(15, e.getFreeRooms());
            ps.setBigDecimal(16, e.getRoomRevenue());
            ps.setBigDecimal(17, e.getRoomGroupRevenue());
            ps.setBigDecimal(18, e.getRoomFitRevenue());
            ps.setBigDecimal(19, e.getFoodBeverageRevenue());
            ps.setBigDecimal(20, e.getFbRestaurantRevenue());
            ps.setBigDecimal(21, e.getFbMicRevenue());
            ps.setBigDecimal(22, e.getOtherRevenue());
            ps.setBigDecimal(23, e.getTotalRevenue());
            ps.setBigDecimal(24, e.getAverageRate());
            ps.setBigDecimal(25, e.getRevparRate());
            ps.setBigDecimal(26, e.getAdultOccupants());
            ps.setBigDecimal(27, e.getFoodBeverageGuests());
            ps.setTimestamp(28, new Timestamp(e.getCreateTime().getTime()));
        });
    }
}
