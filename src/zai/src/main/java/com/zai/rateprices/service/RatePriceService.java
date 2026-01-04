package com.zai.rateprices.service;

import com.zai.common.BaseResponse;
import com.zai.rateprices.dto.RatePriceAddRequest;
import com.zai.rateprices.dto.RatePriceByHotelRequest;
import com.zai.rateprices.dto.RatePriceByRoomTypeRequest;
import com.zai.rateprices.dto.RatePriceListRequest;
import com.zai.rateprices.dto.RatePriceMaintenanceRequest;
import com.zai.rateprices.dto.RatePriceUpdateRequest;
import com.zai.rateprices.dto.BookingByHotelRateCodeRequest;
import com.zai.rateprices.model.AvailabilityRequestModel;
import com.zai.rateprices.dto.RatePriceByRateCodeRequest;


/**
 * 房价价格服务接口
 */
public interface RatePriceService {
    
    /**
     * 添加房价价格
     * @param request 添加请求
     * @return 响应结果
     */
    BaseResponse add(RatePriceAddRequest request);
    
    /**
     * 更新房价价格
     * @param request 更新请求
     * @return 响应结果
     */
    BaseResponse update(RatePriceUpdateRequest request);
    
    /**
     * 删除房价价格
     * @param priceId 价格ID
     * @return 响应结果
     */
    BaseResponse delete(String priceId);
    
    /**
     * 查询房价价格列表
     * @param request 查询请求
     * @return 响应结果
     */
    BaseResponse list(RatePriceListRequest request);
    
    /**
     * 根据ID查询房价价格
     * @param priceId 价格ID
     * @return 响应结果
     */
    BaseResponse getById(String priceId);
    
    /**
     * 批量添加房价价格
     * @param request 批量添加请求
     * @return 响应结果
     */
    BaseResponse batchAdd(RatePriceAddRequest request);
    
    /**
     * 日历查询
     * @param request 日历查询请求
     * @return 响应结果
     */
    BaseResponse calendar(AvailabilityRequestModel request);
    
    /**
     * 根据酒店ID和入住日期查询房价价格
     * @param request 查询请求
     * @return 响应结果
     */
    BaseResponse setRatePricesByHotel(RatePriceByHotelRequest request);
    
    /**
     * 根据酒店ID、房型代码和入住日期设置房型库存状态
     * @param request 请求参数
     * @return 响应结果
     */
    BaseResponse setDailyRoomTypeStatus(RatePriceByRoomTypeRequest request);

    /**
     * 根据酒店ID、房型代码、房价码代码和入住日期设置房型库存状态
     * @param request 请求参数
     * @return 响应结果
     */
    BaseResponse setDailyRateCodeStatus(RatePriceByRateCodeRequest request);
    
    /**
     * 维护房价
     * @param request 维护房价请求
     * @return 响应结果
     */
    BaseResponse maintainRatePrice(RatePriceMaintenanceRequest request);
    
    /**
     * 根据酒店ID和价格代码查询预订信息
     * @param request 查询请求
     * @return 响应结果
     */
    BaseResponse bookingByHotelRateCodeService(BookingByHotelRateCodeRequest request);
} 