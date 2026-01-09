-- =====================================================================
-- 酒店基础信息表 (PostgreSQL)
-- 表名：public.hotel_base_info
-- 说明：
-- 1) 你给的字段全部包含，并逐列加注释
-- 2) 作为酒店行业 DBA 经验补充了一些“几乎必备”的字段（见表尾：补充字段区）
-- 3) money 类字段统一用 numeric；状态/开关用 boolean；日期用 date；时间用 timestamptz
-- =====================================================================

DROP TABLE IF EXISTS public.hotel_base_info CASCADE;

CREATE TABLE public.hotel_base_info (
  -- -------------------------
  -- 主键与审计字段（DBA补充）
  -- -------------------------
  id                          bigserial PRIMARY KEY,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  created_by                  text NULL,
  updated_by                  text NULL,

  -- -------------------------
  -- 你提供的字段
  -- -------------------------
  hotel_code                  varchar(50) NOT NULL,
  hotel_name                  text NOT NULL,
  hotel_en_name               text NULL,
  hotel_lang_name             text NULL,

  hotel_type                  varchar(50) NULL,
  hotel_star                  smallint NULL,

  group_code                  varchar(50) NULL,

  hotel_address               text NULL,
  short_hotel_address         text NULL,
  hotel_en_address            text NULL,
  post_code                   varchar(20) NULL,

  mobile_phone                varchar(50) NULL,
  phone                       varchar(50) NULL,
  email                       varchar(254) NULL,
  fax                         varchar(50) NULL,

  land_mark                   text NULL,

  catering                    boolean NULL,
  banquet                     boolean NULL,

  prompt                      text NULL,
  hotel_features              text NULL,

  business_area               text NULL,
  hotel_area                  numeric(12,2) NULL,
  meeting_room_area           numeric(12,2) NULL,
  the_banquet_area            numeric(12,2) NULL,

  all_room_nums               integer NULL,
  use_money                   numeric(18,2) NULL,

  status                      varchar(50) NULL,
  nearby_hotel                text NULL,

  hotel_keyword               text NULL,
  "describe"                  text NULL,
  remarks                     text NULL,

  create_date                 timestamptz NULL,
  sort                        integer NULL,

  is_delete                   boolean NOT NULL DEFAULT false,

  open_date                   date NULL,

  pms_type                    varchar(50) NULL,
  restaurant_resv_email       varchar(254) NULL,
  banquet_resv_email          varchar(254) NULL,

  resv_class                  varchar(50) NULL,
  contract_no                 varchar(100) NULL,

  display_status              varchar(50) NULL,
  admin_code                  varchar(50) NULL,

  presale_date                date NULL,
  opening_date                date NULL,

  over_book_status            varchar(50) NULL,

  sales_id                    varchar(50) NULL,

  rate_code_switch            boolean NULL,
  room_type_switch            boolean NULL,

  best_price_exclusion        boolean NULL,

  area                        varchar(100) NULL,
  urban_area                  varchar(100) NULL,

  hotel_brand                 varchar(100) NULL,

  hotel_status_start_date     date NULL,
  closing_date                date NULL,

  mdm_province                varchar(100) NULL,
  mdm_city                    varchar(100) NULL,

  hotel_min_price             numeric(18,2) NULL,

  default_open_sale           boolean NULL,
  default_roll_price_stock    boolean NULL,

  describe_en                 text NULL,

  guaranteed_price            numeric(18,2) NULL,

  best_price_voc_channel_mode varchar(50) NULL,

  property_type               varchar(50) NULL,

  -- -------------------------
  -- DBA经验补充：酒店主数据常用必备字段
  -- -------------------------
  timezone                    varchar(64) NULL,
  currency_code               char(3) NULL,
  check_in_time               time NULL,
  check_out_time              time NULL,
  latitude                    numeric(10,7) NULL,
  longitude                   numeric(10,7) NULL,
  city_code                   varchar(50) NULL,
  country_code                char(2) NULL,
  is_active                   boolean NOT NULL DEFAULT true
);

-- =====================================================================
-- 表注释
-- =====================================================================
COMMENT ON TABLE public.hotel_base_info IS
'酒店基础信息表（Hotel Master Data）：用于PMS/CRS/渠道/BI等系统共享的酒店主档。包含名称地址、品牌星级、主数据编码、营业状态、预售/开业/停业日期、预订联系邮箱、以及业务开关等。';

