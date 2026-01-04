package com.zai.util;

import com.google.gson.JsonObject;
import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Bean;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.io.InterruptedIOException;
import javax.net.ssl.SSLException;
import java.net.UnknownHostException;

@Component
public class MakeRequestor {

    private static final Logger logger = LoggerFactory.getLogger(MakeRequestor.class);

    @Value("${hotelbeds.api.key}")
    private String apiKey;

    @Value("${hotelbeds.api.secret}")
    private String secret;

    @Value("${hotelbeds.api.base-url:https://api.hotelbeds.com/}")
    private String baseUrl;

    @Value("${hotelbeds.supplier.id}")
    private int supplierId;

    @Value("${hotelbeds.account.name:defaultAccount}")
    private String accountName;

    //获取酒店资料 hotel-content-api/1.0/hotels
    //获取酒店价格 hotel-api/1.0/hotels
    //hotel-api/1.0/bookings
    //--------------------------------------------
    //url：https://developer.hotelbeds.com/login/
    //user：zhoujian
    //password：12qw!@QW
    //email：23808611@qq.com
    //--------------------------------------------
    //--------------------------------------------
    //hotelbeds.com
    //user：ZZORA
    //password：Yunling20240101.
    //--------------------------------------------

    private static final String uri = "https://api.hotelbeds.com/";
    //http://m.ctrip.com/restapi/soa2/13353/
    public static final String ACCOUNTNAME_YunLing = "YL";
    public static final String ACCOUNTNAME_HaoYou = "HY";

    //--------------------------------------------------------
    //云翎
    private int supplierID = 15343;//
    private String key = "aca4d9dc837b059f78fd627f9a303d00";
    //test: 5fcb6a796e6e0cdbf9a0bbeed21ed5fb
    //live: aca4d9dc837b059f78fd627f9a303d00
    //test: e6bce11501
    //live: 3bc8daff42
    //--------------------------------------------------------

    //--------------------------------------------------------
    //好有
    //private static final int supplierID = 15343;//
    //private static final String key = "6eff28e78ac9e51552f16fc7d0a8e165";
    //test: 555f189db92e118ce8727306f98873b9
    //live: 6eff28e78ac9e51552f16fc7d0a8e165
    //private static final String secret = "79f8ee530a";
    //test: 8a76f3af95
    //live: 79f8ee530a
    //--------------------------------------------------------

    public JsonObject buildRequestJson() {
        JsonObject requestJson = new JsonObject();
        requestJson.addProperty("apiKey", apiKey);
        requestJson.addProperty("signature", generateSignature());
        return requestJson;
    }

