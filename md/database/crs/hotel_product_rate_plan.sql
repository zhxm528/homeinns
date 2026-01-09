-- =====================================================================
-- RatePlan / 商品主数据模型（PostgreSQL）
-- 业务定义（你给的口径）：
-- - “商品” = 酒店 + 房型 + 房价码（RateCode）
-- - 商品可绑定酒店包价（Package）
-- - 同一个商品在不同渠道（Channel）有不同的商品代码（映射）
--
-- 设计思路（酒店行业 DBA 经验）：
-- 1) 商品主表：hotel_product_rate_plan
-- 2) 商品-套餐绑定表：hotel_product_package_map（支持一个商品绑多个包/或主包）
-- 3) 商品-渠道映射表：hotel_product_channel_map（同商品在不同渠道的商品码/售卖状态/上架时间等）
-- 4) 强烈建议所有“码”都保留原始字段：hotel_code / room_type_code / rate_code / package_code，
--    并用 surrogate key(product_id) 做事实表关联
-- =====================================================================

-- 0) 可选依赖：假设你已有这些表（你之前已建）
-- public.hotel_base_info(hotel_code)
-- public.hotel_room_type(hotel_code, room_type_code)
-- public.hotel_rate_code(hotel_code, rate_code)
-- public.hotel_package(hotel_code, package_code)
-- public.sales_channel(channel_code)

-- =====================================================================
-- 1) 商品主表：RatePlan（商品 = 酒店+房型+房价码）
-- =====================================================================

DROP TABLE IF EXISTS public.hotel_product_rate_plan CASCADE;

CREATE TABLE public.hotel_product_rate_plan (
  product_id              bigserial PRIMARY KEY,

  hotel_code              varchar(50) NOT NULL,           -- 酒店
  room_type_code          varchar(50) NOT NULL,           -- 房型
  rate_code               varchar(50) NOT NULL,           -- 房价码

  -- 商品标识/展示
  product_code            varchar(100) NULL,              -- 内部商品编码（可选：便于外部系统/BI使用）
  product_name            text NOT NULL,                  -- 商品名称（通常=房型名+价码名，可运营自定义）
  product_name_en         text NULL,                      -- 英文名（海外渠道）
  product_status          varchar(50) NOT NULL DEFAULT 'active', -- active/hidden/inactive

  -- 商品售卖期（商品级控制；最终仍会被价码/套餐/渠道规则叠加）
  sale_begin_at           timestamptz(3) NULL,
  sale_end_at             timestamptz(3) NULL,

  -- 可入住期（限制入住日期范围）
  stay_begin_date         date NULL,
  stay_end_date           date NULL,

  -- 商品默认规则（兜底；最终以 rate_code / package / channel 叠加或覆盖）
  min_los                 integer NULL,
  max_los                 integer NULL,
  min_adv_booking_days    integer NULL,
  max_adv_booking_days    integer NULL,
  week_control            varchar(20) NULL,               -- 1111100 之类（口径自定）
  is_refundable           boolean NULL,
  cancel_policy_code      varchar(50) NULL,
  guarantee_type          varchar(50) NULL,               -- none/credit_card/prepay
  payment_type            varchar(50) NULL,               -- pay_at_hotel/prepay/partial

  -- 价格口径（商品层兜底；最终价格在“日历价/库存价表”）
  currency_code           char(3) NULL,
  tax_included            boolean NULL,
  service_fee_included    boolean NULL,

  -- 运营与说明
  short_info              text NULL,
  long_info               text NULL,
  tags_json               jsonb NULL,                     -- 标签：如“含早/可退/连住优惠”等
  notes                   text NULL,                      -- 内部备注

  -- DBA审计
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  created_by              text NULL,
  updated_by              text NULL
);

COMMENT ON TABLE public.hotel_product_rate_plan IS
'RatePlan商品主表：每个商品由 hotel_code + room_type_code + rate_code 组成。用于统一管理可售商品及其默认规则（售卖期/可入住期/LOS/提前预订/取消担保等）。实际价格与库存建议在日历价/库存表中维护。';

COMMENT ON COLUMN public.hotel_product_rate_plan.product_id IS '主键（商品ID，用于事实表关联）';
COMMENT ON COLUMN public.hotel_product_rate_plan.hotel_code IS '酒店编码（HotelCode）';
COMMENT ON COLUMN public.hotel_product_rate_plan.room_type_code IS '房型编码（RoomTypeCode）';
COMMENT ON COLUMN public.hotel_product_rate_plan.rate_code IS '房价码（RateCode / Rate Plan Code）';