-- =====================================================================
-- 字段注释（你提供的字段 + DBA补充字段）
-- =====================================================================

COMMENT ON COLUMN public.hotel_base_info.id IS '主键ID（系统内部唯一标识）';
COMMENT ON COLUMN public.hotel_base_info.created_at IS '记录创建时间（DBA审计字段）';
COMMENT ON COLUMN public.hotel_base_info.updated_at IS '记录更新时间（DBA审计字段）';
COMMENT ON COLUMN public.hotel_base_info.created_by IS '创建人/创建系统（可填用户名/系统名）';
COMMENT ON COLUMN public.hotel_base_info.updated_by IS '更新人/更新系统（可填用户名/系统名）';

COMMENT ON COLUMN public.hotel_base_info.hotel_code IS 'HotelCode：酒店编码（CRS/PMS/集团主数据对接的关键码，建议唯一）';
COMMENT ON COLUMN public.hotel_base_info.hotel_name IS 'HotelName：酒店中文名（展示用主名称）';
COMMENT ON COLUMN public.hotel_base_info.hotel_en_name IS 'HotelENName：酒店英文名（面向海外渠道/英文站点）';
COMMENT ON COLUMN public.hotel_base_info.hotel_lang_name IS 'HotelLangName：本地语言名称（非中文/英文时使用，如日/韩/泰等）';

COMMENT ON COLUMN public.hotel_base_info.hotel_type IS 'HotelType：酒店类型（如：商务/度假/公寓/会议/精品等；建议做字典表）';
COMMENT ON COLUMN public.hotel_base_info.hotel_star IS 'HotelStar：星级（1-5或0表示无评星；建议约束范围）';
COMMENT ON COLUMN public.hotel_base_info.group_code IS 'GroupCode：集团/管理公司编码（集团连锁/管理公司维度）';

COMMENT ON COLUMN public.hotel_base_info.hotel_address IS 'HotelAddress：酒店完整地址（中文）';
COMMENT ON COLUMN public.hotel_base_info.short_hotel_address IS 'ShortHotelAddress：短地址（用于列表/短信等展示）';
COMMENT ON COLUMN public.hotel_base_info.hotel_en_address IS 'HotelEnAddress：酒店英文地址（海外渠道/发票/确认函）';
COMMENT ON COLUMN public.hotel_base_info.post_code IS 'PostCode：邮编';

COMMENT ON COLUMN public.hotel_base_info.mobile_phone IS 'MobilePhone：酒店移动电话/值班手机（一般用于紧急联系）';
COMMENT ON COLUMN public.hotel_base_info.phone IS 'Phone：酒店总机/前台电话（对客展示）';
COMMENT ON COLUMN public.hotel_base_info.email IS 'Email：酒店通用邮箱（对客/对外）';
COMMENT ON COLUMN public.hotel_base_info.fax IS 'Fax：传真（传统对公/合同仍可能使用）';

COMMENT ON COLUMN public.hotel_base_info.land_mark IS 'LandMark：地标信息（用于定位/搜索/对客描述，如“近XX地铁站/景点”）';

COMMENT ON COLUMN public.hotel_base_info.catering IS 'Catering：是否提供餐饮设施/服务（餐厅/早餐等）';
COMMENT ON COLUMN public.hotel_base_info.banquet IS 'Banquet：是否有宴会/会议接待能力（宴会厅/婚宴/大型会议）';

COMMENT ON COLUMN public.hotel_base_info.prompt IS 'Prompt：预订提示/重要须知（入住政策、押金、停车等）';
COMMENT ON COLUMN public.hotel_base_info.hotel_features IS 'HotelFeatures：酒店特色标签（如：亲子/温泉/机场巴士/泳池等，建议结构化标签表）';

COMMENT ON COLUMN public.hotel_base_info.business_area IS 'BusinessArea：商圈/区域描述（用于搜索与运营分析）';
COMMENT ON COLUMN public.hotel_base_info.hotel_area IS 'HotelArea：酒店建筑/营业面积（㎡，口径需定义）';
COMMENT ON COLUMN public.hotel_base_info.meeting_room_area IS 'MeetingRoomArea：会议室面积合计（㎡）';
COMMENT ON COLUMN public.hotel_base_info.the_banquet_area IS 'TheBanquetArea：宴会厅面积合计（㎡）';

