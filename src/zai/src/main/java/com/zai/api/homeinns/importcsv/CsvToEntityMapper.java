package com.zai.api.homeinns.importcsv;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

public class CsvToEntityMapper {

    private static final SimpleDateFormat DATE_FMT = new SimpleDateFormat("yyyy-MM-dd");
    private static final SimpleDateFormat DATETIME_FMT = new SimpleDateFormat("yyyy-MM-dd");
    


    public static BusinessReportEntity map(CsvRecordDTO dto) {
        BusinessReportEntity entity = new BusinessReportEntity();
        
        try {
            entity.setHotelDailyBusinessId(UUID.randomUUID().toString());
            entity.setBusinessDate(parseDate(dto.getBdate(), DATE_FMT));
            entity.setCollectionDate(dto.getCdate() == null || dto.getCdate().isEmpty() ? 
                DATETIME_FMT.parse("2020-01-01 00:00:00") : parseDate(dto.getCdate(), DATETIME_FMT));
            entity.setHotelId(dto.getHotelid());
            entity.setCategoryCode(dto.getClazz());
            entity.setCategoryName(dto.getDescript1());
            entity.setTotalRooms(toDecimal(dto.getRms_ttl()));
            entity.setOccupiedRooms(toDecimal(dto.getRms_occ()));
            entity.setMaintenanceRooms(toDecimal(dto.getRms_oos()));
            entity.setOutOfOrderRooms(toDecimal(dto.getRms_ooo()));
            entity.setSelfUseRooms(toDecimal(dto.getRms_htl()));
            entity.setAvailableRooms(toDecimal(dto.getRms_avl()));
            entity.setFreeRooms(toDecimal(dto.getRms_dus()));
            entity.setRoomRevenue(toDecimal(dto.getRev_rm()));
            entity.setRoomFitRevenue(toDecimal(dto.getRev_rm()));
            entity.setFoodBeverageRevenue(toDecimal(dto.getRev_fb()));
            entity.setFbRestaurantRevenue(toDecimal(dto.getRev_fb()));
            entity.setOtherRevenue(toDecimal(dto.getRev_ot()));
            entity.setAverageRate(toDecimal(dto.getAvg_rt()));
            
            entity.setAdultOccupants(toDecimal(dto.getUrc_num()));
            entity.setFoodBeverageGuests(toDecimal(dto.getFbd_num()));
            entity.setCreateTime(parseDate(dto.getCreatetime(), DATETIME_FMT));

            BigDecimal totalRevenue = entity.getRoomRevenue()
                    .add(entity.getFoodBeverageRevenue())
                    .add(entity.getOtherRevenue());
            entity.setTotalRevenue(totalRevenue);

            BigDecimal occupancyRate = BigDecimal.ZERO;
            if (entity.getTotalRooms().compareTo(BigDecimal.ZERO) > 0) {
                occupancyRate = entity.getOccupiedRooms()
                    .divide(entity.getTotalRooms(), 2, BigDecimal.ROUND_HALF_UP);
            }
            entity.setOccupancyRate(occupancyRate);

            entity.setRevparRate(toDecimal(dto.getAvg_rt()).multiply(entity.getOccupancyRate()));

            entity.setChainId(parseChainId(entity.getHotelId()));
        } catch (Exception e) {
            throw new RuntimeException("转换失败: " + dto, e);
        }

        return entity;
    }

    private static BigDecimal toDecimal(String val) {
        try {
            return new BigDecimal(val.trim());
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    private static Date parseDate(String s, SimpleDateFormat fmt) throws Exception {
        return fmt.parse(s.trim());
    }

    private static String parseChainId(String hotelId) {
        if (hotelId.startsWith("UC")) return "yifei";
        if (hotelId.startsWith("WX")) return "wanxin";
        if (hotelId.startsWith("JG") || hotelId.startsWith("JL") ||
            hotelId.startsWith("NY") || hotelId.startsWith("NH")) return "jianguo";
        return "unknown";
    }
}
