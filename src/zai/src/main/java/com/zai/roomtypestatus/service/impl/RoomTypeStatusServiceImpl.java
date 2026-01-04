package com.zai.roomtypestatus.service.impl;

import com.google.gson.Gson;
import com.zai.common.BaseResponse;
import com.zai.roomtypestatus.dto.RoomTypeStatusAddRequest;
import com.zai.roomtypestatus.dto.RoomTypeStatusListRequest;
import com.zai.roomtypestatus.dto.RoomTypeStatusUpdateRequest;
import com.zai.roomtypestatus.entity.RoomTypeStatus;
import com.zai.roomtypestatus.mapper.RoomTypeStatusMapper;
import com.zai.roomtypestatus.service.RoomTypeStatusService;
import com.zai.util.IdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 房型库存状态服务实现类
 */
@Service
public class RoomTypeStatusServiceImpl implements RoomTypeStatusService {
    
    private static final Logger log = LoggerFactory.getLogger(RoomTypeStatusServiceImpl.class);
    
    @Autowired
    private Gson gson;
    
    @Autowired
    private RoomTypeStatusMapper roomTypeStatusMapper;
    
    @Override
    @Transactional
    public BaseResponse add(RoomTypeStatusAddRequest request) {
        log.debug("添加房型库存状态请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getChainId())) {
                return BaseResponse.error("连锁ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getHotelId())) {
                return BaseResponse.error("酒店ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getRateCode())) {
                return BaseResponse.error("房价码不能为空");
            }
            
            if (!StringUtils.hasText(request.getRoomTypeCode())) {
                return BaseResponse.error("房型代码不能为空");
            }
            
            if (request.getStayDate() == null) {
                return BaseResponse.error("入住日期不能为空");
            }
            
            // 验证日期格式
            try {
                LocalDate.parse(request.getStayDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } catch (Exception e) {
                return BaseResponse.error("入住日期格式错误，请使用yyyy-MM-dd格式");
            }
            
            // 检查是否已存在
            RoomTypeStatus existing = roomTypeStatusMapper.selectByPrimaryKey(
                request.getChainId(), 
                request.getHotelId(), 
                request.getRateCode(), 
                request.getRoomTypeCode(), 
                request.getStayDate()
            );
            
            if (existing != null) {
                return BaseResponse.error("该日期已存在房型库存状态记录");
            }
            
            // 创建实体对象
            RoomTypeStatus roomTypeStatus = new RoomTypeStatus();
            roomTypeStatus.setRoomtypeStatusId(IdGenerator.generate64BitId());
            roomTypeStatus.setChainId(request.getChainId());
            roomTypeStatus.setHotelId(request.getHotelId());
            roomTypeStatus.setHotelCode(request.getHotelCode());
            roomTypeStatus.setRatePlanId(request.getRatePlanId());
            roomTypeStatus.setRoomTypeId(request.getRoomTypeId());
            roomTypeStatus.setRoomTypeCode(request.getRoomTypeCode());
            roomTypeStatus.setRateCodeId(request.getRateCodeId());
            roomTypeStatus.setRateCode(request.getRateCode());
            roomTypeStatus.setStayDate(request.getStayDate());
            roomTypeStatus.setIsAvailable(request.getIsAvailable());
            roomTypeStatus.setRemainingInventory(request.getRemainingInventory());
            roomTypeStatus.setSoldInventory(request.getSoldInventory());
            roomTypeStatus.setPhysicalInventory(request.getPhysicalInventory());
            roomTypeStatus.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            roomTypeStatus.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            
            // 保存到数据库
            int result = roomTypeStatusMapper.insert(roomTypeStatus);
            
            if (result > 0) {
                BaseResponse response = BaseResponse.success("房型库存状态添加成功");
                log.debug("添加房型库存状态响应: {}", gson.toJson(response));
                return response;
            } else {
                return BaseResponse.error("房型库存状态添加失败");
            }
            
        } catch (Exception e) {
            log.error("添加房型库存状态异常", e);
            return BaseResponse.error("添加房型库存状态异常: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse update(RoomTypeStatusUpdateRequest request) {
        log.debug("更新房型库存状态请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getRoomtypeStatusId())) {
                return BaseResponse.error("状态记录ID不能为空");
            }
            
            // 验证日期格式（如果提供了日期）
            if (StringUtils.hasText(request.getStayDate())) {
                try {
                    LocalDate.parse(request.getStayDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                } catch (Exception e) {
                    return BaseResponse.error("入住日期格式错误，请使用yyyy-MM-dd格式");
                }
            }
            
            // 检查记录是否存在
            RoomTypeStatus existing = roomTypeStatusMapper.selectById(request.getRoomtypeStatusId());
            if (existing == null) {
                return BaseResponse.error("房型库存状态记录不存在");
            }
            
            // 更新实体对象
            RoomTypeStatus roomTypeStatus = new RoomTypeStatus();
            roomTypeStatus.setRoomtypeStatusId(request.getRoomtypeStatusId());
            roomTypeStatus.setChainId(request.getChainId());
            roomTypeStatus.setHotelId(request.getHotelId());
            roomTypeStatus.setHotelCode(request.getHotelCode());
            roomTypeStatus.setRatePlanId(request.getRatePlanId());
            roomTypeStatus.setRoomTypeId(request.getRoomTypeId());
            roomTypeStatus.setRoomTypeCode(request.getRoomTypeCode());
            roomTypeStatus.setRateCodeId(request.getRateCodeId());
            roomTypeStatus.setRateCode(request.getRateCode());
            if (StringUtils.hasText(request.getStayDate())) {
                roomTypeStatus.setStayDate(request.getStayDate());
            }
            roomTypeStatus.setIsAvailable(request.getIsAvailable());
            roomTypeStatus.setRemainingInventory(request.getRemainingInventory());
            roomTypeStatus.setSoldInventory(request.getSoldInventory());
            roomTypeStatus.setPhysicalInventory(request.getPhysicalInventory());
            roomTypeStatus.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            
            // 更新数据库
            int result = roomTypeStatusMapper.update(roomTypeStatus);
            
            if (result > 0) {
                BaseResponse response = BaseResponse.success("房型库存状态更新成功");
                log.debug("更新房型库存状态响应: {}", gson.toJson(response));
                return response;
            } else {
                return BaseResponse.error("房型库存状态更新失败");
            }
            
        } catch (Exception e) {
            log.error("更新房型库存状态异常", e);
            return BaseResponse.error("更新房型库存状态异常: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse delete(String roomtypeStatusId) {
        log.debug("删除房型库存状态请求: roomtypeStatusId={}", roomtypeStatusId);
        
        try {
            if (!StringUtils.hasText(roomtypeStatusId)) {
                return BaseResponse.error("状态记录ID不能为空");
            }
            
            // 检查记录是否存在
            RoomTypeStatus existing = roomTypeStatusMapper.selectById(roomtypeStatusId);
            if (existing == null) {
                return BaseResponse.error("房型库存状态记录不存在");
            }
            
            // 删除记录
            int result = roomTypeStatusMapper.deleteById(roomtypeStatusId);
            
            if (result > 0) {
                BaseResponse response = BaseResponse.success("房型库存状态删除成功");
                log.debug("删除房型库存状态响应: {}", gson.toJson(response));
                return response;
            } else {
                return BaseResponse.error("房型库存状态删除失败");
            }
            
        } catch (Exception e) {
            log.error("删除房型库存状态异常", e);
            return BaseResponse.error("删除房型库存状态异常: " + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse list(RoomTypeStatusListRequest request) {
        log.debug("查询房型库存状态列表请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getChainId())) {
                return BaseResponse.error("连锁ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getHotelId())) {
                return BaseResponse.error("酒店ID不能为空");
            }
            
            // 验证日期格式（如果提供了日期）
            if (StringUtils.hasText(request.getStartDate())) {
                try {
                    LocalDate.parse(request.getStartDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                } catch (Exception e) {
                    return BaseResponse.error("开始日期格式错误，请使用yyyy-MM-dd格式");
                }
            }
            
            if (StringUtils.hasText(request.getEndDate())) {
                try {
                    LocalDate.parse(request.getEndDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                } catch (Exception e) {
                    return BaseResponse.error("结束日期格式错误，请使用yyyy-MM-dd格式");
                }
            }
            
            List<RoomTypeStatus> roomTypeStatusList = roomTypeStatusMapper.selectByCondition(
                request.getChainId(),
                request.getHotelId(),
                request.getRoomTypeCode(),
                request.getRateCode(),
                request.getStartDate(),
                request.getEndDate(),
                request.getIsAvailable()
            );
            
            int total = roomTypeStatusMapper.countByCondition(
                request.getChainId(),
                request.getHotelId(),
                request.getRoomTypeCode(),
                request.getRateCode(),
                request.getStartDate(),
                request.getEndDate(),
                request.getIsAvailable()
            );
            
            BaseResponse response = BaseResponse.success(roomTypeStatusList);
            log.debug("查询房型库存状态列表响应: {}", gson.toJson(response));
            return response;
            
        } catch (Exception e) {
            log.error("查询房型库存状态列表异常", e);
            return BaseResponse.error("查询房型库存状态列表异常: " + e.getMessage());
        }
    }
    
    @Override
    public BaseResponse getById(String roomtypeStatusId) {
        log.debug("根据ID查询房型库存状态请求: roomtypeStatusId={}", roomtypeStatusId);
        
        try {
            if (!StringUtils.hasText(roomtypeStatusId)) {
                return BaseResponse.error("状态记录ID不能为空");
            }
            
            RoomTypeStatus roomTypeStatus = roomTypeStatusMapper.selectById(roomtypeStatusId);
            
            if (roomTypeStatus == null) {
                return BaseResponse.error("房型库存状态记录不存在");
            }
            
            BaseResponse response = BaseResponse.success(roomTypeStatus);
            log.debug("根据ID查询房型库存状态响应: {}", gson.toJson(response));
            return response;
            
        } catch (Exception e) {
            log.error("根据ID查询房型库存状态异常", e);
            return BaseResponse.error("根据ID查询房型库存状态异常: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public BaseResponse batchAdd(RoomTypeStatusAddRequest request) {
        log.debug("批量添加房型库存状态请求: {}", gson.toJson(request));
        
        try {
            // 参数验证
            if (request == null) {
                return BaseResponse.error("请求参数不能为空");
            }
            
            if (!StringUtils.hasText(request.getChainId())) {
                return BaseResponse.error("连锁ID不能为空");
            }
            
            if (!StringUtils.hasText(request.getHotelId())) {
                return BaseResponse.error("酒店ID不能为空");
            }
            
            // 这里可以实现批量添加逻辑
            // 暂时调用单个添加方法
            return add(request);
            
        } catch (Exception e) {
            log.error("批量添加房型库存状态异常", e);
            return BaseResponse.error("批量添加房型库存状态异常: " + e.getMessage());
        }
    }
} 