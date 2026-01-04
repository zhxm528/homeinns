package com.zai.hotel.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import com.zai.config.PoiSecurityConfig;
import com.zai.hotel.dto.HotelImportSampleTemplateDTO;
import com.zai.hotel.dto.HotelImportTemplateResponseDTO;
import com.zai.hotel.dto.HotelImportRequestDTO;
import com.zai.hotel.dto.HotelImportResultDTO;
import com.zai.hotel.dto.RoomTypeImportResultDTO;
import com.zai.hotel.entity.Hotel;
import com.zai.hotel.service.HotelService;
import com.zai.roomtype.entity.RoomType;
import com.zai.roomtype.service.RoomTypeService;
import com.zai.common.BaseResponse;
import com.google.gson.Gson;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import com.zai.chain.entity.Chain;
import com.zai.chain.mapper.ChainMapper;
import java.util.Base64;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/hotel/import")
public class HotelImportController {
    private static final Logger logger = LoggerFactory.getLogger(HotelImportController.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Gson gson = new Gson();

    @Autowired
    private PoiSecurityConfig poiSecurityConfig;

    @Autowired
    private ChainMapper chainMapper;

    @Autowired
    private HotelService hotelService;
    
    @Autowired
    private RoomTypeService roomTypeService;

    
    
    /**
     * 下载酒店导入模板文件
     * @param chainId 连锁酒店ID
     * @return Excel文件
     */
    @GetMapping("/download/{chainId}")
    public ResponseEntity<byte[]> downloadHotelImportTemplate(@PathVariable String chainId) {
        logger.debug("开始下载酒店导入模板文件 - chainId: {}", chainId);
        
        try {
            //根据chainId获取chains表中的chainName
            Chain chain = chainMapper.selectByChainId(chainId);
            if (chain == null) {
                logger.error("未找到对应的连锁酒店信息，chainId: {}", chainId);
                return ResponseEntity.notFound().build();
            }
            
            String chainName = chain.getChainName();

            // 读取模板
            ClassPathResource resource = new ClassPathResource("static/download/template/HotelImportSimpleTemplate.xlsx");
            if (!resource.exists()) {
                logger.error("模板文件不存在: static/download/template/HotelImportSimpleTemplate.xlsx");
                return ResponseEntity.notFound().build();
            }
            
            InputStream inputStream = resource.getInputStream();
            Workbook workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0);

            // 锁定第一行
            Row firstRow = sheet.getRow(0);
            if (firstRow != null) {
                for (Cell cell : firstRow) {
                    CellStyle style = workbook.createCellStyle();
                    style.cloneStyleFrom(cell.getCellStyle());
                    style.setLocked(true);
                    cell.setCellStyle(style);
                }
            }

            // 放开其他所有行，设置为可编辑
            int lastRowNum = sheet.getLastRowNum();
            for (int rowIndex = 1; rowIndex <= lastRowNum; rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row != null) {
                    for (Cell cell : row) {
                        CellStyle style = workbook.createCellStyle();
                        style.cloneStyleFrom(cell.getCellStyle());
                        style.setLocked(false); // 设置为可编辑
                        cell.setCellStyle(style);
                    }
                }
            }
            
            // 锁定sheet
            sheet.protectSheet("123456");

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();
            inputStream.close();

            String filename = chainName + "_酒店列表.xlsx";
            logger.debug("生成Excel成功 - 文件名: {} 文件大小: {} bytes", filename, outputStream.size());
            
            String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", encodedFilename);
            headers.setContentLength(outputStream.size());
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(outputStream.toByteArray());
                
        } catch (Exception e) {
            logger.error("下载酒店导入模板文件失败", e);
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * 解析Excel文件并导入房型信息
     * @param chainId 连锁酒店ID
     * @param file Excel文件
     * @return 导入结果
     */
    @PostMapping("/parse")
    public ResponseEntity<BaseResponse> parseHotelImportExcel(@RequestParam("chainId") String chainId,
                                                           @RequestParam("file") MultipartFile file) {
        logger.debug("开始解析房型导入Excel文件 - chainId: {}, 文件名: {}", chainId, file.getOriginalFilename());
        
        try {
            // 验证文件
            if (file.isEmpty()) {
                BaseResponse errorResponse = BaseResponse.error("上传的文件不能为空");
                logger.debug("响应体: {}", gson.toJson(errorResponse));
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            String fileName = file.getOriginalFilename();
            if (fileName == null || !fileName.toLowerCase().endsWith(".xlsx")) {
                BaseResponse errorResponse = BaseResponse.error("请上传Excel文件(.xlsx格式)");
                logger.debug("响应体: {}", gson.toJson(errorResponse));
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // 验证chainId
            Chain chain = chainMapper.selectByChainId(chainId);
            if (chain == null) {
                BaseResponse errorResponse = BaseResponse.error("未找到对应的连锁酒店信息");
                logger.debug("响应体: {}", gson.toJson(errorResponse));
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // 解析Excel文件
            List<RoomType> roomTypeList = parseExcelToRoomTypeList(file, chainId);
            logger.debug("解析Excel成功，共解析 {} 条房型数据", roomTypeList.size());
            
            // 批量保存房型信息
            List<RoomType> importedRoomTypes = new ArrayList<>();
            List<RoomType> duplicateRoomTypes = new ArrayList<>();
            List<RoomType> errorRoomTypes = new ArrayList<>();
            
            for (RoomType roomType : roomTypeList) {
                try {
                    int result = roomTypeService.addRoomType(roomType);
                    if (result > 0) {
                        importedRoomTypes.add(roomType);
                        logger.debug("成功导入房型: {}", roomType.getRoomTypeName());
                    } else {
                        duplicateRoomTypes.add(roomType);
                        logger.debug("房型已存在，跳过: {}", roomType.getRoomTypeName());
                    }
                } catch (Exception e) {
                    errorRoomTypes.add(roomType);
                    logger.error("导入房型失败: {}, 错误: {}", roomType.getRoomTypeName(), e.getMessage());
                }
            }
            
            // 构建响应数据
            RoomTypeImportResultDTO importResult = new RoomTypeImportResultDTO();
            importResult.setImportedRoomTypes(importedRoomTypes);
            importResult.setDuplicateRoomTypes(duplicateRoomTypes);
            importResult.setErrorRoomTypes(errorRoomTypes);
            importResult.setTotalCount(roomTypeList.size());
            importResult.setImportedCount(importedRoomTypes.size());
            importResult.setDuplicateCount(duplicateRoomTypes.size());
            importResult.setErrorCount(errorRoomTypes.size());
            
            // 构建响应消息
            String message = String.format("导入完成 - 成功: %d, 重复: %d, 失败: %d", 
                importedRoomTypes.size(), duplicateRoomTypes.size(), errorRoomTypes.size());
            
            BaseResponse successResponse = new BaseResponse<>(true, message, importResult);
            logger.debug("响应体: {}", gson.toJson(successResponse));
            return ResponseEntity.ok(successResponse);
            
        } catch (Exception e) {
            logger.error("解析Excel文件失败", e);
            BaseResponse errorResponse = BaseResponse.error("解析Excel文件失败: " + e.getMessage());
            logger.debug("响应体: {}", gson.toJson(errorResponse));
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * 解析Excel文件为房型列表
     * @param file Excel文件
     * @param chainId 连锁酒店ID
     * @return 房型列表
     */
    private List<RoomType> parseExcelToRoomTypeList(MultipartFile file, String chainId) throws Exception {
        List<RoomType> roomTypeList = new ArrayList<>();
        
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            int lastRowNum = sheet.getLastRowNum();
            
            // 从第二行开始读取数据（第一行是表头）
            for (int rowIndex = 1; rowIndex <= lastRowNum; rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) {
                    logger.debug("跳过空行，行号：{}", rowIndex + 1);
                    continue;
                }
                
                // 检查行是否为空
                if (isEmptyRow(row)) {
                    logger.debug("跳过空行（A列无酒店代码），行号：{}", rowIndex + 1);
                    continue;
                }
                
                try {
                    RoomType roomType = parseRowToRoomType(row, chainId);
                    if (roomType != null) {
                        roomTypeList.add(roomType);
                        logger.debug("成功解析行数据，行号：{}，房型名称：{}", rowIndex + 1, roomType.getRoomTypeName());
                    } else {
                        logger.debug("解析行数据返回null，行号：{}", rowIndex + 1);
                    }
                } catch (Exception e) {
                    logger.error("解析行数据时发生异常，行号：{}", rowIndex + 1, e);
                }
            }
        }
        
        return roomTypeList;
    }
    
    /**
     * 解析Excel行数据为RoomType对象
     * @param row Excel行
     * @param chainId 连锁酒店ID
     * @return RoomType对象
     */
    private RoomType parseRowToRoomType(Row row, String chainId) {
        try {
            // A列：hotelCode
            String hotelCode = getCellValueAsString(row.getCell(0));
            if (hotelCode == null || hotelCode.trim().isEmpty()) {
                logger.warn("酒店代码为空，跳过行: {}", row.getRowNum() + 1);
                return null;
            }
            
            // B列：hotelName
            String hotelName = getCellValueAsString(row.getCell(1));
            if (hotelName == null || hotelName.trim().isEmpty()) {
                logger.warn("酒店名称为空，跳过行: {}", row.getRowNum() + 1);
                return null;
            }
            
            // C列：roomTypeCode
            String roomTypeCode = getCellValueAsString(row.getCell(2));
            if (roomTypeCode == null || roomTypeCode.trim().isEmpty()) {
                logger.warn("房型代码为空，跳过行: {}", row.getRowNum() + 1);
                return null;
            }
            
            // D列：roomTypeName
            String roomTypeName = getCellValueAsString(row.getCell(3));
            if (roomTypeName == null || roomTypeName.trim().isEmpty()) {
                logger.warn("房型名称为空，跳过行: {}", row.getRowNum() + 1);
                return null;
            }
            
            // 验证酒店是否存在且只有一条记录
            Hotel hotel = hotelService.getHotelByChainIdAndHotelCode(chainId, hotelCode.trim());
            if (hotel == null) {
                logger.warn("酒店不存在，跳过行: {}，chainId: {}, hotelCode: {}", row.getRowNum() + 1, chainId, hotelCode);
                return null;
            }
            
            // 创建RoomType对象
            RoomType roomType = new RoomType();
            roomType.setRoomTypeId(UUID.randomUUID().toString());
            roomType.setChainId(chainId);
            roomType.setHotelId(hotel.getHotelId());
            roomType.setHotelName(hotelName.trim());
            roomType.setRoomTypeCode(roomTypeCode.trim());
            roomType.setRoomTypeName(roomTypeName.trim());
            roomType.setDescription(roomTypeName.trim()); // 使用房型名称作为描述
            roomType.setMaxOccupancy(2); // 默认最大入住人数为2
            roomType.setPhysicalInventory(999); // 默认物理库存为999
            roomType.setStatus(1); // 默认状态为启用
            
            return roomType;
            
        } catch (Exception e) {
            logger.error("解析行数据失败，行号：{}", row.getRowNum() + 1, e);
            return null;
        }
    }
    
    /**
     * 获取单元格值作为字符串
     * @param cell 单元格
     * @return 字符串值
     */
    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return null;
        }
    }
    
    /**
     * 检查行是否为空
     * @param row Excel行
     * @return 是否为空
     */
    private boolean isEmptyRow(Row row) {
        if (row == null) {
            return true;
        }
        
        Cell firstCell = row.getCell(0);
        return firstCell == null || getCellValueAsString(firstCell) == null || 
               getCellValueAsString(firstCell).trim().isEmpty();
    }
}
