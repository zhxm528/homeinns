# getProduct

## 基本信息

- **面板**：如家接口
- **菜单**：产品接口
- **前端页面**：`src/app/product/inns-api/product-api/page.tsx`
- **后端接口**：`src/app/api/product/inns-api/product-api/route.ts`
- 如果前端页面文件或后端接口文件不存在，则需要创建。

## 功能说明

查询单体酒店产品详情。GetProducts 接口支持多早餐价格及折上折活动产品输出。

## 接口实现

### 1. 产品查询接口

**接口路径**：`/api/HotelAvailableRM/GetProducts`

**接口说明**：
1. GetProducts 接口支持多早餐价格及折上折活动产品输出
2. RateCode 字段为产品价格码数据：
   - CTMGD价格码为企业协议价格码
   - CTMBF开头的价格码为TMC多早餐价格
   - CTMPRD价格码为企业促销产品价格码
   - BAR、BARX开头价格码为门市价价格，仅做划线价使用，不可下单，如不需展示划线价可过滤
   - 集团一口价产品：CTMGF开头价格码，CTMGF0是无早一口价，CTMGF1单早一口价，CTMGF2双早一口价，CTMHF开头的价格码为单店一口价协议，CTMHF0是无早一口价，CTMHF1单早一口价，CTMHF2双早一口价
3. RatePackages 包价码对象为判断此价格码数据是否含早的依据：
   - 包价码为空代表无早；Code为 BFM0-含早，最多两份；为BFM1-含单早；为 BFM2-含双早
   - 含早餐数量情况需在下单接口中通过Count 字段下传，无早的情况可不填写
4. ActCd 字段为折上折促销产品编码，预订折上折产品时试单下单接口中需将此字段下传

**注释**：
1. 价格取值逻辑：只看RoomRateDetailDaily-Prs?参数，根据人数，1人取一人价，2人取二人价
2. 早餐取值逻辑：只看RatePackage-Code，BFM0根据人数，1人显示含单早，2人显示含双早；BFM1显示含单早；BFM2显示含双早
3. RatePackage如果存在多个包价节点，早餐包价（BFM0、BFM1、BFM2）仅取第一个节点
4. 单双价格不同的一定要用BFM0；单双价格不同，不可设置为BFM1，单双价格不同，也不能设置成BFM2

#### 接口调用信息

- **请求方法**：POST
- **接口方法名**：GetProducts
- **接口调用方**：合作伙伴
- **接口响应方**：如家系统

#### Endpoint URLs

- **生产环境**：`https://zyota.homeinns.com/HomeinnsAgentApi/api/HotelAvailableRM/GetProducts`

#### 请求字段说明

