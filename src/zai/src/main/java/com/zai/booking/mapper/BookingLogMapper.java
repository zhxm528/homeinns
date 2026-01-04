package com.zai.booking.mapper;

import com.zai.booking.entity.BookingLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository
public interface BookingLogMapper {
    
    /**
     * 插入预订日志记录
     */
    void insert(BookingLog bookingLog);
    
    /**
     * 根据日志ID删除
     */
    void deleteByBookingLogId(String bookingLogId);
    
    /**
     * 根据预订ID删除所有日志记录
     */
    void deleteByBookingId(String bookingId);
    
    /**
     * 更新预订日志信息
     */
    void update(BookingLog bookingLog);
    
    /**
     * 根据日志ID查询
     */
    BookingLog selectByBookingLogId(String bookingLogId);
    
    /**
     * 根据预订ID查询所有日志记录
     */
    List<BookingLog> selectByBookingId(String bookingId);
    
    /**
     * 根据预订ID和操作类型查询日志记录
     */
    List<BookingLog> selectByBookingIdAndOperation(@Param("bookingId") String bookingId, 
                                                   @Param("operation") String operation);
    
    /**
     * 根据操作类型查询日志记录
     */
    List<BookingLog> selectByOperation(String operation);
    
    /**
     * 根据操作人查询日志记录
     */
    List<BookingLog> selectByOperator(String operator);
    
    /**
     * 查询所有日志记录
     */
    List<BookingLog> selectAll();
    
    /**
     * 根据预订ID查询最新版本的日志记录
     */
    BookingLog selectLatestByBookingId(String bookingId);
} 