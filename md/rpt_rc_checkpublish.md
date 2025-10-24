#检查RateCode是否发布
##核心功能
- 在app/目录下创建report/ratecode/checkpublish子目录
- 在app/report/ratecode/checkpublish/目录下创建默认首页page.tsx
- 在产品中心页面 app/product/page.tsx 中的 "检查RateCode是否发布" 路由到 app/report/ratecode/checkpublish/目录下 page.tsx 页面
- 页面标题: 检查RateCode是否发布
- 页面内容: 调用后端API，显示返回结果
##后端程序
- 创建后端API 文件 app/api/report/ratecode/checkpublish/route.ts
- 在app/api/report/ratecode/checkpublish/route.ts文件中，调用数据库查询功能
##页面展示内容
- 页面内容用表格形式展示，不需要分页，第一行和第一列需要锁定；
- 列名：酒店编号、酒店名称、酒店类型、PMS类型、发布渠道、房价码数量
- 表格上方为查询条件：
 - 指定日期查询日期 格式为yyyy-mm-dd，默认为当天
 - 房价码列表 格式为逗号隔开的字符串，默认为空
 - 发布渠道列表 发布渠道列表 下拉框 单选，默认为空
 - 管理公司列表 管理公司列表 格式为逗号隔开的字符串，默认为空
 - 酒店PMS类型 下拉框 多选
 - 酒店产权类型 下拉框 多选
 - 状态列表 状态列表 格式为枚举值 1或0，默认为1
 - 是否删除列表 是否删除列表 格式为枚举值 1或0，默认为0
- 点击房价码数量弹出窗口显示具体房价码代码和房价码名称
- 渠道的枚举为
```
 - CTP 携程
 - MDI 美团
 - OBR 飞猪
 - CTM 商旅
 - WEB 官渠
 ```

- PropertyType 产权类型的枚举
```
BZ 北展
FCQD 非产权店
SJJT 首酒集团
SLJT 首旅集团
SLZY 首旅置业
```

- PMSType PMS类型的枚举
```
Cambridge 康桥
Opera 手工填报
P3 如家P3
Soft 软连接
X6 西软X6
XMS 西软XMS
```
- 页面右上角和右下角添加 返回 按钮 支持返回到 app/product/page.tsx 页面

##数据库查询功能
- 查询SQL语句：
```
DECLARE @Today DATE = CAST(GETDATE() AS DATE);

WITH RatePublish AS (
    SELECT
        h.hotelCode,
        h.hotelName,
        p.ChannelCode,
        r.rateCode,
        r.rateCodeName,
        r.beginDate AS 房价码开始日期,
        r.endDate AS 房价码结束日期,
        p.beginDate AS 发布开始日期,
        p.endDate AS 发布结束日期,
        h.PMSType,
        h.PropertyType,
        h.status,
        h.isDelete
    FROM [CrsStar].dbo.StarHotelBaseInfo AS h
    INNER JOIN [CrsStar].dbo.StarRateCodeInfo AS r
        ON h.hotelCode = r.hotelCode
        AND r.isDelete = 0
        AND r.beginDate <= @Today
        AND r.endDate >= @Today
        AND r.rateCode IN ('TTCOR1','TTCOB1') 
    INNER JOIN [CrsStar].dbo.StarPublishRateCodeInfo AS p
        ON r.rateCode = p.rateCode
        AND r.hotelCode = p.hotelCode
        AND p.beginDate <= @Today
        AND p.endDate >= @Today
        AND p.ChannelCode IN ('OBR') 
    WHERE 
        h.GroupCode IN ('JG','JL','NY','NH','NI','KP','NU')
        AND h.Status = 1
        AND h.IsDelete = 0
)

SELECT
    rp.hotelCode AS 酒店编码,
    MAX(rp.hotelName) AS 酒店名称,
    rp.ChannelCode AS 发布渠道,
    COUNT(DISTINCT rp.rateCode) AS 房价码发布数量,
    STUFF((
        SELECT DISTINCT ',' + r2.rateCode+' '+ r2.rateCodeName
        FROM RatePublish AS r2
        WHERE r2.hotelCode = rp.hotelCode
          AND r2.ChannelCode = rp.ChannelCode
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS 房价码明细列表
FROM RatePublish AS rp
GROUP BY rp.hotelCode, rp.ChannelCode
ORDER BY rp.hotelCode, rp.ChannelCode;
```
- 查询参数：
 - 指定日期查询日期 @Today 格式为yyyy-mm-dd
 - 房价码列表 rateCode 格式为逗号隔开的字符串，例如 TTCOR1,TTCOB1
 - 发布渠道列表 ChannelCode 格式为逗号隔开的字符串，例如 OBR
 - 管理公司列表 GroupCode 格式为逗号隔开的字符串，例如 JG,JL,NY,NH,NI,KP
 - 状态列表 Status 格式为枚举值 1或0
 - 是否删除列表 IsDelete 格式为枚举值 1或0
- 查询参数来自于前端页面传入参数，如果为空或null表示查询所有记录