    public String sendGetRequest(JsonObject requestJson, String apiMethod, Map<String, Object> params) throws IOException {
        try {
            // 创建自定义的HttpClient配置
            RequestConfig requestConfig = RequestConfig.custom()
                    .setConnectTimeout(10000)  // 连接超时时间增加到10秒
                    .setSocketTimeout(30000)   // Socket超时时间增加到30秒
                    .setConnectionRequestTimeout(10000)  // 连接请求超时时间增加到10秒
                    .build();

            // 创建HttpClient实例
            CloseableHttpClient httpClient = HttpClients.custom()
                    .setDefaultRequestConfig(requestConfig)
                    .setRetryHandler((exception, executionCount, context) -> {
                        if (executionCount > 3) {  // 最多重试3次
                            return false;
                        }
                        if (exception instanceof InterruptedIOException) {
                            return false;
                        }
                        if (exception instanceof UnknownHostException) {
                            return false;
                        }
                        if (exception instanceof SSLException) {
                            return false;
                        }
                        return true;
                    })
                    .build();

            URIBuilder uriBuilder = new URIBuilder(baseUrl + apiMethod);
            
            if (params != null) {
                Set<String> keys = params.keySet();
                for(String key : keys) {
                    try {
                        Object value = params.get(key);
                        if(value instanceof String) {
                            uriBuilder.addParameter(key, (String)value);
                        } else if(value instanceof List) {
                            List<String> list = (List)value;
                            for(int i = 0; i < list.size(); i++) {
                                uriBuilder.addParameter(key, list.get(i));
                            }
                        }
                    } catch (Exception expparam) {
                        logger.error("Error adding parameter to URI", expparam);
                    }
                }
            }

            logger.debug("Request URL: {}", uriBuilder.build());
            
            HttpGet httpGet = new HttpGet(uriBuilder.build());
            httpGet.setConfig(requestConfig);

            httpGet.setHeader("Api-key", apiKey);
            httpGet.setHeader("secret", secret);
            httpGet.setHeader("X-Signature", getSha256Str(apiKey + secret + (Calendar.getInstance().getTimeInMillis() / 1000)));
            httpGet.setHeader("Accept", "application/json");
            httpGet.setHeader("Accept-Encoding", "gzip");
            httpGet.setHeader("Content-Type", "application/json");

            try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
                HttpEntity responseEntity = response.getEntity();
                return EntityUtils.toString(responseEntity);
            }
        } catch (Exception exception) {
            logger.error("Error sending GET request", exception);
            throw new IOException("Failed to send GET request", exception);
        }
    }

    public String sendPostRequest(JsonObject requestJson, String apiMethod) throws IOException {
        try {
            CloseableHttpClient httpClient = HttpClients.createDefault();
            URIBuilder uriBuilder = new URIBuilder(baseUrl + apiMethod);

            RequestConfig requestConfig = RequestConfig.custom()
                    .setConnectTimeout(5000)
                    .setConnectionRequestTimeout(5000)
                    .setSocketTimeout(60000)
                    .build();

            HttpPost httpPost = new HttpPost(uriBuilder.build());
            httpPost.setConfig(requestConfig);

            httpPost.setHeader("Api-key", apiKey);
            httpPost.setHeader("secret", secret);
            httpPost.setHeader("X-Signature", getSha256Str(apiKey + secret + (Calendar.getInstance().getTimeInMillis() / 1000)));
            httpPost.setHeader("Accept", "application/json");
            httpPost.setHeader("Accept-Encoding", "gzip");
            httpPost.setHeader("Content-Type", "application/json;charset=UTF-8");

            StringEntity entity = new StringEntity(requestJson.toString(), StandardCharsets.UTF_8);
            httpPost.setEntity(entity);

            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                HttpEntity responseEntity = response.getEntity();
                return EntityUtils.toString(responseEntity);
            }
        } catch (Exception exception) {
            logger.error("Error sending POST request", exception);
            throw new IOException("Failed to send POST request", exception);
    }
    }

    public String sendDelRequest(JsonObject requestJson, String apiMethod, Map<String, Object> params) throws IOException {
        try {
            CloseableHttpClient httpClient = HttpClients.createDefault();
            URIBuilder uriBuilder = new URIBuilder(baseUrl + apiMethod);
            
            if (params != null) {
                Set<String> keys = params.keySet();
                for(String key : keys) {
                    try {
                        Object value = params.get(key);
                        if(value instanceof String) {
                            uriBuilder.addParameter(key, (String)value);
                        } else if(value instanceof List) {
                        List<String> list = (List)value;
                            for(int i = 0; i < list.size(); i++) {
                            uriBuilder.addParameter(key, list.get(i));
                            }
                        }
                    } catch (Exception expparam) {
                        logger.error("Error adding parameter to URI", expparam);
                    }
                }
            }

            RequestConfig requestConfig = RequestConfig.custom()
                    .setConnectTimeout(5000)
                    .setConnectionRequestTimeout(5000)
                    .setSocketTimeout(60000)
                    .build();

            HttpDelete httpDel = new HttpDelete(uriBuilder.build());
            httpDel.setConfig(requestConfig);

            httpDel.setHeader("Api-key", apiKey);
            httpDel.setHeader("secret", secret);
            httpDel.setHeader("X-Signature", getSha256Str(apiKey + secret + (Calendar.getInstance().getTimeInMillis() / 1000)));
            httpDel.setHeader("Accept", "application/json");
            httpDel.setHeader("Accept-Encoding", "gzip");
            httpDel.setHeader("Content-Type", "application/json");

            try (CloseableHttpResponse response = httpClient.execute(httpDel)) {
                HttpEntity responseEntity = response.getEntity();
                return EntityUtils.toString(responseEntity);
            }
        } catch (Exception exception) {
            logger.error("Error sending DELETE request", exception);
            throw new IOException("Failed to send DELETE request", exception);
        }
    }

    private String getSha256Str(String str) {
        MessageDigest messageDigest;
        String encodeStr = "";
        try {
            messageDigest = MessageDigest.getInstance("SHA-256");
            messageDigest.update(str.getBytes(StandardCharsets.UTF_8));
            encodeStr = byte2Hex(messageDigest.digest());
        } catch (NoSuchAlgorithmException e) {
            logger.error("Error generating SHA-256 hash", e);
        }
        return encodeStr;
    }

    private String byte2Hex(byte[] bytes) {
        StringBuilder stringBuilder = new StringBuilder();
        String temp;
        for (byte aByte : bytes) {
            temp = Integer.toHexString(aByte & 0xFF);
            if (temp.length() == 1) {
                stringBuilder.append("0");
            }
            stringBuilder.append(temp);
        }
        return stringBuilder.toString();
    }

    private String generateSignature() {
        try {
            String signature = apiKey + secret + System.currentTimeMillis() / 1000;
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(signature.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to generate signature", e);
        }
    }
}
