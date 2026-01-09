-- =====================================================================
-- 渠道维表 / 渠道主数据表 (PostgreSQL)
-- 表名：public.sales_channel
-- 设计目标（酒店行业 DBA 经验）：
-- - 统一管理渠道主数据：直销/OTA/批发/企业/会务/旅行社/分销平台等
-- - 支持渠道映射：同一渠道在 CRS/PMS/Channel Manager/OTA 后台可能有不同编码
-- - 支持结算与佣金：结算周期、佣金模式、含税/服务费口径、币种
-- - 支持分发控制：是否可售、是否参与最优价、是否允许超售、是否支持担保/预付
-- - 支持对接信息：API/推送方式、回调地址、联系人、对接状态
-- =====================================================================

DROP TABLE IF EXISTS public.sales_channel CASCADE;

CREATE TABLE public.sales_channel (
  -- 主键与审计字段
  channel_id                 bigserial PRIMARY KEY,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  updated_at                 timestamptz NOT NULL DEFAULT now(),
  created_by                 text NULL,
  updated_by                 text NULL,

  -- 渠道识别（强烈建议）
  channel_code               varchar(50) NOT NULL,                 -- 内部统一渠道码（全系统唯一）
  channel_name               text NOT NULL,                        -- 渠道名称（中文）
  channel_name_en            text NULL,                            -- 渠道英文名（可选）
  channel_short_name         varchar(100) NULL,                    -- 渠道简称（报表/看板常用）
  channel_type               varchar(50) NOT NULL,                 -- 渠道类型：direct/ota/wholesale/corporate/gds/ta/metasearch/other
  channel_level              smallint NULL,                        -- 渠道层级：1一级渠道/2子渠道/3子子渠道（如集团->平台->门店）

  -- 组织关系（有些集团需要“渠道树”）
  parent_channel_id          bigint NULL REFERENCES public.sales_channel(channel_id),

  -- 业务启用/展示控制
  is_active                  boolean NOT NULL DEFAULT true,        -- 是否启用（主开关）
  is_visible                 boolean NOT NULL DEFAULT true,        -- 是否对客可见（部分渠道是内部/对账用）
  is_bookable                boolean NOT NULL DEFAULT true,        -- 是否允许下单（关停渠道不一定等于删除）
  display_sort               integer NULL,                         -- 展示排序/报表排序

  -- 结算与佣金（酒店行业强需求）
  settlement_mode            varchar(50) NULL,                     -- 结算模式：merchant/agency/direct_bill/other
  commission_mode            varchar(50) NULL,                     -- 佣金模式：percent/fixed/none/mixed
  commission_value           numeric(10,4) NULL,                   -- 佣金值（percent用0.10=10% 或直接存10需统一口径）
  settlement_cycle           varchar(50) NULL,                     -- 结算周期：daily/weekly/biweekly/monthly
  invoice_required           boolean NULL,                          -- 是否需要开票/对账单
  currency_code              char(3) NULL,                          -- 结算币种（ISO 4217）

  -- 价格与税费口径（经常踩坑：渠道展示价/结算价不一致）
  tax_included               boolean NULL,                          -- 渠道侧价格是否含税
  service_fee_included       boolean NULL,                          -- 是否含服务费
  price_display_mode         varchar(50) NULL,                      -- 价格展示模式：per_room/per_person/per_night/package等
  best_price_eligible        boolean NULL,                          -- 是否参与最优价/比价（如部分批发不参与）
  allow_discount_stack       boolean NULL,                          -- 是否允许叠加优惠（券/会员/活动）
  rate_plan_policy_mode      varchar(50) NULL,                      -- 渠道侧价格计划政策：follow_rate_plan/override_channel_policy

  -- 库存与限制（渠道分发控制）
  inventory_mode             varchar(50) NULL,                      -- 库存模式：shared/allocated/unlimited
  default_allotment_qty      integer NULL,                          -- 默认配额（allocated时）
  allow_overbooking          boolean NULL,                          -- 是否允许超售（渠道级别策略）
  min_los_default            integer NULL,                          -- 默认最少连住限制（可由价码覆盖）
  max_los_default            integer NULL,                          -- 默认最多连住限制（可由价码覆盖）
  min_adv_booking_days_default integer NULL,                         -- 默认最少提前预订天数
  max_adv_booking_days_default integer NULL,                         -- 默认最多提前预订天数

  -- 对接与映射（渠道在不同系统的编码）
  external_codes_json        jsonb NULL,                            -- 外部系统渠道码映射：{ "CRS":"", "PMS":"", "CM":"", "OTA_X":"..." }
  integration_type           varchar(50) NULL,                      -- 对接类型：api/file/gds/manual/channel_manager
  integration_status         varchar(50) NULL,                      -- 对接状态：not_integrated/testing/live/suspended
  endpoint_url               text NULL,                             -- API endpoint（若有）
  callback_url               text NULL,                             -- 回调地址（若有）
  auth_mode                  varchar(50) NULL,                      -- 鉴权方式：apikey/oauth/basic/signature
  auth_secret_ref            text NULL,                             -- 密钥引用（不要存明文；存 vault key/path）

  -- 联系与运营信息
  account_manager            varchar(100) NULL,                     -- 渠道对接/商务负责人
  contact_name               varchar(100) NULL,
  contact_phone              varchar(50) NULL,
  contact_email              varchar(254) NULL,
  contract_no                varchar(100) NULL,                     -- 合同号
  contract_start_date        date NULL,
  contract_end_date          date NULL,
  notes                      text NULL                              -- 备注
);

