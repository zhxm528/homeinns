# mappingInfoSet

## 基本信息

- **面板**：携程接口
- **菜单**：mappingInfoSet
- **前端页面**：`src/app/product/ctrip/mappingInfoSet/page.tsx`
- **后端接口**：`src/app/api/product/ctrip/mappingInfoSet/route.ts`
- 如果前端页面文件或后端接口文件不存在，则需要创建。

## 功能说明

用于查看携程 mappingInfoSet 接口的调用与返回结果。该接口主要用于设置您的酒店/房型与携程酒店/房型之间的映射关系。

## 授权验证

所有请求到携程的接口均需要提前申请用户名和密码，并且需要权限认证。

## 权限认证说明

权限认证信息需要按照如下要求放在 HTTP Header 中：

| 字段名 | 定义 | 类型 | 示例 |
|--------|------|------|------|
| Code | 对接方Trip编号 | integer | 134 |
| Authorization | 用户名:密码，用冒号拼接，并用 SHA-256 进行加密，密文小写 | string | 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e7 |

## 接口实现

### 1. 自助匹配携程母房型内容设置接口

**接口路径**：`/static/v2/json/mappingInfoSet`

**接口说明**：该接口主要用于设置您的酒店/房型与携程酒店/房型之间的映射关系。

#### 接口调用信息

- **请求方法**：POST
- **接口方法名**：mappingInfoSetRQ/RS
- **接口调用方**：合作伙伴
- **接口响应方**：Trip.com

#### Endpoint URLs

- **测试环境**：`https://gateway.fat.ctripqa.com/static/v2/json/mappingInfoSet`
- **生产环境**：`https://receive-vendor-hotel.ctrip.com/static/v2/json/mappingInfoSet`

#### 请求字段说明

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| languageCode | Required | string | 语言编码，见通用字段描述，通常固定为 en-US |
| setType | Required | enum | 自助 mapping 设置类型。可选值：<br />- addMapping：新增酒店或房型 Mapping 关系<br />- deleteHotelMapping：删除酒店及其下房型 Mapping 关系<br />- deleteRoomMapping：仅删除房型 Mapping 关系 |
| hotelId | Required | integer | 携程子酒店 ID |
| hotelCode | Required | string | 合作方酒店 code |
| subRoomMappings | Required | array | 自助匹配的房型列表，仅房型匹配时需要传值；最多可设置 50 个产品 |

##### subRoomMappings 数组字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| subRoomId | Required | long | 携程售卖产品 ID |
| roomTypeCode | Required | string | 合作方房型 code |
| roomTypeName | Optional | string | 合作方房型名称，可能是物理房型名称，也可能是售卖产品名称 |
| ratePlanCode | Optional | string | 合作方价格计划 code |
| ratePlanName | Optional | string | 合作方价格计划名称 |

#### 请求示例

```json
{
  "languageCode": "zh-CN",
  "setType": "addMapping",
  "hotelId": 82362553,
  "hotelCode": "325657",
  "subRoomMappings": [
    {
      "subRoomId": 12345,
      "roomTypeCode": "MMS123",
      "roomTypeName": "双床房",
      "ratePlanCode": "GGD123",
      "ratePlanName": "XXXX"
    },
    {
      "subRoomId": 23456,
      "roomTypeCode": "NMM2354",
      "roomTypeName": "豪华单人房",
      "ratePlanCode": "GGD123",
      "ratePlanName": "XXXX"
    }
  ]
}
```

#### 响应字段说明

##### 根级别字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| languageCode | Required | string | 语言编码，见通用字段描述，通常固定为 en-US |
| requestId | Optional | string | 日志序列号，直连自助信息推送成功后的日志序号，用于后续查询自助 mapping 结果 |
| code | Required | string | 信息推送返回码，成功时为 0 |
| message | Required | string | 信息推送返回信息 |
| resultList | Optional | object | 业务结果列表 |

##### resultList 对象字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| hotel | Required | object | 酒店级别处理结果 |
| roomLists | Required | array | 房型级别处理结果列表 |

##### resultList.hotel 对象字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| hotelId | Required | integer | 携程酒店 ID |
| code | Required | string | 酒店级别处理结果码。0 表示成功 |
| message | Required | string | 酒店级别处理结果信息 |

##### resultList.roomLists 数组字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| subRoomId | Required | long | 携程售卖产品 ID |
| code | Required | string | 房型级别处理结果码。0 表示成功 |
| message | Required | string | 房型级别处理结果信息 |

#### 响应示例

```json
{
  "code": "0",
  "message": "Success",
  "requestId": "162742088503487da76e767045fca9b2",
  "resultList": {
    "hotel": {
      "hotelId": 2364093,
      "code": "0",
      "message": "Success"
    },
    "roomLists": [
      {
        "subRoomId": 99262189,
        "code": "0",
        "message": "Success"
      }
    ]
  }
}
```

#### 部分失败响应示例

```json
{
  "code": "0",
  "message": "Success",
  "requestId": "162742088503487da76e767045fca9b2",
  "resultList": {
    "hotel": {
      "hotelId": 2364093,
      "code": "0",
      "message": "Success"
    },
    "roomLists": [
      {
        "subRoomId": 1234,
        "code": "SB1017",
        "message": "Room not belong to current hotel"
      },
      {
        "subRoomId": 74799910,
        "code": "SB1017",
        "message": "Room not belong to current hotel"
      },
      {
        "subRoomId": 99262269,
        "code": "0",
        "message": "Success"
      },
      {
        "subRoomId": 99262171,
        "code": "SB1019",
        "message": "Room does not allow operate"
      },
      {
        "subRoomId": 99266172,
        "code": "SB1019",
        "message": "Room does not allow operate"
      },
      {
        "subRoomId": 99262189,
        "code": "0",
        "message": "Success"
      }
    ]
  }
}
```