| 字段名 | 是否必填 | 类型 | 说明 | 长度 | 备注 |
|--------|---------|------|------|------|------|
| ResvType | Required | String | 预定类型 | 8 | 枚举值：CSRV（固定字符串） |
| HotelCd | Required | String | 酒店编号 | 10 | 酒店6位长度的唯一编号 |
| ArrDate | Required | date | 到店日期 | 10 | yyyy-MM-dd |
| DepDate | Required | date | 离店日期 | 10 | yyyy-MM-dd |
| RmTypeCds | Optional | String | 房型编号 | 10 | 不填写则获取酒店全量房型数据 |
| RoomNum | Required | Int | 房间数 | - | 正整数，默认为1 |
| Adults | Required | Int | 成人数 | - | 正整数，默认为1 |
| IsAvail | Optional | Int | 可用性过滤 | - | 枚举值：不传时默认为1；0：代表实时查询，根据房价约束过滤可售产品；1（默认值）：代表用于渠道拉取数据缓存，不会根据房价约束过滤可售产品，即返回每天的产品数据，包括：连住天数、提前预订等房价约束条件；通常，"0" ，用于已知酒店、入离店日期、房间数、人数等信息，客人在酒店详情页实时查询可售产品用；"1"，用于渠道一次性拉取多天（例如90天）的数据，缓存到本地，客人在酒店列表页查询时使用 |
| MembershipType | Optional | String | 会员类型 | 10 | 枚举值：用户区分"商旅"和"会员"，同时区分会员等级，用于会员互通业务；1. 默认为空，非商旅企业的散客预订默认为空；2. "商旅企业必填"：cy（固定字符串）；3. "首旅汇如Life会员互通"的会员散客：10:钻石账户，2：铂金账户，3：金账户，4：银账户，5：E账户；4. "首享会Bravo会员互通"的会员散客：E：荣誉，D：传奇，C：大使，B：精英，A：新秀 |
| MemberNo | Optional | string | 企业编号 | 50 | 商旅企业预订专用，用于企业直连、TMC两方、TMC三方预订，MembershipType=CY时必填；1. 企业直连（必填）：填写企业编号；2. TMC托管三方（必填）：填写企业编号；3. TMC直连两方（必填）：填写TMC编号；也适用TMC拉取缓存时的虚拟企业编号 |
| RuleDimension | Optional | string | 自定义规则维度 | 500 | 仅用于官网传参 |
| AllowLoadPromotion | Required | bool | 是否加载活动产品 | - | 若为FALSE，接口屏蔽促销产品 |
| OnlyShowEnabledPromotion | Required | bool | 是否只显示可用活动产品 | - | 若为TRUE，接口屏蔽当前不可用的促销产品 |

#### 请求示例

```json
{
  "HotelCd": "021040",
  "ArrDate": "2017-05-26",
  "DepDate": "2017-05-27",
  "RmTypeCds": "",
  "ResvType": "CSRV",
  "MembershipType": "",
  "RateCode": "",
  "MemberNo": "",
  "RoomNum": 1,
  "Adults": 1,
  "Terminal_License": "XXXXX",
  "Terminal_Seq": "XXXXXX",
  "Terminal_OprId": "XXXXX"
}
```

#### 响应字段说明

##### 根级别字段

| 字段名 | 是否必填 | 类型 | 说明 | 备注 |
|--------|---------|------|------|------|
| HotelCd | Required | String | 酒店编号 | 酒店6位长度的唯一编号 |
| Products | Optional | List | 产品集合 | 产品是指房型+价格（房价码和促销价） |
| ResCode | Required | Int | 响应代码 | - |
| ResDesc | Required | String | 响应描述 | - |

##### Products 数组字段

| 字段名 | 是否必填 | 类型 | 说明 | 备注 |
|--------|---------|------|------|------|
| RoomType | Required | Object | 房型信息 | 房型编号 |
| RoomRates | Required | List | 房型产品集合 | 价格信息，包含：房价码、促销价 |

##### RoomType 对象字段

| 字段名 | 是否必填 | 类型 | 说明 | 备注 |
|--------|---------|------|------|------|
| RoomTypeCode | Required | String | 房型编号 | - |
| RoomTypeName | Required | String | 房型名称 | - |
| MinRoomNum | Optional | Int | 时间段最小库存数 | OTA渠道使用 |
| Adults | Optional | Int | 成人最大入住人数 | （暂不使用）默认为-1，表示不限制人数 |
| Children | Optional | Int | 小孩最大入住人数 | （暂不使用）默认为-1，表示不限制人数 |
| HotelCd | Optional | String | 酒店编号 | （待删除） |
| RoomTypeSort | Optional | Int | 房型排序 | （待删除） |

##### RoomRate 对象字段