COMMENT ON COLUMN public.hotel_base_info.all_room_nums IS 'AllRoomNums：总房数（可售房间数量口径需与PMS统一）';
COMMENT ON COLUMN public.hotel_base_info.use_money IS 'UseMoney：押金/预授权参考金额（如有业务定义；否则可作备用字段）';

COMMENT ON COLUMN public.hotel_base_info.status IS 'Status：业务状态（如：正常/停业/筹备/下线；建议字典化）';
COMMENT ON COLUMN public.hotel_base_info.nearby_hotel IS 'NearbyHotel：周边酒店/竞品信息（运营参考，可存文本或外键关系）';

COMMENT ON COLUMN public.hotel_base_info.hotel_keyword IS 'HotelKeyword：搜索关键字（用于站内检索/SEO）';
COMMENT ON COLUMN public.hotel_base_info."describe" IS 'Describe：酒店描述（中文长文：概况/交通/设施/政策等）';
COMMENT ON COLUMN public.hotel_base_info.remarks IS 'Remarks：内部备注（运营/主数据维护说明）';

COMMENT ON COLUMN public.hotel_base_info.create_date IS 'CreateDate：来源系统创建时间（如来自MDM/老系统）';
COMMENT ON COLUMN public.hotel_base_info.sort IS 'Sort：排序权重（列表展示/运营推荐排序）';
COMMENT ON COLUMN public.hotel_base_info.is_delete IS 'IsDelete：逻辑删除标记（true=已删除/下线）';

COMMENT ON COLUMN public.hotel_base_info.open_date IS 'OpenDate：开业日期（历史开业时间，可能与OpeningDate口径不同）';

COMMENT ON COLUMN public.hotel_base_info.pms_type IS 'PMSType：PMS系统类型/厂商（如OPERA/石基/金天鹅/自研等）';
COMMENT ON COLUMN public.hotel_base_info.restaurant_resv_email IS 'RestaurantResvEmail：餐饮预订邮箱（对客/对渠道）';
COMMENT ON COLUMN public.hotel_base_info.banquet_resv_email IS 'BanquetResvEmail：宴会/会议预订邮箱（对客/销售线索）';

COMMENT ON COLUMN public.hotel_base_info.resv_class IS 'ResvClass：预订分类（直连/分销/团体等；建议字典化）';
COMMENT ON COLUMN public.hotel_base_info.contract_no IS 'ContractNo：合同编号（渠道/集团/企业协议等）';

COMMENT ON COLUMN public.hotel_base_info.display_status IS 'DisplayStatus：展示状态（上架/隐藏/仅内部；与Status区分：Status是业务状态）';
COMMENT ON COLUMN public.hotel_base_info.admin_code IS 'AdminCode：行政区划代码（便于报表/对接政府或集团口径）';

COMMENT ON COLUMN public.hotel_base_info.presale_date IS 'PresaleDate：预售日期（允许开始售卖的日期）';
COMMENT ON COLUMN public.hotel_base_info.opening_date IS 'OpeningDate：正式开业日期（对外营业起始）';

COMMENT ON COLUMN public.hotel_base_info.over_book_status IS 'OverBookStatus：超售策略状态（如允许/不允许/仅部分房型；建议字典化）';

COMMENT ON COLUMN public.hotel_base_info.sales_id IS 'SalesId：销售负责人/销售团队ID（线索归属/业绩归属）';

COMMENT ON COLUMN public.hotel_base_info.rate_code_switch IS 'RateCodeSwitch：房价码开关（是否启用/是否对外可售；具体规则需业务定义）';
COMMENT ON COLUMN public.hotel_base_info.room_type_switch IS 'RoomTypeSwitch：房型开关（是否启用/是否对外可售）';

COMMENT ON COLUMN public.hotel_base_info.best_price_exclusion IS 'BestPriceExclusion：是否排除最优价（如不参与最低价/比价承诺等）';

COMMENT ON COLUMN public.hotel_base_info.area IS 'Area：区域（可为大区/片区/管理区，口径由集团定义）';
COMMENT ON COLUMN public.hotel_base_info.urban_area IS 'UrbanArea：城市片区/城区（如朝阳区/浦东新区等）';

