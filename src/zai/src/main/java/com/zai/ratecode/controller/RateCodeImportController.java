package com.zai.ratecode.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import com.zai.chain.mapper.ChainMapper;
import com.zai.chain.entity.Chain;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;
import com.zai.common.BaseResponse;
import com.zai.ratecode.entity.RateCode;
import com.zai.ratecode.service.RateCodeService;
import com.zai.hotel.mapper.HotelMapper;
import com.zai.hotel.entity.Hotel;
import com.google.gson.Gson;

@RestController
@RequestMapping("/api/ratecode/import")
public class RateCodeImportController {
    
    private static final Logger logger = LoggerFactory.getLogger(RateCodeImportController.class);
    
    @Autowired
    private ChainMapper chainMapper;
    
    @Autowired
    private RateCodeService rateCodeService;
    
    @Autowired
    private HotelMapper hotelMapper;
    
    private static final Gson gson = new Gson();
    
    @GetMapping("/download/{chainId}")
    public ResponseEntity<byte[]> downloadRateCodeImportTemplate(@PathVariable String chainId) {
        logger.debug("开始下载RateCode导入模板文件 - chainId: {}", chainId);        
        try {
            //根据chainId获取chains表中的chainName
            Chain chain = chainMapper.selectByChainId(chainId);
            if (chain == null) {
                logger.error("未找到对应的连锁酒店信息，chainId: {}", chainId);
                return ResponseEntity.notFound().build();
            }            
            String chainName = chain.getChainName();
            // 读取模板
            ClassPathResource resource = new ClassPathResource("static/download/template/RateCodeImportSimpleTemplate.xlsx");
            if (!resource.exists()) {
                logger.error("模板文件不存在: static/download/template/RateCodeImportSimpleTemplate.xlsx");
                return ResponseEntity.notFound().build();
            }            
            InputStream inputStream = resource.getInputStream();
            Workbook workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();
            inputStream.close();

            String filename = chainName + "_RateCode.xlsx";
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
            logger.error("下载RateCode导入模板文件失败", e);
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * 解析Excel文件并导入价格代码信息
     * @param chainId 连锁酒店ID
     * @param file Excel文件
     * @return 导入结果
     */
    @PostMapping("/parse")
    public ResponseEntity<BaseResponse> parseRateCodeImportExcel(@RequestParam("chainId") String chainId,
                                                           @RequestParam("file") MultipartFile file) {
        logger.debug("开始解析价格代码导入Excel文件 - chainId: {}, 文件名: {}", chainId, file.getOriginalFilename());
        
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
            List<RateCode> rateCodeList = parseExcelToRateCodeList(file, chainId);
            logger.debug("解析Excel成功，共解析 {} 条价格代码数据", rateCodeList.size());
            
            // 批量保存价格代码信息
            List<RateCode> importedRateCodes = new ArrayList<>();
            List<RateCode> duplicateRateCodes = new ArrayList<>();
            List<RateCode> errorRateCodes = new ArrayList<>();
            
            for (RateCode rateCode : rateCodeList) {
                try {
                    int result = rateCodeService.insert(rateCode);
                    if (result > 0) {
                        importedRateCodes.add(rateCode);
                        logger.debug("成功导入价格代码: {}", rateCode.getRateCodeName());
                    } else {
                        duplicateRateCodes.add(rateCode);
                        logger.debug("价格代码已存在，跳过: {}", rateCode.getRateCodeName());
                    }
                } catch (Exception e) {
                    errorRateCodes.add(rateCode);
                    logger.error("导入价格代码失败: {}, 错误: {}", rateCode.getRateCodeName(), e.getMessage());
                }
            }
            
            // 构建响应消息
            String message = String.format("导入完成 - 成功: %d, 重复: %d, 失败: %d", 
                importedRateCodes.size(), duplicateRateCodes.size(), errorRateCodes.size());
            
            BaseResponse successResponse = new BaseResponse<>(true, message, null);
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
     * 解析Excel文件为价格代码列表
     * @param file Excel文件
     * @param chainId 连锁酒店ID
     * @return 价格代码列表
     */
    private List<RateCode> parseExcelToRateCodeList(MultipartFile file, String chainId) throws Exception {
        List<RateCode> rateCodeList = new ArrayList<>();
        
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
                    RateCode rateCode = parseRowToRateCode(row, chainId);
                    if (rateCode != null) {
                        rateCodeList.add(rateCode);
                        logger.debug("成功解析行数据，行号：{}，价格代码名称：{}", rowIndex + 1, rateCode.getRateCodeName());
                    } else {
                        logger.debug("解析行数据返回null，行号：{}", rowIndex + 1);
                    }
                } catch (Exception e) {
                    logger.error("解析行数据时发生异常，行号：{}", rowIndex + 1, e);
                }
            }
        }
        
        return rateCodeList;
    }
    
    /**
     * 解析Excel行数据为RateCode对象
     * @param row Excel行
     * @param chainId 连锁酒店ID
     * @return RateCode对象
     */
    private RateCode parseRowToRateCode(Row row, String chainId) {
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
            
            // C列：rateCodeCode
            String rateCodeCode = getCellValueAsString(row.getCell(2));
            if (rateCodeCode == null || rateCodeCode.trim().isEmpty()) {
                logger.warn("价格代码为空，跳过行: {}", row.getRowNum() + 1);
                return null;
            }
            
            // D列：rateCodeName
            String rateCodeName = getCellValueAsString(row.getCell(3));
            if (rateCodeName == null || rateCodeName.trim().isEmpty()) {
                logger.warn("价格代码名称为空，跳过行: {}", row.getRowNum() + 1);
                return null;
            }
            
            // 验证酒店是否存在且只有一条记录
            Hotel hotel = hotelMapper.selectByChainIdAndHotelCode(chainId, hotelCode.trim());
            if (hotel == null) {
                logger.warn("酒店不存在，跳过行: {}，chainId: {}, hotelCode: {}", row.getRowNum() + 1, chainId, hotelCode);
                return null;
            }
            
            // 创建RateCode对象
            RateCode rateCode = new RateCode();
            rateCode.setRateCodeId(UUID.randomUUID().toString());
            rateCode.setChainId(chainId);
            rateCode.setHotelId(hotel.getHotelId());
            rateCode.setHotelName(hotel.getHotelName());
            rateCode.setRateCode(rateCodeCode.trim());
            rateCode.setRateCodeName(rateCodeName.trim());
            rateCode.setDescription(rateCodeName.trim()); // 使用价格代码名称作为描述
            rateCode.setStatus(1); // 默认状态为启用
            
            return rateCode;
            
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