COMMENT ON COLUMN public.hotel_product_rate_plan.product_code IS '内部商品编码（可选：用于对接/报表，建议全局唯一或按酒店唯一）';
COMMENT ON COLUMN public.hotel_product_rate_plan.product_name IS '商品名称（对客展示；可由房型名+价码名生成，也可运营手动改）';
COMMENT ON COLUMN public.hotel_product_rate_plan.product_name_en IS '商品英文名（海外渠道展示）';
COMMENT ON COLUMN public.hotel_product_rate_plan.product_status IS '商品状态（active/hidden/inactive：上架/隐藏/下线）';

COMMENT ON COLUMN public.hotel_product_rate_plan.sale_begin_at IS '售卖开始时间（从何时起允许下单）';
COMMENT ON COLUMN public.hotel_product_rate_plan.sale_end_at IS '售卖结束时间（何时停止下单）';
COMMENT ON COLUMN public.hotel_product_rate_plan.stay_begin_date IS '可入住开始日期（限制入住范围）';
COMMENT ON COLUMN public.hotel_product_rate_plan.stay_end_date IS '可入住结束日期（限制入住范围）';

COMMENT ON COLUMN public.hotel_product_rate_plan.min_los IS '最少连住晚数（商品层兜底）';
COMMENT ON COLUMN public.hotel_product_rate_plan.max_los IS '最多连住晚数（商品层兜底）';
COMMENT ON COLUMN public.hotel_product_rate_plan.min_adv_booking_days IS '最少提前预订天数（商品层兜底）';
COMMENT ON COLUMN public.hotel_product_rate_plan.max_adv_booking_days IS '最多提前预订天数（商品层兜底）';
COMMENT ON COLUMN public.hotel_product_rate_plan.week_control IS '周几可用控制（如1111100；需定义口径与时区）';
COMMENT ON COLUMN public.hotel_product_rate_plan.is_refundable IS '是否可退（商品层兜底；最终以价码/套餐/渠道政策为准）';
COMMENT ON COLUMN public.hotel_product_rate_plan.cancel_policy_code IS '取消政策码（建议关联取消政策表；此处存码做兜底）';
COMMENT ON COLUMN public.hotel_product_rate_plan.guarantee_type IS '担保类型（none/credit_card/prepay；影响下单/担保链路）';
COMMENT ON COLUMN public.hotel_product_rate_plan.payment_type IS '支付类型（pay_at_hotel/prepay/partial；影响支付链路）';

COMMENT ON COLUMN public.hotel_product_rate_plan.currency_code IS '币种（ISO 4217；对账/跨境渠道关键）';
COMMENT ON COLUMN public.hotel_product_rate_plan.tax_included IS '是否含税（口径关键：展示价/结算价）';
COMMENT ON COLUMN public.hotel_product_rate_plan.service_fee_included IS '是否含服务费（口径关键）';

COMMENT ON COLUMN public.hotel_product_rate_plan.short_info IS '短说明（对客列表/卡片展示）';
COMMENT ON COLUMN public.hotel_product_rate_plan.long_info IS '长说明（权益/政策/限制说明）';
COMMENT ON COLUMN public.hotel_product_rate_plan.tags_json IS '标签（jsonb：便于过滤与运营，如["含早","可退"]）';
COMMENT ON COLUMN public.hotel_product_rate_plan.notes IS '内部备注（运营/主数据维护）';

COMMENT ON COLUMN public.hotel_product_rate_plan.created_at IS '创建时间（审计）';
COMMENT ON COLUMN public.hotel_product_rate_plan.updated_at IS '更新时间（审计）';
COMMENT ON COLUMN public.hotel_product_rate_plan.created_by IS '创建人/系统';
COMMENT ON COLUMN public.hotel_product_rate_plan.updated_by IS '更新人/系统';

-- 约束与索引（DBA建议）
ALTER TABLE public.hotel_product_rate_plan
  ADD CONSTRAINT ck_hprp_sale_range
  CHECK (sale_begin_at IS NULL OR sale_end_at IS NULL OR sale_begin_at <= sale_end_at);

ALTER TABLE public.hotel_product_rate_plan
  ADD CONSTRAINT ck_hprp_stay_range
  CHECK (stay_begin_date IS NULL OR stay_end_date IS NULL OR stay_begin_date <= stay_end_date);

