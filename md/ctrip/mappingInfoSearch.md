# mappingInfoSearch

## 基本信息

- **面板**：携程接口
- **菜单**：mappingInfoSearch
- **前端页面**：`src/app/product/ctrip/mappingInfoSearch/page.tsx`
- **后端接口**：`src/app/api/product/ctrip/mappingInfoSearch/route.ts`
- 如果前端页面文件或后端接口文件不存在，则需要创建。

## 功能说明

用于查看携程 mappingInfoSearch 接口的调用与返回结果。该接口主要用于查询您酒店下已匹配或未匹配的携程售卖房型映射信息。适用于查询和管理酒店房型映射关系的场景。

## 授权验证

所有请求到携程的接口均需要提前申请用户名和密码，并且需要权限认证。

## 权限认证说明

权限认证信息需要按照如下要求放在 HTTP Header 中：

| 字段名 | 定义 | 类型 | 示例 |
|--------|------|------|------|
| Code | 对接方Trip编号 | integer | 134 |
| Authorization | 用户名:密码，用冒号拼接，并用 SHA-256 进行加密，密文小写 | string | 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e7 |

## 接口实现

### 1. 自助匹配携程映射信息查询接口

**接口路径**：`/static/v2/json/mappingInfoSearch`

**接口说明**：该接口主要用于查询您酒店下已匹配或未匹配的携程售卖房型映射信息。适用于查询和管理酒店房型映射关系的场景。

#### 接口调用信息

- **请求方法**：POST
- **接口方法名**：mappingInfoSearchRQ/RS
- **接口调用方**：合作伙伴
- **接口响应方**：Trip.com

#### Endpoint URLs

- **测试环境**：`https://gateway.fat.ctripqa.com/static/v2/json/mappingInfoSearch`
- **生产环境**：`https://receive-vendor-hotel.ctrip.com/static/v2/json/mappingInfoSearch`

#### 请求字段说明

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| languageCode | Required | string | 见通用字段描述，固定 en-US |
| getMappingInfoType | Required | enum | 获取信息类型，值为 UnMapping、Mapping。UnMapping 表示获取未 Mapping 的信息，Mapping 表示获取已经 Mapping 的信息 |
| hotelIds | Required | array | 携程子酒店 id 列表，最多允许同时查询 5 个酒店；多个酒店用英文逗号分隔 |

#### 请求示例

```json
{
  "languageCode": "en-US",
  "getMappingInfoType": "UnMapping",
  "hotelIds": [
    "82362553",
    "52362553",
    "85345667"
  ]
}
```

#### 响应字段说明

##### 根级别字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| languageCode | Required | string | 见通用字段描述，固定 en-US |
| code | Required | string | 信息推送时，返回的 Code，成功时返回 Code 为 0 |
| message | Required | string | 信息推送时，返回的信息 |
| datas | Optional | array | 仅符合查询条件的酒店数据返回，如无满足条件的酒店数据则不返回或返回为空 |

**注意**：信息查询时，查询失败返回的 Code 和 message，成功时不返回。

##### datas 数组字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| hotelId | Required | integer | 携程子酒店 id |
| hotelCode | Optional | string | 供应商酒店 code，当酒店已匹配时返回，未匹配时返回为空 |
| subRoomLists | Required | array | 已匹配或未匹配的携程售卖房型列表 |
| code | Required | string | 信息查询时，查询失败返回的 Code，成功时不返回 |
| message | Required | string | 信息查询时，查询失败返回的原因，成功时不返回 |

##### subRoomLists 数组字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| roomId | Required | long | 携程售卖房型 id |
| roomTypeCode | Optional | string | 供应商房型 code，当房型已匹配时返回，未匹配时返回为空 |
| ratePlanCode | Optional | string | 供应商 Rate Plan Code，当房型已匹配且存在时返回，其他可能返回为空 |
| roomName | Optional | string | 携程售卖房型名称，对应的语种为请求的语种 |
| mealType | Required | integer | 携程售卖房型餐食类型 |
| maxOccupancy | Required | integer | 携程售卖房型对应的最大入住人数 |
| maxAdultOccupancy | Required | integer | 携程售卖房型对应的最大入住成人数 |
| balanceType | Required | enum | 价格类型，可能的值：Prepay（预付）、PayOnSpot（现付）、Package（套餐） |
| twinBed | Required | bool | 是否双床，true 是，false 否 |
| kingSize | Required | bool | 是否大床，true 是，false 否 |
| status | Required | string | 对应售卖房型的状态，Show：显示；Hidden：隐藏；Deactivate：已废弃 |
| allowAddBed | Optional | bool | 是否允许加床 |

#### 响应示例

```json
{
  "languageCode": "en-US",
  "code": "0",
  "message": "成功",
  "datas": [
    {
      "hotelId": "82362553",
      "hotelCode": "12345",
      "subRoomLists": [
        {
          "roomId": 1345678,
          "roomTypeCode": "",
          "ratePlanCode": "",
          "roomName": "标准大床房，含单早，2人价",
          "mealType": 4,
          "maxOccupancy": 2,
          "maxAdultOccupancy": 2,
          "allowAddBed": false,
          "balanceType": "Prepay",
          "twinBed": false,
          "kingSize": true,
          "status": "Show"
        },
        {
          "roomId": 1345679,
          "roomTypeCode": "",
          "ratePlanCode": "",
          "roomName": "标准大床房，含三早，3人价",
          "mealType": 4,
          "maxOccupancy": 3,
          "maxAdultOccupancy": 3,
          "allowAddBed": false,
          "balanceType": "Prepay",
          "twinBed": false,
          "kingSize": true,
          "status": "Show"
        }
      ]
    },
    {
      "hotelId": "52362553",
      "hotelCode": "",
      "subRoomLists": []
    },
    {
      "hotelId": "85345667",
      "code": "CB1005",
      "message": "Request data invalid,【hotelId：85345667】"
    }
  ]
}
```

#### 返回失败示例

```json
{
  "languageCode": "en-US",
  "code": "CB0000",
  "message": "Invalid group id"
}
```