COMMENT ON COLUMN public.hotel_base_info.hotel_brand IS 'HotelBrand：品牌（如万豪/希尔顿/华住等，建议品牌维表）';

COMMENT ON COLUMN public.hotel_base_info.hotel_status_start_date IS 'HotelStatusStartDate：当前状态生效日期（与Status配套）';
COMMENT ON COLUMN public.hotel_base_info.closing_date IS 'ClosingDate：停业/关店日期（若关店）';

COMMENT ON COLUMN public.hotel_base_info.mdm_province IS 'MDMProvince：主数据省份（标准化省份名称/编码）';
COMMENT ON COLUMN public.hotel_base_info.mdm_city IS 'MDMCity：主数据城市（标准化城市名称/编码）';

COMMENT ON COLUMN public.hotel_base_info.hotel_min_price IS 'HotelMinPrice：酒店最低价（用于列表展示/营销；需注明口径：含税/不含税）';

COMMENT ON COLUMN public.hotel_base_info.default_open_sale IS 'DefaultOpenSale：默认开售（新建酒店/新建房型房价默认是否可售）';
COMMENT ON COLUMN public.hotel_base_info.default_roll_price_stock IS 'DefaultRollPriceStock：默认滚动价格库存（如按未来N天自动生成价格库存）';

COMMENT ON COLUMN public.hotel_base_info.describe_en IS 'DescribeEn：酒店英文描述（海外渠道/英文站点）';

COMMENT ON COLUMN public.hotel_base_info.guaranteed_price IS 'GuaranteedPrice：保底价/保底房价（合同或渠道保底口径）';
COMMENT ON COLUMN public.hotel_base_info.best_price_voc_channel_mode IS 'BestPriceVocChannelMode：最优价/渠道比价模式（如仅直销/含分销/按渠道分组等，建议字典化）';

COMMENT ON COLUMN public.hotel_base_info.property_type IS 'PropertyType：资产/物业类型（自持/租赁/管理输出/加盟等；建议字典化）';

-- DBA补充字段注释
COMMENT ON COLUMN public.hotel_base_info.timezone IS '酒店所在时区（如 Asia/Shanghai；跨时区集团非常关键）';
COMMENT ON COLUMN public.hotel_base_info.currency_code IS '结算币种（ISO 4217，如 CNY/USD；用于价格与财务口径）';
COMMENT ON COLUMN public.hotel_base_info.check_in_time IS '标准入住时间（如 14:00；用于确认函/规则校验）';
COMMENT ON COLUMN public.hotel_base_info.check_out_time IS '标准退房时间（如 12:00；用于确认函/规则校验）';
COMMENT ON COLUMN public.hotel_base_info.latitude IS '纬度（用于地图检索/距离计算/附近推荐）';
COMMENT ON COLUMN public.hotel_base_info.longitude IS '经度（用于地图检索/距离计算/附近推荐）';
COMMENT ON COLUMN public.hotel_base_info.city_code IS '城市编码（内部或第三方，如携程/美团/集团城市码；对接必备）';
COMMENT ON COLUMN public.hotel_base_info.country_code IS '国家代码（ISO 3166-1 alpha-2；跨境渠道/税务口径）';
COMMENT ON COLUMN public.hotel_base_info.is_active IS '是否有效（主数据启用标记；与is_delete区分：is_delete偏历史删除）';

-- =====================================================================
-- 约束与索引（DBA建议）
-- =====================================================================

-- 酒店编码唯一（非常关键：对接的自然键）
CREATE UNIQUE INDEX IF NOT EXISTS uq_hotel_base_info_hotel_code
  ON public.hotel_base_info (hotel_code);

-- 常用查询：集团/品牌/城市
CREATE INDEX IF NOT EXISTS idx_hotel_base_info_group
  ON public.hotel_base_info (group_code);

CREATE INDEX IF NOT EXISTS idx_hotel_base_info_brand
  ON public.hotel_base_info (hotel_brand);

CREATE INDEX IF NOT EXISTS idx_hotel_base_info_city
  ON public.hotel_base_info (mdm_city);

-- 维护 updated_at（可选：用触发器自动更新时间）
-- 你如果需要，我可以补一个通用的 updated_at trigger。
