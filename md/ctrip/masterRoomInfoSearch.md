# masterRoomInfoSearch

## 基本信息

- **面板**：携程接口
- **菜单**：masterRoomInfoSearch
- **前端页面**：`src/app/product/ctrip/masterRoomInfoSearch/page.tsx`
- **后端接口**：`src/app/api/product/ctrip/masterRoomInfoSearch/route.ts`
- 如果前端页面文件或后端接口文件不存在，则需要创建。

## 功能说明

用于查看携程 masterRoomInfoSearch 接口的调用与返回结果。该接口主要用于查询您酒店下所映射的携程母房型内容。适用于依靠携程母房型内容创建物理房型及售卖产品的场景。

## 授权验证

所有请求到携程的接口均需要提前申请用户名和密码，并且需要权限认证。

## 权限认证说明

权限认证信息需要按照如下要求放在 HTTP Header 中：

| 字段名 | 定义 | 类型 | 示例 |
|--------|------|------|------|
| Code | 对接方Trip编号 | integer | 134 |
| Authorization | 用户名:密码，用冒号拼接，并用 SHA-256 进行加密，密文小写 | string | 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e7 |

## 接口实现

### 1. 自助匹配携程母房型内容查询接口

**接口路径**：`/static/v2/json/masterRoomInfoSearch`

**接口说明**：该接口主要用于查询您酒店下所映射的携程母房型内容。适用于依靠携程母房型内容创建物理房型及售卖产品的场景。

#### 接口调用信息

- **请求方法**：POST
- **接口方法名**：masterRoomInfoSearchRQ/RS
- **接口调用方**：合作伙伴
- **接口响应方**：Trip.com

#### Endpoint URLs

- **测试环境**：`https://gateway.fat.ctripqa.com/static/v2/json/masterRoomInfoSearch`
- **生产环境**：`https://receive-vendor-hotel.ctrip.com/static/v2/json/masterRoomInfoSearch`

#### 请求字段说明

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| languageCode | Required | string | 见通用字段描述，固定 en-US |
| hotelIds | Optional | array | 携程子酒店 id 列表，最多允许同时查询 5 个酒店；多个酒店用英文逗号分隔 |

#### 请求示例

```json
{
  "languageCode": "en-US",
  "hotelIds": [
    "82362553",
    "52362553"
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
| datas | Optional | array | 仅符合查询条件的酒店返回，如无满足条件的酒店则不返回或返回为空 |

**注意**：信息查询时，查询失败返回的 Code 和 message，成功时不返回。

##### datas 数组字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| hotelId | Required | integer | 携程子酒店 id |
| masterRoomLists | Required | array | 携程子酒店对应的母基房型列表 |
| code | Required | string | 信息查询时，查询失败返回的 Code，成功时不返回 |
| message | Required | string | 信息查询时，查询失败返回的原因，成功时不返回 |

##### masterRoomLists 数组字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| roomId | Required | string | 携程母基房型 id |
| roomName | Required | string | 携程母基房型名称，对应的语种为请求的语种 |
| maxOccupancy | Required | integer | 携程母基房型对应的最大入住人数 |
| maxAdultOccupancy | Required | integer | 携程母基房型对应的最大入住成人数 |
| hasWindow | Required | string | 母基房型是否有窗，Yes 表示有窗，No 表示无窗，Unknow 表示未知，partly 表示部分有窗 |
| hasWifi | Required | string | 母基房型是否有 wifi，Yes 表示有，No 表示无，Unknow 表示未知 |
| hasCableInternet | Required | string | 母基房型是否有有线网络，Yes 表示有，No 表示无，Unknow 表示未知 |

#### 响应示例

```json
{
  "languageCode": "en-US",
  "code": "0",
  "message": "成功",
  "datas": [
    {
      "hotelId": "82362553",
      "masterRoomLists": [
        {
          "roomId": "12345",
          "roomName": "标准大床房",
          "maxOccupancy": 2,
          "maxAdultOccupancy": 2,
          "hasWindow": "Yes",
          "hasWifi": "Yes",
          "hasCableInternet": "Yes"
        },
        {
          "roomId": "54683",
          "roomName": "江景大床房",
          "maxOccupancy": 3,
          "maxAdultOccupancy": 3,
          "hasWindow": "Yes",
          "hasWifi": "Yes",
          "hasCableInternet": "Yes"
        }
      ]
    },
    {
      "hotelId": "52362553",
      "masterRoomLists": [
        {
          "roomId": "174655",
          "roomName": "豪华双床房",
          "maxOccupancy": 2,
          "maxAdultOccupancy": 2,
          "hasWindow": "No",
          "hasWifi": "Yes",
          "hasCableInternet": "Yes"
        },
        {
          "roomId": "57864",
          "roomName": "豪华大床房",
          "maxOccupancy": 3,
          "maxAdultOccupancy": 3,
          "hasWindow": "Yes",
          "hasWifi": "Yes",
          "hasCableInternet": "Yes"
        }
      ]
    }
  ]
}
```

#### 返回失败示例

```json
{
  "languageCode": "en-US",
  "code": "0",
  "message": "成功",
  "datas": [
    {
      "hotelId": "82362553",
      "masterRoomLists": [
        {
          "roomId": "12345",
          "roomName": "标准大床房",
          "maxOccupancy": 2,
          "maxAdultOccupancy": 2,
          "hasWindow": "Yes",
          "hasWifi": "Yes",
          "hasCableInternet": "Yes"
        },
        {
          "roomId": "54683",
          "roomName": "江景大床房",
          "maxOccupancy": 3,
          "maxAdultOccupancy": 3,
          "hasWindow": "Yes",
          "hasWifi": "Yes",
          "hasCableInternet": "Yes"
        }
      ]
    },
    {
      "hotelId": "52362553",
      "code": "CB1005",
      "message": "Request data invalid,【hotelId：52362553】"
    }
  ]
}
```
