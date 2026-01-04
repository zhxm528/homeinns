package com.zai.roomtype.controller;

import com.zai.common.BaseResponse;
import com.zai.roomtype.dto.RoomTypeAddRequest;
import com.zai.roomtype.dto.RoomTypeListRequest;
import com.zai.roomtype.dto.RoomTypeSelectListRequest;
import com.zai.roomtype.dto.RoomTypeWithRateCodesRequest;
import com.zai.roomtype.dto.RoomTypeWithRateCodesResponse;
import com.zai.roomtype.entity.RoomType;
import com.zai.roomtype.service.RoomTypeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roomtype")
public class RoomTypeApiController {
    private static final Logger logger = LoggerFactory.getLogger(RoomTypeApiController.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private RoomTypeService roomTypeService;

    /**
     * 将RoomTypeAddRequest转换为RoomType对象
     * @param request RoomTypeAddRequest对象
     * @return RoomType对象
     */
    private RoomType convertToRoomType(RoomTypeAddRequest request) {
        RoomType roomType = new RoomType();
        roomType.setHotelId(request.getHotelId());
        roomType.setChainId(request.getChainId());
        roomType.setRoomTypeCode(request.getRoomTypeCode());
        roomType.setRoomTypeName(request.getRoomTypeName());
        roomType.setDescription(request.getDescription());
        roomType.setStandardPrice(request.getStandardPrice());
        roomType.setMaxOccupancy(request.getMaxOccupancy());
        roomType.setPhysicalInventory(request.getPhysicalInventory());
        roomType.setStatus(request.getStatus());
        return roomType;
    }

    @PostMapping("/list")
    public BaseResponse<List<RoomType>> list(@RequestBody(required = false) RoomTypeListRequest request) {
        try {
            // 打印请求体
            if (request != null) {
                logger.debug("接收到的请求体: {}", objectMapper.writeValueAsString(request));
            } else {
                logger.debug("请求体为空");
                return BaseResponse.success(new ArrayList<>());
            }

            // 如果hotelId为null，直接返回空列表
            if (request.getHotelId() == null) {
                logger.debug("hotelId为null，返回空列表");
                return BaseResponse.success(new ArrayList<>());
            }

            Map<String, Object> params = new HashMap<>();
            // 使用请求体中的信息
            params.put("roomTypeName", request.getRoomTypeName());
            params.put("roomTypeCode", request.getRoomTypeCode());
            params.put("hotelId", request.getHotelId());
            params.put("chainId", request.getChainId());
            
            // 添加分页信息
            if (request.getPagination() != null) {
                int current = request.getPagination().getCurrent();
                int pageSize = request.getPagination().getPageSize();
                params.put("current", (current - 1) * pageSize); // 转换为offset
                params.put("pageSize", pageSize);
            }

            List<RoomType> roomTypes = roomTypeService.getRoomTypesByCondition(params);
            BaseResponse<List<RoomType>> response = BaseResponse.success(roomTypes);
            logger.debug("返回的消息体: {}", objectMapper.writeValueAsString(response));
            return response;
        } catch (Exception e) {
            logger.error("获取房型列表失败", e);
            return BaseResponse.error("获取房型列表失败");
        }
    }

    @PostMapping("/add")
    @ResponseBody
    public BaseResponse<String> add(@RequestBody RoomTypeAddRequest request) {
        try {
            // 打印请求体
            logger.debug("接收到的请求体: {}", objectMapper.writeValueAsString(request));

            // 验证请求对象
            if (request == null) {
                return BaseResponse.error("请求体不能为空");
            }

            // 验证必填字段
            if (request.getHotelId() == null || request.getHotelId().trim().isEmpty()) {
                return BaseResponse.error("保存失败，请提供酒店ID");
            }
            if (request.getChainId() == null || request.getChainId().trim().isEmpty()) {
                return BaseResponse.error("保存失败，请提供连锁ID");
            }
            if (request.getRoomTypeCode() == null || request.getRoomTypeCode().trim().isEmpty()) {
                return BaseResponse.error("保存失败，请提供房型代码");
            }
            if (request.getRoomTypeName() == null || request.getRoomTypeName().trim().isEmpty()) {
                return BaseResponse.error("保存失败，请提供房型名称");
            }

            // 验证数值类型字段
            if (request.getStandardPrice() != null && request.getStandardPrice().compareTo(BigDecimal.ZERO) < 0) {
                return BaseResponse.error("标准价格不能为负数");
            }
            if (request.getMaxOccupancy() != null && request.getMaxOccupancy() <= 0) {
                return BaseResponse.error("最大入住人数必须大于0");
            }
            if (request.getPhysicalInventory() != null && request.getPhysicalInventory() < 0) {
                return BaseResponse.error("物理库存不能为负数");
            }

            // 转换为RoomType对象
            RoomType roomType = convertToRoomType(request);

            // 记录详细的请求信息
            logger.debug("添加房型请求 - 房型信息: {}", objectMapper.writeValueAsString(roomType));

            // 保存房型
            roomTypeService.addRoomType(roomType);
            
            BaseResponse<String> response = BaseResponse.success("添加房型成功");
            logger.debug("返回的消息体: {}", objectMapper.writeValueAsString(response));
            return response;
        } catch (Exception e) {
            logger.error("添加房型失败", e);
            return BaseResponse.error("添加房型失败: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    @ResponseBody
    public BaseResponse<String> update(@RequestBody RoomType roomType) {
        try {
            roomTypeService.updateRoomType(roomType);
            return BaseResponse.success("更新房型成功");
        } catch (Exception e) {
            logger.error("更新房型失败", e);
            return BaseResponse.error("更新房型失败");
        }
    }

    @DeleteMapping("/{roomTypeId}")
    public BaseResponse<String> delete(@PathVariable String roomTypeId) {
        try {
            roomTypeService.deleteRoomType(roomTypeId);
            return BaseResponse.success("删除房型成功");
        } catch (Exception e) {
            logger.error("删除房型失败", e);
            return BaseResponse.error("删除房型失败");
        }
    }

    @GetMapping("/{roomTypeId}")
    public BaseResponse<RoomType> getById(@PathVariable String roomTypeId) {
        try {
            RoomType roomType = roomTypeService.getRoomTypeById(roomTypeId);
            return BaseResponse.success(roomType);
        } catch (Exception e) {
            logger.error("获取房型详情失败", e);
            return BaseResponse.error("获取房型详情失败");
        }
    }

    @PostMapping("/select/component")
    @ResponseBody
    public BaseResponse<List<RoomType>> selectRoomTypeComponent(@RequestBody RoomTypeSelectListRequest request) {
        try {
            // 打印请求体
            logger.debug("房型组件请求体: {}", objectMapper.writeValueAsString(request));

            // 验证请求对象
            if (request == null) {
                return BaseResponse.error("请求体不能为空");
            }

            // 验证必填字段
            if (request.getHotelId() == null || request.getHotelId().trim().isEmpty()) {
                return BaseResponse.error("酒店ID不能为空");
            }

            // 调用服务层获取房型组件列表
            List<RoomType> roomTypes = roomTypeService.getRoomTypeComponent(request.getHotelId());
            
            // 记录返回结果
            logger.debug("返回房型列表数量: {}", roomTypes.size());
            
            return BaseResponse.success(roomTypes);
        } catch (Exception e) {
            logger.error("获取房型选择列表失败", e);
            return BaseResponse.error("获取房型选择列表失败: " + e.getMessage());
        }
    }

    @PostMapping("/select/byChainAndHotel")
    @ResponseBody
    public BaseResponse<List<RoomType>> selectByChainAndHotel(@RequestBody Map<String, String> request) {
        try {
            // 打印请求体
            logger.debug("根据连锁和酒店查询房型请求体: {}", objectMapper.writeValueAsString(request));

            // 验证请求对象
            if (request == null) {
                return BaseResponse.error("请求体不能为空");
            }

            // 验证必填字段
            String chainId = request.get("chainId");
            String hotelId = request.get("hotelId");
            
            if (chainId == null || chainId.trim().isEmpty()) {
                return BaseResponse.error("连锁ID不能为空");
            }
            
            if (hotelId == null || hotelId.trim().isEmpty()) {
                return BaseResponse.error("酒店ID不能为空");
            }

            // 构建查询参数
            Map<String, Object> params = new HashMap<>();
            params.put("chainId", chainId);
            params.put("hotelId", hotelId);

            // 调用服务层获取房型列表
            List<RoomType> roomTypes = roomTypeService.getRoomTypesByCondition(params);
            
            // 记录返回结果
            logger.debug("返回房型列表数量: {}", roomTypes.size());
            
            return BaseResponse.success(roomTypes);
        } catch (Exception e) {
            logger.error("根据连锁和酒店查询房型失败", e);
            return BaseResponse.error("根据连锁和酒店查询房型失败: " + e.getMessage());
        }
    }

    @PostMapping("/calendar/selectWithRateCodes")
    @ResponseBody
    public BaseResponse<List<RoomTypeWithRateCodesResponse>> getRoomTypesWithRateCodes(
        @RequestBody RoomTypeWithRateCodesRequest request) {
        try {
            // 打印请求体
            logger.debug("获取房型信息及价格代码请求体: {}", objectMapper.writeValueAsString(request));

            // 验证请求对象
            if (request == null) {
                return BaseResponse.error("请求体不能为空");
            }

            // 验证必填字段
            if (request.getChainId() == null || request.getChainId().trim().isEmpty()) {
                return BaseResponse.error("连锁ID不能为空");
            }
            
            if (request.getHotelId() == null || request.getHotelId().trim().isEmpty()) {
                return BaseResponse.error("酒店ID不能为空");
            }

            // 调用服务层获取房型信息及价格代码
            List<RoomTypeWithRateCodesResponse> result = roomTypeService.getRoomTypesWithRateCodes(
                request.getChainId(), 
                request.getHotelId()
            );
            
            // 记录返回结果
            logger.debug("返回房型信息及价格代码数量: {}", result.size());
            
            BaseResponse<List<RoomTypeWithRateCodesResponse>> response = BaseResponse.success(result);
            response.setMessage("获取房型信息成功");
            logger.debug("返回的消息体: {}", objectMapper.writeValueAsString(response));
            
            return response;
        } catch (Exception e) {
            logger.error("获取房型信息及价格代码失败", e);
            return BaseResponse.error("获取房型信息失败: " + e.getMessage());
        }
    }

    


    
} 