ALTER TABLE public.hotel_product_rate_plan
  ADD CONSTRAINT ck_hprp_los
  CHECK (
    (min_los IS NULL OR min_los >= 0) AND
    (max_los IS NULL OR max_los >= 0) AND
    (min_los IS NULL OR max_los IS NULL OR min_los <= max_los)
  );

ALTER TABLE public.hotel_product_rate_plan
  ADD CONSTRAINT ck_hprp_adv
  CHECK (
    (min_adv_booking_days IS NULL OR min_adv_booking_days >= 0) AND
    (max_adv_booking_days IS NULL OR max_adv_booking_days >= 0) AND
    (min_adv_booking_days IS NULL OR max_adv_booking_days IS NULL OR min_adv_booking_days <= max_adv_booking_days)
  );

-- 同一酒店下：房型+价码 组合唯一 = 一个商品
CREATE UNIQUE INDEX IF NOT EXISTS uq_hprp_hotel_room_rate
  ON public.hotel_product_rate_plan (hotel_code, room_type_code, rate_code);

CREATE INDEX IF NOT EXISTS idx_hprp_hotel_status
  ON public.hotel_product_rate_plan (hotel_code, product_status);

CREATE INDEX IF NOT EXISTS idx_hprp_hotel_sale
  ON public.hotel_product_rate_plan (hotel_code, sale_begin_at, sale_end_at);

-- =====================================================================
-- 2) 商品绑定酒店包价（一个商品可绑多个包价；可标记主包/叠加规则）
-- =====================================================================

DROP TABLE IF EXISTS public.hotel_product_package_map CASCADE;

CREATE TABLE public.hotel_product_package_map (
  product_id         bigint NOT NULL REFERENCES public.hotel_product_rate_plan(product_id) ON DELETE CASCADE,
  package_code       varchar(10) NOT NULL,                 -- 绑定的套餐编码
  hotel_code         varchar(50) NULL,                     -- 冗余：便于校验/查询（可与package表一致）

  is_primary         boolean NOT NULL DEFAULT false,        -- 是否主绑定套餐（一个商品可指定一个主包）
  is_optional        boolean NOT NULL DEFAULT false,        -- 是否可选加购（false=该商品即包含该套餐；true=可选加购）
  stack_rule         varchar(50) NULL,                      -- 叠加规则：exclusive/stackable/choose_one 等

  begin_at           timestamptz(3) NULL,                   -- 绑定关系生效期（可选）
  end_at             timestamptz(3) NULL,

  created_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.hotel_product_package_map IS
'商品-包价绑定表：定义某个商品可绑定哪些酒店套餐（包价）。支持主包/可选加购/叠加规则，以及绑定关系的生效期。';

COMMENT ON COLUMN public.hotel_product_package_map.product_id IS '商品ID（引用 hotel_product_rate_plan）';
COMMENT ON COLUMN public.hotel_product_package_map.package_code IS '套餐编码（PackageCode）';
COMMENT ON COLUMN public.hotel_product_package_map.hotel_code IS '酒店编码（冗余字段：用于校验 package 与 product 是否同酒店/或集团通用）';
COMMENT ON COLUMN public.hotel_product_package_map.is_primary IS '是否主绑定套餐（用于“该商品默认包含的套餐”）';
COMMENT ON COLUMN public.hotel_product_package_map.is_optional IS '是否可选加购（true=加购项；false=包含项）';
COMMENT ON COLUMN public.hotel_product_package_map.stack_rule IS '叠加规则（exclusive/stackable/choose_one等，需业务字典）';
COMMENT ON COLUMN public.hotel_product_package_map.begin_at IS '绑定生效开始时间（可选）';
COMMENT ON COLUMN public.hotel_product_package_map.end_at IS '绑定生效结束时间（可选）';
COMMENT ON COLUMN public.hotel_product_package_map.created_at IS '创建时间（审计）';

ALTER TABLE public.hotel_product_package_map
  ADD CONSTRAINT ck_hppm_range CHECK (begin_at IS NULL OR end_at IS NULL OR begin_at <= end_at);

-- 一个商品同一个套餐只绑一次
CREATE UNIQUE INDEX IF NOT EXISTS uq_hppm_product_package
  ON public.hotel_product_package_map (product_id, package_code);

-- 可选：保证一个商品只有一个主包（部分业务需要）
CREATE UNIQUE INDEX IF NOT EXISTS uq_hppm_product_primary
  ON public.hotel_product_package_map (product_id)
  WHERE is_primary = true;

-- =====================================================================
-- 3) 商品在各渠道的映射（同商品不同渠道不同“商品码/售卖状态/上下架时间/渠道价码/渠道房型码”）
-- =====================================================================