-- =====================================================================
-- 注释
-- =====================================================================

COMMENT ON TABLE public.sales_channel IS
'销售渠道主数据表（Channel Master）：统一存储直销/OTA/批发/企业/GDS/旅行社/会务等渠道信息，覆盖渠道识别、层级关系、可售/展示控制、结算与佣金、价格税费口径、库存与限制、以及对接映射信息。';

COMMENT ON COLUMN public.sales_channel.channel_id IS '主键ID（自增）';
COMMENT ON COLUMN public.sales_channel.created_at IS '创建时间（审计字段）';
COMMENT ON COLUMN public.sales_channel.updated_at IS '更新时间（审计字段）';
COMMENT ON COLUMN public.sales_channel.created_by IS '创建人/创建系统';
COMMENT ON COLUMN public.sales_channel.updated_by IS '更新人/更新系统';

COMMENT ON COLUMN public.sales_channel.channel_code IS '内部统一渠道码（全系统唯一；建议用于事实表关联）';
COMMENT ON COLUMN public.sales_channel.channel_name IS '渠道中文名称（对内/对外展示）';
COMMENT ON COLUMN public.sales_channel.channel_name_en IS '渠道英文名称（可选）';
COMMENT ON COLUMN public.sales_channel.channel_short_name IS '渠道简称（报表/仪表盘显示更友好）';
COMMENT ON COLUMN public.sales_channel.channel_type IS '渠道类型：direct(直销)/ota/wholesale(批发)/corporate(企业)/gds/ta(旅行社)/metasearch/other';
COMMENT ON COLUMN public.sales_channel.channel_level IS '渠道层级（如集团->平台->子渠道/门店，用于渠道树）';
COMMENT ON COLUMN public.sales_channel.parent_channel_id IS '父渠道ID（用于构建渠道树/归因口径）';

COMMENT ON COLUMN public.sales_channel.is_active IS '是否启用（主开关；停用后通常不再参与分发/对账）';
COMMENT ON COLUMN public.sales_channel.is_visible IS '是否对客可见（部分渠道仅用于内部或财务对账）';
COMMENT ON COLUMN public.sales_channel.is_bookable IS '是否允许下单（可售开关；与is_active不同）';
COMMENT ON COLUMN public.sales_channel.display_sort IS '排序（列表/报表展示排序）';

COMMENT ON COLUMN public.sales_channel.settlement_mode IS '结算模式：merchant(代收代付)/agency(到店付)/direct_bill(挂账)/other';
COMMENT ON COLUMN public.sales_channel.commission_mode IS '佣金模式：percent(比例)/fixed(固定)/none/mixed';
COMMENT ON COLUMN public.sales_channel.commission_value IS '佣金值（口径需统一：建议比例用0.10表示10%）';
COMMENT ON COLUMN public.sales_channel.settlement_cycle IS '结算周期：daily/weekly/biweekly/monthly（用于财务对账）';
COMMENT ON COLUMN public.sales_channel.invoice_required IS '是否需要开票/对账单（渠道结算常见要求）';
COMMENT ON COLUMN public.sales_channel.currency_code IS '结算币种（ISO 4217，如CNY/USD）';

