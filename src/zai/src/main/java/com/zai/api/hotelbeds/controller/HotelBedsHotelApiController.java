package com.zai.api.hotelbeds.controller;

import com.zai.api.hotelbeds.entity.hotel.HotelApiResponse;
import com.zai.api.hotelbeds.service.hotel.HotelApiService;
import com.zai.api.hotelbeds.service.HotelBedsHotelApiService;
import com.zai.api.hotelbeds.dto.HotelAvailabilityRequest;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.zai.api.hotelbeds.dto.CheckHotelAvailabilityResponse;
import com.zai.common.BaseResponse;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import com.google.gson.JsonElement;

@RestController
@RequestMapping("/api/hotelbeds/hotel")
public class HotelBedsHotelApiController {
    private static final Logger logger = LoggerFactory.getLogger(HotelBedsHotelApiController.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();
    @Autowired
    private HotelApiService hotelApiService;
    
    @Autowired
    private HotelBedsHotelApiService hotelBedsHotelApiService;

    @PostMapping("/details")
    public List<HotelApiResponse> getHotelDetails(@RequestBody String jsonCodes) {
        try {
            // 解析JSON数组并提取id字段
            JsonArray hotelCodes = new JsonArray();
            JsonArray inputArray = JsonParser.parseString(jsonCodes).getAsJsonArray();
            
            for (int i = 0; i < inputArray.size(); i++) {
                JsonObject hotelObj = inputArray.get(i).getAsJsonObject();
                hotelCodes.add(hotelObj.get("id").getAsString());
            }
            
            // 构建请求体
            JsonObject requestBody = new JsonObject();
            requestBody.add("hotelCodes", hotelCodes);
            
            return hotelApiService.getApiResponse(requestBody.toString());
        } catch (Exception e) {
            logger.error("获取酒店详情失败: {}", e.getMessage(), e);
            throw new RuntimeException("获取酒店详情失败: " + e.getMessage());
        }
    }

    /**
     * 初始化所有酒店信息
     * 
     * @param requestBody 包含酒店代码的JSON请求体
     * @return 初始化结果（JSON格式字符串）
     */
    @PostMapping("/initAllHotels")
    public String initAllHotels(@RequestBody String requestBody) {
        try {
            // 1. 解析请求体中的酒店代码
            JsonObject jsonRequest = JsonParser.parseString(requestBody).getAsJsonObject();
            JsonArray hotelCodes = jsonRequest.getAsJsonArray("hotelCodes");
            
            // 2. 调用服务初始化酒店信息
            JsonObject result = hotelBedsHotelApiService.initAllHotels(hotelCodes);
            //打印result
            System.out.println(result);
            
            // 3. 构建响应体
            JsonObject resultResponse = new JsonObject();
            JsonArray resultsArray = new JsonArray();
            
            // 4. 添加结果到数组
            
            resultsArray.add(result);
            resultResponse.add("results", resultsArray);
            
            return resultResponse.toString();
        } catch (Exception e) {
            e.printStackTrace();    
            // 构建错误响应
            JsonObject resultResponse = new JsonObject();
            JsonArray resultsArray = new JsonArray();
            
            JsonObject result = new JsonObject();
            result.addProperty("timestamp", java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            
            
            resultsArray.add(result);
            resultResponse.add("results", resultsArray);
            
            return resultResponse.toString();
        }
    }

    /**
     * 查询酒店可用性
     * 
     * @param request 酒店可用性查询请求
     * @return 查询结果（JSON格式字符串）
     */
    @PostMapping("/availability")
    @ResponseBody
    public BaseResponse<List<CheckHotelAvailabilityResponse>> getHotelAvailability(
        @RequestBody HotelAvailabilityRequest request) {
        try {
            // 1. 参数验证
            if (request == null) {
                throw new IllegalArgumentException("请求参数不能为空");
            }
            
            if (request.getHotels() == null || request.getHotels().isEmpty()) {
                throw new IllegalArgumentException("酒店ID数组不能为空");
            }
            
            if (request.getCheckDate() == null || request.getCheckDate().trim().isEmpty()) {
                throw new IllegalArgumentException("查询日期不能为空");
            }
            
            // 2. 验证日期格式
            try {
                java.time.LocalDate.parse(request.getCheckDate(), java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } catch (Exception e) {
                throw new IllegalArgumentException("日期格式错误，请使用yyyy-MM-dd格式");
            }
            
            // 3. 调用服务查询酒店可用性
            List<CheckHotelAvailabilityResponse> result = hotelBedsHotelApiService.getHotelAvailability(request.getHotels(), request.getCheckDate());
            BaseResponse<List<CheckHotelAvailabilityResponse>> response = BaseResponse.success(result);
            //打印json格式的返回
            logger.debug("返回的消息体: {}", objectMapper.writeValueAsString(response));
            response.setMessage("检查价格成功");
            
            
            return response;
        } catch (Exception e) {
            
        }
        return null;
    }

    /**
     * 导出酒店可用性数据到Excel
     * 
     * @param requestBody 前端发送的原始请求体
     * @return Excel文件流
     */
    @PostMapping("/export/excel")
    public ResponseEntity<byte[]> exportToExcel(@RequestBody String requestBody) {
        logger.debug("开始执行exportToExcel方法，接收到的原始请求体: {}", requestBody);
        try {
            // 1. 解析请求体
            logger.debug("开始解析请求体");
            List<CheckHotelAvailabilityResponse> tableData = parseRequestData(requestBody);
            logger.debug("请求体解析完成，数据条数: {}", tableData != null ? tableData.size() : "null");
            
            // 2. 参数验证
            logger.debug("开始参数验证");
            if (tableData == null || tableData.isEmpty()) {
                logger.debug("参数验证失败：表格数据为空");
                throw new IllegalArgumentException("表格数据不能为空");
            }
            logger.debug("参数验证通过，数据条数: {}", tableData.size());
            
            // 3. 创建工作簿和工作表
            logger.debug("开始创建工作簿和工作表");
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("酒店可用性数据");
            logger.debug("工作簿和工作表创建完成");
            
            // 4. 创建标题行样式
            logger.debug("开始创建标题行样式");
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            logger.debug("标题行样式创建完成");
            
            // 5. 创建数据行样式
            logger.debug("开始创建数据行样式");
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setAlignment(HorizontalAlignment.LEFT);
            dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            logger.debug("数据行样式创建完成");
            
            // 6. 设置列标题
            logger.debug("开始设置列标题");
            String[] headers = {"酒店编号", "酒店名称", "地址", "房型数量", "房型代码", "价格", "检查日期", "价格代码", "库存", "状态"};
            Row headerRow = sheet.createRow(0);
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            logger.debug("列标题设置完成，共{}列", headers.length);
            
            // 7. 填充数据
            logger.debug("开始填充数据，共{}条记录", tableData.size());
            int rowNum = 1;
            for (CheckHotelAvailabilityResponse data : tableData) {
                logger.debug("正在处理第{}行数据，酒店代码: {}", rowNum, data.getHotelCode());
                Row row = sheet.createRow(rowNum++);
                
                // 酒店编号
                Cell cell0 = row.createCell(0);
                cell0.setCellValue(data.getHotelCode() != null ? data.getHotelCode() : "");
                cell0.setCellStyle(dataStyle);
                
                // 酒店名称
                Cell cell1 = row.createCell(1);
                cell1.setCellValue(data.getHotelName() != null ? data.getHotelName() : "");
                cell1.setCellStyle(dataStyle);
                
                // 地址
                Cell cell2 = row.createCell(2);
                cell2.setCellValue(data.getAddress() != null ? data.getAddress() : "");
                cell2.setCellStyle(dataStyle);
                
                // 房型数量
                Cell cell3 = row.createCell(3);
                cell3.setCellValue(data.getRoomTypeNum() != null ? data.getRoomTypeNum() : 0);
                cell3.setCellStyle(dataStyle);
                
                // 房型代码
                Cell cell4 = row.createCell(4);
                cell4.setCellValue(data.getRoomTypeCodes() != null ? data.getRoomTypeCodes() : "");
                cell4.setCellStyle(dataStyle);
                
                // 价格
                Cell cell5 = row.createCell(5);
                cell5.setCellValue(data.getPrice() != null ? data.getPrice() : "");
                cell5.setCellStyle(dataStyle);
                
                // 检查日期
                Cell cell6 = row.createCell(6);
                cell6.setCellValue(data.getCheckDate() != null ? data.getCheckDate() : "");
                cell6.setCellStyle(dataStyle);
                
                // 价格代码
                Cell cell7 = row.createCell(7);
                cell7.setCellValue(data.getRateCode() != null ? data.getRateCode() : "");
                cell7.setCellStyle(dataStyle);
                
                // 库存
                Cell cell8 = row.createCell(8);
                cell8.setCellValue(data.getInventory() != null ? data.getInventory() : "");
                cell8.setCellStyle(dataStyle);
                
                // 状态
                Cell cell9 = row.createCell(9);
                cell9.setCellValue(data.getStatus() != null ? data.getStatus() : "");
                cell9.setCellStyle(dataStyle);
            }
            logger.debug("数据填充完成，共处理{}行数据", tableData.size());
            
            // 8. 自动调整列宽
            logger.debug("开始自动调整列宽");
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                // 设置最小列宽
                int currentWidth = sheet.getColumnWidth(i);
                if (currentWidth < 3000) {
                    sheet.setColumnWidth(i, 3000);
                }
            }
            logger.debug("列宽调整完成，共{}列", headers.length);
            
            // 9. 生成Excel文件
            logger.debug("开始生成Excel文件");
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();
            logger.debug("Excel文件生成完成，文件大小: {} bytes", outputStream.size());
            
            // 10. 设置响应头
            logger.debug("开始设置响应头");
            String fileName = "酒店可用性数据_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            String encodedFileName = java.net.URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
            logger.debug("生成文件名: {}", fileName);
            
            HttpHeaders headers_response = new HttpHeaders();
            headers_response.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers_response.setContentDispositionFormData("attachment", encodedFileName);
            headers_response.setContentLength(outputStream.size());
            logger.debug("响应头设置完成");
            
            logger.debug("成功导出Excel文件: {}, 数据行数: {}", fileName, tableData.size());
            
            logger.debug("准备返回响应");
            return ResponseEntity.ok()
                .headers(headers_response)
                .body(outputStream.toByteArray());
                
        } catch (Exception e) {
            logger.error("导出Excel失败: {}", e.getMessage(), e);
            logger.debug("异常堆栈信息: ", e);
            throw new RuntimeException("导出Excel失败: " + e.getMessage());
        }
    }

    /**
     * 解析前端发送的请求数据
     * 支持多种格式：
     * 1. JSON数组格式: [{"hotelCode":"xxx",...}, ...]
     * 2. 包装对象格式: {"data":[{"hotelCode":"xxx",...}, ...]}
     * 3. 单个对象格式: {"hotelCode":"xxx",...}
     * 
     * @param requestBody 原始请求体字符串
     * @return 解析后的数据列表
     */
    private List<CheckHotelAvailabilityResponse> parseRequestData(String requestBody) {
        logger.debug("开始解析请求数据，原始数据: {}", requestBody);
        try {
            if (requestBody == null || requestBody.trim().isEmpty()) {
                logger.debug("请求体为空");
                return null;
            }
            
            // 解析JSON
            JsonElement jsonElement = JsonParser.parseString(requestBody);
            
            if (jsonElement.isJsonArray()) {
                // 格式1: JSON数组
                logger.debug("检测到JSON数组格式");
                JsonArray jsonArray = jsonElement.getAsJsonArray();
                List<CheckHotelAvailabilityResponse> result = new ArrayList<>();
                
                for (JsonElement element : jsonArray) {
                    CheckHotelAvailabilityResponse item = objectMapper.readValue(
                        element.toString(), CheckHotelAvailabilityResponse.class);
                    result.add(item);
                }
                
                logger.debug("JSON数组解析完成，共{}条数据", result.size());
                return result;
                
            } else if (jsonElement.isJsonObject()) {
                // 格式2或3: JSON对象
                JsonObject jsonObject = jsonElement.getAsJsonObject();
                
                if (jsonObject.has("data") && jsonObject.get("data").isJsonArray()) {
                    // 格式2: 包装对象格式 {"data":[...]}
                    logger.debug("检测到包装对象格式");
                    JsonArray dataArray = jsonObject.getAsJsonArray("data");
                    List<CheckHotelAvailabilityResponse> result = new ArrayList<>();
                    
                    for (JsonElement element : dataArray) {
                        CheckHotelAvailabilityResponse item = objectMapper.readValue(
                            element.toString(), CheckHotelAvailabilityResponse.class);
                        result.add(item);
                    }
                    
                    logger.debug("包装对象格式解析完成，共{}条数据", result.size());
                    return result;
                    
                } else {
                    // 格式3: 单个对象格式
                    logger.debug("检测到单个对象格式");
                    CheckHotelAvailabilityResponse item = objectMapper.readValue(
                        requestBody, CheckHotelAvailabilityResponse.class);
                    List<CheckHotelAvailabilityResponse> result = new ArrayList<>();
                    result.add(item);
                    
                    logger.debug("单个对象格式解析完成，共1条数据");
                    return result;
                }
            } else {
                logger.debug("未知的JSON格式");
                throw new IllegalArgumentException("不支持的JSON格式");
            }
            
        } catch (Exception e) {
            logger.error("解析请求数据失败: {}", e.getMessage(), e);
            throw new RuntimeException("解析请求数据失败: " + e.getMessage());
        }
    }

    
    
} 