| 字段名 | 是否必填 | 类型 | 说明 | 备注 |
|--------|---------|------|------|------|
| RateCode | Required | String | 价格码 | 1、CTMHF开头的价格码为单店一口价协议；2、CTMBF开头的价格码为TMC多早餐价格；3、CTMGD价格码为企业协议价格码；4、CTMPRD价格码为企业促销产品价格码；5、集团一口价询报价产品：CTMGF开头价格码，CTMGF0是无早一口价，CTMGF1单早一口价，CTMGF2双早一口价；6、BAR、BARX开头的为门市价（划线价，商旅不可用来下单）--BAR为经济型酒店门市价价格码，BARX为高星酒店门市价价格码 |
| RateName | Required | String | 价格码名称 | - |
| RateDesc | Optional | String | 房价码段描述 | （暂不使用）描述价格，包括组合产品的描述信息 |
| RateSort | Optional | Int | 价格码排序 | - |
| ActCd | Optional | String | 促销码 | 促销活动ID |
| ActName | Optional | String | 促销活动名称 | 促销活动名称 |
| ActDesc | Optional | String | 促销活动说明 | （暂不使用）活动说明，包括组合产品的描述信息 |
| RatePackages | Optional | List | 包价代码 | 主要用于存放产品含早信息 |
| RoomRateDetailDailys | Required | List | 每日价格详情 | - |
| RoomRateGuaranteeRules | Optional | List | 担保规则 | - |
| Enabled | Required | bool | 是否满足预订条件 | - |

##### RoomRateDetailDaily 对象字段

| 字段名 | 是否必填 | 类型 | 说明 | 备注 |
|--------|---------|------|------|------|
| RateCode | Required | String | 价格码 | 仅支持多天房价码相同 |
| ActCd | Optional | String | 促销ID | （暂不使用）仅支持多天促销ID相同 |
| RoomTypeCode | Optional | String | 房型代码 | （暂不使用）仅支持多天房型代码相同 |
| StDate | Required | Date | 日期 | 每日日期yyyy-MM-dd |
| Prs1 | Required | decimal | 一人价 | 1个人的价格（高星酒店存在多人价不同的情况，主要差异为早餐数量不同产生的差价） |
| Prs2 | Required | decimal | 二人价 | 2个人的价格，经济型2人价同1人价 |
| Prs3 | Optional | decimal | 三人价 | 3个人的价格，经济型3人价同1人价 |
| Prs4 | Optional | decimal | 四人价 | 4个人的价格，经济型4人价同1人价 |
| Prs5 | Optional | decimal | 五人价 | 5个人的价格，经济型5人价同1人价 |
| ExtraBed | Optional | decimal | 加床价 | 高星酒店加床的单价 |
| Child | Optional | decimal | 加儿童价格 | 1个儿童的单价 |
| AvailableRooms | Required | Int | 可用房量 | 可预订的房量 |
| ResvPoints | Optional | Int | 每间夜换房所需积分 | 仅用于积分兑换（如家会员积分） |
| TaxFlag | Required | Int | 税费计算方式 | 枚举值：0固定值，1百分比 |
| Tax | Required | decimal | 税费金额 | 税金金额，和TaxFlag组合计算出税费 |
| ServiceChargeFlag | Required | Int | 服务费计算方式 | 枚举值：0固定值，1百分比 |
| ServiceCharge | Required | decimal | 服务费金额 | 服务费金额，和ServiceChargeFlag组合计算出服务费 |
| AdvBookin | Required | Int | 至少提前多少时间预定 | - |
| MinLogs | Required | Int | 最小连住天数 | 默认为1 |
| MaxLogs | Required | Int | 最大连住天数 | 默认为999 |
| SegmentsCode | Optional | String | 市场码 | - |
| SourcesCode | Optional | String | 来源码 | - |
| AccessLevel | Optional | String | 支持的预定方式 | - |

##### RatePackage 对象字段

| 字段名 | 是否必填 | 类型 | 说明 | 备注 |
|--------|---------|------|------|------|
| Code | Required | String | 包价代码 | 枚举值：（商旅业务仅存在1、2、3 三种枚举值）1. BFM0-含早，按入住人数，最多两份；2. BFM1-含单早；3. BFM2-含双早；4. F19000001 体验项目；5. P18000999 线上早餐；6. J18000001 积分加速；7. F19000002 正餐；8. J20000002 线下积分加速；9. P19000500 下午茶 |
| Name | Optional | String | 包价名称 | - |
| PackageDes | Optional | String | 包价描述 | - |
| Price | Optional | String | 价格 | 包价的单价 |
| PeopleNum | Optional | int | 份数 | - |