COMMENT ON COLUMN public.sales_channel.tax_included IS '渠道价格是否含税（展示价/结算价口径关键）';
COMMENT ON COLUMN public.sales_channel.service_fee_included IS '渠道价格是否含服务费（口径关键）';
COMMENT ON COLUMN public.sales_channel.price_display_mode IS '价格展示模式：per_room/per_person/per_night/package等';
COMMENT ON COLUMN public.sales_channel.best_price_eligible IS '是否参与最优价/比价（批发/协议价通常不参与）';
COMMENT ON COLUMN public.sales_channel.allow_discount_stack IS '是否允许叠加优惠（券/会员/活动；渠道政策差异常见）';
COMMENT ON COLUMN public.sales_channel.rate_plan_policy_mode IS '价码政策模式：follow_rate_plan(跟随价码)/override_channel_policy(渠道覆盖)';

COMMENT ON COLUMN public.sales_channel.inventory_mode IS '库存模式：shared(共享)/allocated(配额)/unlimited(不控量)';
COMMENT ON COLUMN public.sales_channel.default_allotment_qty IS '默认配额数量（配额模式下使用）';
COMMENT ON COLUMN public.sales_channel.allow_overbooking IS '是否允许超售（渠道级策略；也可由酒店/房型覆盖）';
COMMENT ON COLUMN public.sales_channel.min_los_default IS '默认最少连住限制（若价码未配置时兜底）';
COMMENT ON COLUMN public.sales_channel.max_los_default IS '默认最多连住限制（兜底）';
COMMENT ON COLUMN public.sales_channel.min_adv_booking_days_default IS '默认最少提前预订天数（兜底）';
COMMENT ON COLUMN public.sales_channel.max_adv_booking_days_default IS '默认最多提前预订天数（兜底）';

COMMENT ON COLUMN public.sales_channel.external_codes_json IS '外部系统映射码（jsonb：CRS/PMS/Channel Manager/各OTA后台编码）';
COMMENT ON COLUMN public.sales_channel.integration_type IS '对接类型：api/file/gds/manual/channel_manager';
COMMENT ON COLUMN public.sales_channel.integration_status IS '对接状态：not_integrated/testing/live/suspended';
COMMENT ON COLUMN public.sales_channel.endpoint_url IS 'API Endpoint（若渠道对接使用API）';
COMMENT ON COLUMN public.sales_channel.callback_url IS '回调地址（订单/库存/价格变更推送回调）';
COMMENT ON COLUMN public.sales_channel.auth_mode IS '鉴权方式：apikey/oauth/basic/signature';
COMMENT ON COLUMN public.sales_channel.auth_secret_ref IS '鉴权密钥引用（不要存明文，存密钥管理系统的引用）';

COMMENT ON COLUMN public.sales_channel.account_manager IS '渠道商务/对接负责人（用于协同与问题处理）';
COMMENT ON COLUMN public.sales_channel.contact_name IS '渠道联系人姓名';
COMMENT ON COLUMN public.sales_channel.contact_phone IS '渠道联系人电话';
COMMENT ON COLUMN public.sales_channel.contact_email IS '渠道联系人邮箱';
COMMENT ON COLUMN public.sales_channel.contract_no IS '渠道合同编号（对账/法务常用）';
COMMENT ON COLUMN public.sales_channel.contract_start_date IS '合同开始日期';
COMMENT ON COLUMN public.sales_channel.contract_end_date IS '合同结束日期';
COMMENT ON COLUMN public.sales_channel.notes IS '备注（渠道政策/特殊约定/注意事项）';

-- =====================================================================
-- 索引与约束（DBA建议）
-- =====================================================================

-- channel_code 全局唯一
CREATE UNIQUE INDEX IF NOT EXISTS uq_sales_channel_code
  ON public.sales_channel (channel_code);

-- 常用过滤：类型/状态
CREATE INDEX IF NOT EXISTS idx_sales_channel_type_active
  ON public.sales_channel (channel_type, is_active, is_bookable);

-- 结算/佣金相关分析常用
CREATE INDEX IF NOT EXISTS idx_sales_channel_settlement
  ON public.sales_channel (settlement_mode, commission_mode);

-- 合同期查询（到期提醒）
CREATE INDEX IF NOT EXISTS idx_sales_channel_contract_end
  ON public.sales_channel (contract_end_date);

-- （可选）基础校验
ALTER TABLE public.sales_channel
  ADD CONSTRAINT ck_sales_channel_commission_nonneg
  CHECK (commission_value IS NULL OR commission_value >= 0);

ALTER TABLE public.sales_channel
  ADD CONSTRAINT ck_sales_channel_allotment_nonneg
  CHECK (default_allotment_qty IS NULL OR default_allotment_qty >= 0);