DROP TABLE IF EXISTS public.hotel_product_channel_map CASCADE;

CREATE TABLE public.hotel_product_channel_map (
  product_id            bigint NOT NULL REFERENCES public.hotel_product_rate_plan(product_id) ON DELETE CASCADE,
  channel_code          varchar(50) NOT NULL,             -- 渠道（引用 sales_channel.channel_code，先不强制外键，避免初始化顺序问题）

  -- 渠道侧商品识别（关键）
  channel_product_code  varchar(100) NOT NULL,            -- 渠道侧商品码（同商品在不同渠道不同）
  channel_product_name  text NULL,                        -- 渠道侧商品名（有些渠道要单独维护）
  channel_room_type_code varchar(100) NULL,               -- 渠道侧房型码（若渠道要求房型码映射）
  channel_rate_code     varchar(100) NULL,                -- 渠道侧价码/产品码（若渠道有自己的rate code）

  -- 渠道侧售卖控制（渠道常有单独上下架）
  is_active             boolean NOT NULL DEFAULT true,    -- 渠道映射是否启用
  is_bookable           boolean NOT NULL DEFAULT true,    -- 渠道是否可售
  channel_status        varchar(50) NULL,                 -- 渠道状态：active/hidden/inactive（可选）

  online_begin_at       timestamptz(3) NULL,              -- 渠道上架时间
  online_end_at         timestamptz(3) NULL,              -- 渠道下架时间

  -- 渠道政策覆盖（常见：同商品在某渠道不可退、需预付、佣金不同）
  refundable_override   boolean NULL,
  cancel_policy_code_override varchar(50) NULL,
  guarantee_type_override varchar(50) NULL,
  payment_type_override  varchar(50) NULL,

  commission_mode_override  varchar(50) NULL,             -- 渠道或该商品在渠道上的佣金模式覆盖
  commission_value_override numeric(10,4) NULL,           -- 佣金覆盖值（口径需统一）

  extra_json            jsonb NULL,                        -- 预留：渠道特有字段（早餐展示、卖点标签、促销标识等）

  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.hotel_product_channel_map IS
'商品-渠道映射表：同一个商品在不同渠道有不同商品码（channel_product_code）。同时可记录渠道侧房型码/价码映射、渠道上架下架时间、以及渠道政策（可退/取消/担保/支付/佣金）覆盖。';

COMMENT ON COLUMN public.hotel_product_channel_map.product_id IS '商品ID（引用 hotel_product_rate_plan）';
COMMENT ON COLUMN public.hotel_product_channel_map.channel_code IS '渠道码（建议关联 sales_channel.channel_code）';

COMMENT ON COLUMN public.hotel_product_channel_map.channel_product_code IS '渠道侧商品编码（同商品在不同渠道不同，核心字段）';
COMMENT ON COLUMN public.hotel_product_channel_map.channel_product_name IS '渠道侧商品名称（可选：渠道展示名/营销名）';
COMMENT ON COLUMN public.hotel_product_channel_map.channel_room_type_code IS '渠道侧房型码（渠道要求的房型映射码）';
COMMENT ON COLUMN public.hotel_product_channel_map.channel_rate_code IS '渠道侧价码/产品码（渠道内部定义的rate/product code）';

COMMENT ON COLUMN public.hotel_product_channel_map.is_active IS '映射是否启用（不启用则不参与分发/对账）';
COMMENT ON COLUMN public.hotel_product_channel_map.is_bookable IS '渠道是否可售（可单独关某渠道的商品）';
COMMENT ON COLUMN public.hotel_product_channel_map.channel_status IS '渠道侧状态（active/hidden/inactive，可选）';
COMMENT ON COLUMN public.hotel_product_channel_map.online_begin_at IS '渠道上架时间（从此时间起对该渠道开放）';
COMMENT ON COLUMN public.hotel_product_channel_map.online_end_at IS '渠道下架时间（到此时间停止对该渠道开放）';

COMMENT ON COLUMN public.hotel_product_channel_map.refundable_override IS '渠道政策覆盖：是否可退（覆盖商品默认）';
COMMENT ON COLUMN public.hotel_product_channel_map.cancel_policy_code_override IS '渠道政策覆盖：取消政策码';
COMMENT ON COLUMN public.hotel_product_channel_map.guarantee_type_override IS '渠道政策覆盖：担保类型';
COMMENT ON COLUMN public.hotel_product_channel_map.payment_type_override IS '渠道政策覆盖：支付类型';

COMMENT ON COLUMN public.hotel_product_channel_map.commission_mode_override IS '该商品在该渠道的佣金模式覆盖（percent/fixed/none）';
COMMENT ON COLUMN public.hotel_product_channel_map.commission_value_override IS '该商品在该渠道的佣金值覆盖（口径需统一）';

COMMENT ON COLUMN public.hotel_product_channel_map.extra_json IS '渠道特有扩展字段（jsonb：促销标识/卖点/展示标签等）';
COMMENT ON COLUMN public.hotel_product_channel_map.created_at IS '创建时间（审计）';
COMMENT ON COLUMN public.hotel_product_channel_map.updated_at IS '更新时间（审计）';

ALTER TABLE public.hotel_product_channel_map
  ADD CONSTRAINT ck_hpcm_online_range
  CHECK (online_begin_at IS NULL OR online_end_at IS NULL OR online_begin_at <= online_end_at);

ALTER TABLE public.hotel_product_channel_map
  ADD CONSTRAINT ck_hpcm_commission_nonneg
  CHECK (commission_value_override IS NULL OR commission_value_override >= 0);

-- 同一商品在同一渠道只能有一条映射
CREATE UNIQUE INDEX IF NOT EXISTS uq_hpcm_product_channel
  ON public.hotel_product_channel_map (product_id, channel_code);

-- 同一渠道商品码唯一（通常要求；不同酒店的渠道商品码是否会冲突取决于渠道，这里建议加 hotel_code 维度）
-- 更稳做法：把 hotel_code 冗余到映射表；这里用product_id关联可查，但索引不直观。
-- 若你希望强约束“同渠道商品码全局唯一”，可启用下行索引：
CREATE UNIQUE INDEX IF NOT EXISTS uq_hpcm_channel_product_code
  ON public.hotel_product_channel_map (channel_code, channel_product_code);

-- =====================================================================
-- 4) （可选但强烈建议）补充：商品日历价/库存表（否则无法真正“卖”）
--    你没要求我建，但从行业落地角度，RatePlan必须配套“每日价/库存”。
--    需要的话我可以再给：
--    - hotel_product_daily_rate (product_id, stay_date, price, currency, tax_included...)
--    - hotel_product_daily_inventory (product_id, stay_date, allotment, stop_sell, close_to_arrival/close_to_departure...)
-- =====================================================================