##### RoomRateGuaranteeRule 对象字段

| 字段名 | 是否必填 | 类型 | 说明 | 备注 |
|--------|---------|------|------|------|
| HotelCd | Optional | String | 酒店编号 | （待删除） |
| RoomTypeCode | Required | String | 房型编号 | - |
| RateCode | Required | String | 价格码 | - |
| ActCd | Optional | String | 促销ID | （暂不使用）活动促销ID |
| GuaranteeRuleCode | Required | String | 策略代码 | - |
| GuaranteeRuleName | Required | String | 策略描述 | - |
| ArrivalTimeRequired | Optional | Int | 需要到达时间 | - |
| HoldTime | Optional | String | 最晚保留时间HH:mm | 例如：18:00 |
| IsPrepay | Required | Int | 是否需要预付 | 枚举值：1=预付（月结 / 预存款）试单下单接口paycd传12；0=现付（也支持预付）试单下单接口现付传00，预付传12 |
| RoomRateCancelRule | Optional | Object | 取消规则 | - |
| RoomRateDepositRule | Optional | Object | 订金规则 | - |

##### RoomRateCancelRule 对象字段

| 字段名 | 是否必填 | 类型 | 说明 | 备注 |
|--------|---------|------|------|------|
| HotelCd | Optional | String | 酒店编号 | （待删除） |
| RoomTypeCode | Required | String | 房型编号 | - |
| RateCode | Required | String | 价格码 | - |
| ActCd | Optional | String | 促销ID | （暂不使用）活动促销ID |
| GuaranteeRuleCode | Required | String | 策略代码 | - |
| Code | Required | String | 取消规则代码 | Code值为 4代表：不可取消；其余值代表限时取消，需结合DayBeforeArrival、CancelBeforeTime字段使用 |
| Name | Required | String | 取消规则名称 | - |
| Remark | Optional | String | 取消规则备注 | - |
| RuleType | Required | String | 罚金的方式 | 枚举值：0=固定金额（限时取消）；1=百分比（限时取消）；2=间夜（限时取消）；3=不能取消（一经预订不可取消，Noshow将收取100%罚金） |
| DayBeforeArrival | Required | string | 在入住前几天可以取消（整数） | 限时前可免费取消，逾期取消收取罚金；最晚取消时间计算公式： 入住日24点-（DayBeforeArrival*24+24-CancelBeforeTime） |
| CancelBeforeTime | Required | string | 在几点前可以取消（0-23） | 限时前可免费取消，逾期取消收取罚金（最晚取消时间计算公式：DayBeforeArrival*24+24-CancelBeforeTime） |
| PenaltyFee | Required | string | 罚金 | 值和RuleType相关：1. 当Type=0时，值为金额；2. 当Type=1时，值为百分比例；3. 当Type=2时，值为间夜数 |

##### RoomRateDepositRule 对象字段

| 字段名 | 是否必填 | 类型 | 说明 | 备注 |
|--------|---------|------|------|------|
| HotelCd | Optional | string | 酒店编号 | （待删除） |
| RoomTypeCode | Required | String | 房型编号 | - |
| GuaranteeRuleCode | Required | String | 策略代码 | - |
| RateCode | Required | String | 价格码 | - |
| ActCd | Optional | String | 促销ID | （暂不使用）活动促销ID |
| Code | Optional | String | 订金规则代码 | - |
| Name | Optional | String | 订金规则名称 | - |
| Remark | Optional | String | 订金规则备注 | - |
| RuleType | Required | String | 订金计算方式 | 枚举值：0固定金额；1按百分比计算；2按间夜计算 |
| DepositAmount | Required | String | 订金 | 值和RuleType相关：1. 当Type=0时，值为金额；2. 当Type=1时，值为百分比例；3. 当Type=2时，值为间夜数 |
| DayBeforeArrival | Optional | String | 住当天0:00前X小时 | 在入住当天0:00前X小时内需要交订金；过时未支付，酒店可以取消订单 |
| DayBeforeBooking | Optional | String | 预订后X小时 | 在预订后X小时中需要交订金；针对预付订单，预定后，过时未支付，订单自动取消 |

