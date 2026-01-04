package com.zai.api.homeinns.importcsv;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import com.zai.ZaiApplication;



/**
 * src/main/java/com/zai/api/homeinns/importcsv/
├── CsvRecordDTO.java              // 对应 CSV 原始字段
├── BusinessReportEntity.java     // 对应目标数据库表结构
├── CsvToEntityMapper.java        // 字段映射和转换逻辑
├── BusinessReportRepository.java // 使用 JdbcTemplate 写库
├── CsvImportService.java         // 核心服务，读取 CSV -> 映射 -> 批量写入
├── ImportCsvApplicationRunner.java // 程序入口（自动执行导入）
 */

@Service
public class CsvImportService {

    private final BusinessReportRepository repository;

    @Value("${csv.file.path}")
    private String csvFilePath;

    @Value("${csv.file.offset}")
    private int csvFileOffset;

    public CsvImportService(BusinessReportRepository repository) {
        this.repository = repository;
    }

    
    public void run() {
        try (Reader reader = new FileReader(csvFilePath);
             CSVParser parser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(reader)) {
            List<BusinessReportEntity> batch = new ArrayList<>();
            for (CSVRecord record : parser) {
                CsvRecordDTO dto = new CsvRecordDTO();
                dto.setBdate(record.get("bdate"));
                dto.setCdate(record.get("cdate"));
                dto.setHotelid(record.get("hotelid"));
                dto.setClazz(record.get("class"));
                dto.setDescript1(record.get("descript1"));
                dto.setRms_ttl(record.get("rms_ttl"));
                dto.setRms_occ(record.get("rms_occ"));
                dto.setRms_oos(record.get("rms_oos"));
                dto.setRms_ooo(record.get("rms_ooo"));
                dto.setRms_htl(record.get("rms_htl"));
                dto.setRms_avl(record.get("rms_avl"));
                dto.setRms_dus(record.get("rms_dus"));
                dto.setRev_rm(record.get("rev_rm"));
                dto.setRev_fb(record.get("rev_fb"));
                dto.setRev_ot(record.get("rev_ot"));
                dto.setAvg_rt(record.get("avg_rt"));
                dto.setUrc_num(record.get("urc_num"));
                dto.setFbd_num(record.get("fbd_num"));
                dto.setCreatetime(record.get("createtime"));

                BusinessReportEntity entity = CsvToEntityMapper.map(dto);
                if (!repository.exists(entity)) {
                    batch.add(entity);
                    if (batch.size() == csvFileOffset) {
                        repository.batchInsert(batch);
                        batch.clear();
                    }
                }
            }
            if (!batch.isEmpty()) {
                repository.batchInsert(batch);
            }

            System.out.println("CSV 导入完成");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        // 创建Spring Boot应用程序上下文
        ConfigurableApplicationContext context = SpringApplication.run(ZaiApplication.class, args);
            
        // 从上下文中获取服务实例
        CsvImportService service = context.getBean(CsvImportService.class);
        service.run();
    }
}
