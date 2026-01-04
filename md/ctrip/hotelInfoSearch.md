# hotelInfoSearch

## 基本信息

- **面板**：携程接口
- **菜单**：hotelInfoSearch
- **前端页面**：`src/app/product/ctrip/hotelInfoSearch/page.tsx`
- **后端接口**：`src/app/api/product/ctrip/hotelInfoSearch/route.ts`

## 功能说明

用于查看携程 hotelInfoSearch 接口的调用与返回结果。该接口主要用于自助查询待Mapping的酒店列表及相关信息，仅供自助匹配模式的合作伙伴使用。

## 授权验证

所有请求到携程的接口均需要提前申请用户名和密码，并且需要权限认证。

## 权限认证说明

权限认证信息需要按照如下要求放在 HTTP Header 中：

| 字段名 | 定义 | 类型 | 示例 |
|--------|------|------|------|
| Code | 对接方Trip编号 | integer | 134 |
| Authorization | 用户名:密码，用冒号拼接，并用 SHA-256 进行加密，密文小写 | string | 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e7 |

## 接口实现

### 1. 自助匹配酒店内容查询接口

**接口路径**：`/static/v2/json/hotelInfoSearch`

**接口说明**：该接口主要用于自助查询待Mapping的酒店列表及相关信息，仅供自助匹配模式的合作伙伴使用。

#### 接口调用信息

- **请求方法**：POST
- **接口方法名**：hotelInfoSearchRQ/RS
- **接口调用方**：合作伙伴
- **接口响应方**：Trip.com

#### Endpoint URLs

- **测试环境**：`https://gateway.fat.ctripqa.com/static/v2/json/hotelInfoSearch`
- **生产环境**：`https://receive-vendor-hotel.ctrip.com/static/v2/json/hotelInfoSearch`

#### 请求字段说明

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| languageCode | Required | string | 见通用字段描述，固定 en-US |
| supplierId | Optional | integer | 酒店所属的 supplierId，仅符合条件的酒店可被查询返回。查询条件：supplierId/brand/hotelIds/mgrgroupid 四者至少有一个不为空，否则报错 |
| mgrgroupid | Optional | integer | 酒店所属集团 id，仅符合条件的酒店可被查询返回（当前暂不可用） |
| brand | Optional | integer | 酒店品牌，仅符合条件的酒店可被查询返回 |
| hotelIds | Optional | array | 携程子酒店 id 列表，最多允许同时查询 5 个酒店；多个酒店用英文逗号分隔 |
| startHotelId | Optional | string | 查找的起始酒店 id，当传 supplierId 或者 mgrGroupId 或者 brand 时，必传。第一次查询为 0，第二次查询为第一次查询返回中的 maxHotelId，则第二次返回的酒店为 maxHotelId+1, +2，…的酒店 |
| batchSize | Optional | integer | 一次查询的酒店数量，当传 supplierId 或者 mgrGroupId 或者 brand 时，必传；最大值为 10 |

#### 请求示例

```json
{
  "languageCode": "zh-CN",
  "supplierId": 12354,
  "mgrGroupId": 123,
  "brand": 123,
  "hotelIds": [
    "82362553",
    "52362553"
  ],
  "startHotelId": "123",
  "batchSize": 20
}
```

#### 响应字段说明

##### 根级别字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| languageCode | Required | string | 见通用字段描述，固定 en-US |
| code | Required | string | 信息推送时，返回的 Code，成功时返回 Code 为 0 |
| message | Required | string | 信息推送时，返回的信息 |
| hotelLists | Optional | array | 仅符合查询条件的酒店返回，如无满足条件的酒店则不返回或返回为空 |
| maxHotelId | Optional | string | 根据条件查询的最大酒店 id，仅当根据 supplierid/brand 请求时，才会返回该字段，可作为下一批酒店的起始查询 id |

**注意**：信息查询时，查询失败返回的 Code 和 message，成功时不返回。

##### hotelLists 数组字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| hotelId | Required | integer | 携程子酒店 id |
| hotelInfos | Required | object | 携程子酒店信息 |

##### hotelInfos 对象字段

| 字段名 | 是否必填 | 类型 | 说明 |
|--------|---------|------|------|
| hotelName | Required | string | 酒店名称 |
| countryName | Required | string | 酒店所属国家名称 |
| cityName | Required | string | 酒店所在城市名称 |
| address | Required | string | 酒店所在的具体地址，不含省份、城市和行政区 |
| telephone | Required | string | 酒店电话 |
| brandName | Optional | string | 酒店所属品牌 |
| hotelBelongTo | Required | string | 酒店所属类别，现预付酒店类型。值：1）PayOnSpot-现付；2）Prepay-预付；3）Supplier-供应商 |

#### 响应示例

```json
{
  "languageCode": "zh-CN",
  "code": "0",
  "message": "成功",
  "hotelLists": [
    {
      "hotelId": "82362553",
      "hotelInfos": {
        "hotelName": "香格拉里大酒店",
        "countryName": "中国",
        "cityName": "上海",
        "address": "黄浦江东路3847号",
        "telephone": "021-746464535-1234",
        "brandName": "香格里拉",
        "hotelBelongTo": "Prepay"
      }
    },
    {
      "hotelId": "52362553",
      "hotelInfos": {
        "hotelName": "北京丽都维景酒店",
        "countryName": "中国",
        "cityName": "北京",
        "address": "内外二线东林海878号",
        "telephone": "010-746464535",
        "brandName": "",
        "hotelBelongTo": "PayOnSpot"
      }
    }
  ],
  "maxHotelId": "82362553"
}
```