-- =====================================================================
-- 可选外键（如果你希望强关联到已建主数据表）
-- 注意：需要保证对应表存在且字段名一致
-- =====================================================================

-- 1) hotel_code 外键（酒店基础信息）
-- ALTER TABLE public.hotel_product_rate_plan
--   ADD CONSTRAINT fk_hprp_hotel
--   FOREIGN KEY (hotel_code) REFERENCES public.hotel_base_info(hotel_code);

-- 2) 房型：因为房型表通常是 (hotel_code, room_type_code) 唯一，建议用复合外键
-- ALTER TABLE public.hotel_product_rate_plan
--   ADD CONSTRAINT fk_hprp_room_type
--   FOREIGN KEY (hotel_code, room_type_code) REFERENCES public.hotel_room_type(hotel_code, room_type_code);

-- 3) 价码：同理 (hotel_code, rate_code)
-- ALTER TABLE public.hotel_product_rate_plan
--   ADD CONSTRAINT fk_hprp_rate_code
--   FOREIGN KEY (hotel_code, rate_code) REFERENCES public.hotel_rate_code(hotel_code, rate_code);

-- 4) 渠道：channel_code
-- ALTER TABLE public.hotel_product_channel_map
--   ADD CONSTRAINT fk_hpcm_channel
--   FOREIGN KEY (channel_code) REFERENCES public.sales_channel(channel_code);

-- 5) 套餐：若 hotel_package 里 package_code + hotel_code 唯一，可做外键（需你表结构一致）
-- ALTER TABLE public.hotel_product_package_map
--   ADD CONSTRAINT fk_hppm_package
--   FOREIGN KEY (package_code) REFERENCES public.hotel_package(package_code);