#### 响应示例

```json
{
  "HotelCd": "JG0045",
  "Products": [
    {
      "RoomType": {
        "RoomTypeCode": "BKNC",
        "HotelCd": null,
        "MinRoomNum": 4,
        "RoomTypeName": "商务大床房",
        "RoomTypeSort": 0,
        "RoomTypedFacilities": null,
        "Descript": null,
        "Adults": -1,
        "Children": -1
      },
      "RoomRates": [
        {
          "RateCode": "BARX",
          "RateDesc": null,
          "RateName": "最佳可卖房价",
          "HourNums": "0",
          "ShortInfo": "最佳可卖房价",
          "ActCd": "",
          "ActName": null,
          "ActDesc": null,
          "Enabled": false,
          "RatePackages": [
            {
              "Code": "",
              "Name": null,
              "Price": 0,
              "PackageDes": "",
              "PeopleNum": 2
            }
          ],
          "RoomRateDetailDailys": [
            {
              "RoomTypeCode": null,
              "ActCd": null,
              "RateCode": "BARX",
              "CateCode": "BAR",
              "StDate": "2023-07-27T00:00:00",
              "Prs1": 513,
              "Prs2": 513,
              "Prs3": 513,
              "Prs4": 513,
              "Prs5": 0,
              "ExtraBed": 0,
              "Child": 0,
              "AvailableRooms": 4,
              "ResvPoints": 0,
              "TaxFlag": 1,
              "Tax": 0,
              "ServiceChargeFlag": 1,
              "ServiceCharge": 0,
              "AdvBookin": 0,
              "MinLogs": 0,
              "MaxLogs": 99,
              "SegmentsCode": "BAR",
              "SourcesCode": "OTO",
              "AccessLevel": "C,M,I,G",
              "Score": 0
            }
          ],
          "RoomRateGuaranteeRules": [
            {
              "RoomTypeCode": null,
              "ActCd": null,
              "RateCode": "BARX",
              "GuaranteeRuleCode": "6PM",
              "GuaranteeRuleName": "保留下午6点",
              "ArrivalTimeRequired": 0,
              "IsPrepay": 0,
              "HoldTime": null,
              "RoomRateCancelRule": {
                "HotelCd": null,
                "RoomTypeCode": null,
                "RateCode": "BARX",
                "GuaranteeRuleCode": "6PM",
                "Code": "4",
                "Name": "不可取消",
                "Remark": "一经预订不可取消",
                "RuleType": "3",
                "DayBeforeArrival": "999",
                "CancelBeforeTime": "0",
                "PenaltyFee": "0.00"
              },
              "RoomRateDepositRule": {
                "HotelCd": null,
                "RoomTypeCode": null,
                "GuaranteeRuleCode": "6PM",
                "RateCode": null,
                "Code": null,
                "Name": null,
                "Remark": null,
                "RuleType": "0",
                "DepositAmount": "0.0",
                "DayBeforeArrival": "0",
                "DayBeforeBooking": "0"
              }
            }
          ],
          "IsOffline": false
        }
      ]
    }
  ],
  "ResCode": 0,
  "ResDesc": "成功"
}
```

## 核心功能
- 前端页面：`src/app/product/inns-api/product-api/page.tsx`
- 后端接口：`src/app/api/product/inns-api/product-api/route.ts`
- 在前端页面实现输入表单、显示调用接口的json格式入参、显示皆苦返回的json格式的字符串
- 在后端实现调用接口api，在后台日志打印入参和响应返回
