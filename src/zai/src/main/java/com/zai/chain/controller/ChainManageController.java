package com.zai.chain.controller;

import com.zai.chain.entity.Chain;
import com.zai.chain.service.ChainService;
import com.zai.hotel.entity.Hotel;
import com.zai.hotel.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chain")
public class ChainManageController {
    private static final Logger logger = LoggerFactory.getLogger(ChainManageController.class);

    @Autowired
    private ChainService chainService;

    @Autowired
    private HotelService hotelService;

    @GetMapping("/index")
    public String index() {
        logger.info("Accessing chain management page");
        return "chain/index";
    }

    @GetMapping("/list")
    @ResponseBody
    public ResponseEntity<List<Chain>> getChains(@RequestParam(required = false) String chainName,
                                               @RequestParam(required = false) String contactEmail,
                                               @RequestParam(required = false) String contactPhone,
                                               @RequestParam(required = false) String chainCode,
                                               @RequestParam(required = false) String status) {
        logger.info("Getting chains list with params - chainName: {}, contactEmail: {}, contactPhone: {}, chainCode: {}, status: {}", 
            chainName, contactEmail, contactPhone, chainCode, status);
        try {
            List<Chain> chains = chainService.getChainsByCondition(chainName, 
            contactEmail, contactPhone, chainCode, status);
            logger.info("Retrieved {} chains", chains.size());
            return ResponseEntity.ok(chains);
        } catch (Exception e) {
            logger.error("Error getting chains list", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> addChain(@RequestBody Chain chain) {

        try {
            // 参数校验
            if (chain.getChainCode() == null || chain.getChainCode().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "集团代码不能为空"));
            }
            if (chain.getChainName() == null || chain.getChainName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "集团名称不能为空"));
            }
            if (chain.getContactEmail() == null || chain.getContactEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "联系邮箱不能为空"));
            }
            if (chain.getContactPhone() == null || chain.getContactPhone().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "联系电话不能为空"));
            }

            // 检查集团代码是否已存在
            Chain existingChain = chainService.getChainByCode(chain.getChainCode());
            if (existingChain != null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "集团代码已存在"));
            }

            int result = chainService.addChain(chain);
            logger.info("添加集团结果：{}", result);

            if (result > 0) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "集团添加成功",
                    "data", Map.of("chainId", chain.getChainId())
                ));
            } else {
                return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "集团添加失败"));
            }
        } catch (Exception e) {
            logger.error("添加集团失败", e);
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "message", "系统错误：" + e.getMessage()));
        }
    }

    @DeleteMapping("/{chainId}")
    @ResponseBody
    public ResponseEntity<Boolean> deleteChain(@PathVariable String chainId) {
        logger.info("Deleting chain with chainId: {}", chainId);
        
        if (chainId == null || chainId.trim().isEmpty()) {
            logger.error("Invalid chainId provided");
            return ResponseEntity.badRequest().body(false);
        }
        
        try {
            boolean result = chainService.deleteChain(chainId);
            logger.info("Delete chain result: {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error deleting chain with chainId: " + chainId, e);
            return ResponseEntity.status(500).body(false);
        }
    }

    @PutMapping("/update")
    @ResponseBody
    public ResponseEntity<Integer> updateChain(@RequestBody Chain chain) {
        logger.info("Updating chain: {}", chain);
        try {
            int result = chainService.updateChain(chain);
            logger.info("Update chain result: {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error updating chain", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{chainId}")
    @ResponseBody
    public ResponseEntity<Chain> getChainById(@PathVariable String chainId) {
        logger.info("Getting chain by chainId: {}", chainId);
        try {
            Chain chain = chainService.getChainById(chainId);
            if (chain != null) {
                logger.info("Retrieved chain: {}", chain);
                return ResponseEntity.ok(chain);
            } else {
                logger.info("No chain found with chainId: {}", chainId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error getting chain by chainId: {}", chainId, e);
            return ResponseEntity.status(500).build();
        }
    }


    @GetMapping("/components/selectChainList")
    @ResponseBody
    public ResponseEntity<List<Chain>> getComponentsSelectChainList(@RequestParam(required = false) String chainId,
                                               @RequestParam(required = false) String keyword,
                                               @RequestParam(required = false) String status) {
        logger.info("Getting chains list with params - chainId: {}, keyword: {}, status: {}", 
        chainId, keyword, status);
        try {
            List<Chain> chains = chainService.getComponentsSelectChainList(chainId,  keyword, status);
            logger.info("Retrieved {} chains", chains.size());
            return ResponseEntity.ok(chains);
        } catch (Exception e) {
            logger.error("Error getting chains list", e);
            return ResponseEntity.status(500).build();
        }
    }

    
} 