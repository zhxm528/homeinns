-- =====================================================================
-- 商品价格库存（按日）+ 分层房态开关（按日）方案（PostgreSQL）
-- 要求：所有 DROP TABLE 放在最前面 ✅
-- =====================================================================

-- =========================
-- 0) 先全部 DROP（最前面）
-- =========================
DROP TABLE IF EXISTS public.product_daily_price_inventory CASCADE;
DROP TABLE IF EXISTS public.rate_code_day_open_switch CASCADE;
DROP TABLE IF EXISTS public.room_type_day_open_switch CASCADE;
DROP TABLE IF EXISTS public.hotel_day_open_switch CASCADE;

-- =====================================================================
-- 1) 酒店层：每日房态主开关（hotel + date）
-- =====================================================================
CREATE TABLE public.hotel_day_open_switch (
  hotel_code   varchar(50) NOT NULL,
  stay_date    date        NOT NULL,

  is_open      boolean     NOT NULL DEFAULT true,  -- 主房态开关（酒店层）
  reason       text        NULL,                   -- 关闭原因/备注（如停业、满房、系统维护）

  updated_at   timestamptz NOT NULL DEFAULT now(),
  updated_by   text        NULL,

  CONSTRAINT pk_hotel_day_open_switch PRIMARY KEY (hotel_code, stay_date)
) PARTITION BY RANGE (stay_date);

COMMENT ON TABLE public.hotel_day_open_switch IS '酒店层每日房态主开关：用于控制某酒店在某日是否允许售卖（主开关）。';
COMMENT ON COLUMN public.hotel_day_open_switch.hotel_code IS '酒店编码（HotelCode）。';
COMMENT ON COLUMN public.hotel_day_open_switch.stay_date IS '入住日期/房态日期（按“入住日”维度控制）。';
COMMENT ON COLUMN public.hotel_day_open_switch.is_open IS '酒店层主房态开关：true=开售，false=关售（只存主开关）。';
COMMENT ON COLUMN public.hotel_day_open_switch.reason IS '关售原因/备注（可选）。';
COMMENT ON COLUMN public.hotel_day_open_switch.updated_at IS '更新时间（审计字段）。';
COMMENT ON COLUMN public.hotel_day_open_switch.updated_by IS '更新人/系统（审计字段）。';

CREATE INDEX IF NOT EXISTS idx_hotel_day_open_switch_date
  ON public.hotel_day_open_switch (stay_date);

CREATE TABLE IF NOT EXISTS public.hotel_day_open_switch_default
  PARTITION OF public.hotel_day_open_switch DEFAULT;

-- =====================================================================
-- 2) 房型层：每日房态主开关（hotel + room_type + date）
-- =====================================================================
CREATE TABLE public.room_type_day_open_switch (
  hotel_code      varchar(50) NOT NULL,
  room_type_code  varchar(50) NOT NULL,
  stay_date       date        NOT NULL,

  is_open         boolean     NOT NULL DEFAULT true,  -- 主房态开关（房型层）
  reason          text        NULL,

  updated_at      timestamptz NOT NULL DEFAULT now(),
  updated_by      text        NULL,

  CONSTRAINT pk_room_type_day_open_switch PRIMARY KEY (hotel_code, room_type_code, stay_date)
) PARTITION BY RANGE (stay_date);

COMMENT ON TABLE public.room_type_day_open_switch IS '房型层每日房态主开关：用于控制某酒店某房型在某日是否可售（主开关）。';
COMMENT ON COLUMN public.room_type_day_open_switch.hotel_code IS '酒店编码（HotelCode）。';
COMMENT ON COLUMN public.room_type_day_open_switch.room_type_code IS '房型编码（RoomTypeCode）。';
COMMENT ON COLUMN public.room_type_day_open_switch.stay_date IS '入住日期/房态日期。';
COMMENT ON COLUMN public.room_type_day_open_switch.is_open IS '房型层主房态开关：true=开售，false=关售（只存主开关）。';
COMMENT ON COLUMN public.room_type_day_open_switch.reason IS '关售原因/备注（可选）。';
COMMENT ON COLUMN public.room_type_day_open_switch.updated_at IS '更新时间（审计字段）。';
COMMENT ON COLUMN public.room_type_day_open_switch.updated_by IS '更新人/系统（审计字段）。';

CREATE INDEX IF NOT EXISTS idx_room_type_day_open_switch_date
  ON public.room_type_day_open_switch (stay_date);

CREATE TABLE IF NOT EXISTS public.room_type_day_open_switch_default
  PARTITION OF public.room_type_day_open_switch DEFAULT;

-- =====================================================================
-- 3) 房价码层：每日房态主开关（hotel + rate_code + date）
-- =====================================================================
CREATE TABLE public.rate_code_day_open_switch (
  hotel_code   varchar(50) NOT NULL,
  rate_code    varchar(50) NOT NULL,
  stay_date    date        NOT NULL,

  is_open      boolean     NOT NULL DEFAULT true,  -- 主房态开关（房价码层）
  reason       text        NULL,

  updated_at   timestamptz NOT NULL DEFAULT now(),
  updated_by   text        NULL,

  CONSTRAINT pk_rate_code_day_open_switch PRIMARY KEY (hotel_code, rate_code, stay_date)
) PARTITION BY RANGE (stay_date);

COMMENT ON TABLE public.rate_code_day_open_switch IS '房价码层每日房态主开关：用于控制某酒店某价码在某日是否可售（主开关）。';
COMMENT ON COLUMN public.rate_code_day_open_switch.hotel_code IS '酒店编码（HotelCode）。';
COMMENT ON COLUMN public.rate_code_day_open_switch.rate_code IS '房价码（RateCode）。';
COMMENT ON COLUMN public.rate_code_day_open_switch.stay_date IS '入住日期/房态日期。';
COMMENT ON COLUMN public.rate_code_day_open_switch.is_open IS '房价码层主房态开关：true=开售，false=关售（只存主开关）。';
COMMENT ON COLUMN public.rate_code_day_open_switch.reason IS '关售原因/备注（可选）。';
COMMENT ON COLUMN public.rate_code_day_open_switch.updated_at IS '更新时间（审计字段）。';
COMMENT ON COLUMN public.rate_code_day_open_switch.updated_by IS '更新人/系统（审计字段）。';

CREATE INDEX IF NOT EXISTS idx_rate_code_day_open_switch_date
  ON public.rate_code_day_open_switch (stay_date);

CREATE TABLE IF NOT EXISTS public.rate_code_day_open_switch_default
  PARTITION OF public.rate_code_day_open_switch DEFAULT;

-- =====================================================================
-- 4) 商品日历价格库存表（hotel + room_type + rate_code + date）
-- =====================================================================
CREATE TABLE public.product_daily_price_inventory (
  hotel_code        varchar(50) NOT NULL,
  room_type_code    varchar(50) NOT NULL,
  rate_code         varchar(50) NOT NULL,
  stay_date         date        NOT NULL,

  -- 价格
  currency_code     char(3)      NOT NULL DEFAULT 'CNY', -- 币种（ISO 4217）
  base_price        numeric(18,2) NOT NULL DEFAULT 0,    -- 底价
  sell_price        numeric(18,2) NOT NULL DEFAULT 0,    -- 卖价
  tax_amount        numeric(18,2) NOT NULL DEFAULT 0,    -- 税金
  tax_included      boolean      NULL,                  -- 卖价是否含税
  service_fee_included boolean   NULL,                  -- 是否含服务费

  -- 库存
  remaining_stock   integer      NOT NULL DEFAULT 0,     -- 剩余库存
  limit_stock       integer      NOT NULL DEFAULT 0,     -- 限制库存（可卖上限）
  guaranteed_stock  integer      NOT NULL DEFAULT 0,     -- 保底库存（预留）

  -- 房态（商品维度）
  cta               boolean      NOT NULL DEFAULT false, -- 到达关闭（CTA）
  ctd               boolean      NOT NULL DEFAULT false, -- 离店关闭（CTD）

  -- 常用补充
  stop_sell         boolean      NOT NULL DEFAULT false, -- 止售
  source_system     varchar(50)  NULL,                  -- 来源系统
  last_sync_at      timestamptz(3) NULL,                -- 最后同步时间

  updated_at        timestamptz  NOT NULL DEFAULT now(),
  updated_by        text         NULL,

  CONSTRAINT pk_product_daily_price_inventory
    PRIMARY KEY (hotel_code, room_type_code, rate_code, stay_date),

  CONSTRAINT ck_pdpi_price_nonneg
    CHECK (base_price >= 0 AND sell_price >= 0 AND tax_amount >= 0),

  CONSTRAINT ck_pdpi_stock_nonneg
    CHECK (remaining_stock >= 0 AND limit_stock >= 0 AND guaranteed_stock >= 0),

  CONSTRAINT ck_pdpi_remaining_le_limit
    CHECK (remaining_stock <= limit_stock),

  CONSTRAINT ck_pdpi_guaranteed_le_limit
    CHECK (guaranteed_stock <= limit_stock)
) PARTITION BY RANGE (stay_date);

COMMENT ON TABLE public.product_daily_price_inventory IS
'商品每日价格库存表：按“酒店+房型+房价码+入住日”存放每日房价、库存与CTA/CTD房态。主房态开关采用分层表（酒店/房型/房价码）存储并在查询时合并生效。';

COMMENT ON COLUMN public.product_daily_price_inventory.hotel_code IS '酒店编码（HotelCode）。';
COMMENT ON COLUMN public.product_daily_price_inventory.room_type_code IS '房型编码（RoomTypeCode）。';
COMMENT ON COLUMN public.product_daily_price_inventory.rate_code IS '房价码（RateCode / Rate Plan）。';
COMMENT ON COLUMN public.product_daily_price_inventory.stay_date IS '入住日期（该日价格与库存适用于该入住日）。';

COMMENT ON COLUMN public.product_daily_price_inventory.currency_code IS '币种（ISO 4217，例如CNY/USD）。';
COMMENT ON COLUMN public.product_daily_price_inventory.base_price IS '底价（用于收益管理/成本参考；口径需定义）。';
COMMENT ON COLUMN public.product_daily_price_inventory.sell_price IS '卖价（对客售卖价；口径需定义）。';
COMMENT ON COLUMN public.product_daily_price_inventory.tax_amount IS '税金（税费金额；建议与税率表配套）。';
COMMENT ON COLUMN public.product_daily_price_inventory.tax_included IS '卖价是否含税（展示价/结算价口径关键）。';
COMMENT ON COLUMN public.product_daily_price_inventory.service_fee_included IS '是否含服务费（口径字段）。';

COMMENT ON COLUMN public.product_daily_price_inventory.remaining_stock IS '剩余库存（可售余量）。';
COMMENT ON COLUMN public.product_daily_price_inventory.limit_stock IS '限制库存（可卖上限/可售上限）。';
COMMENT ON COLUMN public.product_daily_price_inventory.guaranteed_stock IS '保底库存（预留库存：不可卖/或给特定客群）。';

COMMENT ON COLUMN public.product_daily_price_inventory.cta IS '到达关闭（CTA）：true时不可将该日作为入住日。';
COMMENT ON COLUMN public.product_daily_price_inventory.ctd IS '离店关闭（CTD）：true时不可将该日作为离店日。';

COMMENT ON COLUMN public.product_daily_price_inventory.stop_sell IS '止售开关：true时该商品该日直接不可售。';
COMMENT ON COLUMN public.product_daily_price_inventory.source_system IS '数据来源系统（PMS/CRS/RMS/CM等）。';
COMMENT ON COLUMN public.product_daily_price_inventory.last_sync_at IS '最后同步时间（排查对接与延迟关键）。';
COMMENT ON COLUMN public.product_daily_price_inventory.updated_at IS '更新时间（审计字段）。';
COMMENT ON COLUMN public.product_daily_price_inventory.updated_by IS '更新人/系统（审计字段）。';

CREATE INDEX IF NOT EXISTS idx_pdpi_hotel_date
  ON public.product_daily_price_inventory (hotel_code, stay_date);

CREATE INDEX IF NOT EXISTS idx_pdpi_hotel_room_date
  ON public.product_daily_price_inventory (hotel_code, room_type_code, stay_date);

CREATE INDEX IF NOT EXISTS idx_pdpi_hotel_rate_date
  ON public.product_daily_price_inventory (hotel_code, rate_code, stay_date);

CREATE TABLE IF NOT EXISTS public.product_daily_price_inventory_default
  PARTITION OF public.product_daily_price_inventory DEFAULT;

-- =====================================================================
-- 5) 创建 2026-2076 年度分区（4张表）
-- =====================================================================
DO $$
DECLARE
  y int;
  start_date date;
  end_date date;
BEGIN
  FOR y IN 2026..2076 LOOP
    start_date := make_date(y, 1, 1);
    end_date   := make_date(y + 1, 1, 1);

    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS public.hotel_day_open_switch_%s PARTITION OF public.hotel_day_open_switch FOR VALUES FROM (%L) TO (%L);',
      y, start_date, end_date
    );

    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS public.room_type_day_open_switch_%s PARTITION OF public.room_type_day_open_switch FOR VALUES FROM (%L) TO (%L);',
      y, start_date, end_date
    );

    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS public.rate_code_day_open_switch_%s PARTITION OF public.rate_code_day_open_switch FOR VALUES FROM (%L) TO (%L);',
      y, start_date, end_date
    );

    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS public.product_daily_price_inventory_%s PARTITION OF public.product_daily_price_inventory FOR VALUES FROM (%L) TO (%L);',
      y, start_date, end_date
    );
  END LOOP;
END $$;

-- =====================================================================
-- 6) 生效房态视图（合并分层主开关 + 商品止售）
-- =====================================================================
CREATE OR REPLACE VIEW public.v_product_day_effective AS
SELECT
  p.hotel_code,
  p.room_type_code,
  p.rate_code,
  p.stay_date,

  p.currency_code,
  p.base_price,
  p.sell_price,
  p.tax_amount,
  p.tax_included,
  p.service_fee_included,

  p.remaining_stock,
  p.limit_stock,
  p.guaranteed_stock,

  p.cta,
  p.ctd,
  p.stop_sell,

  COALESCE(h.is_open, true)  AS hotel_is_open,
  COALESCE(rt.is_open, true) AS room_type_is_open,
  COALESCE(rc.is_open, true) AS rate_code_is_open,

  (COALESCE(h.is_open, true)
   AND COALESCE(rt.is_open, true)
   AND COALESCE(rc.is_open, true)
   AND (NOT p.stop_sell)
  ) AS effective_is_open
FROM public.product_daily_price_inventory p
LEFT JOIN public.hotel_day_open_switch h
  ON h.hotel_code = p.hotel_code AND h.stay_date = p.stay_date
LEFT JOIN public.room_type_day_open_switch rt
  ON rt.hotel_code = p.hotel_code AND rt.room_type_code = p.room_type_code AND rt.stay_date = p.stay_date
LEFT JOIN public.rate_code_day_open_switch rc
  ON rc.hotel_code = p.hotel_code AND rc.rate_code = p.rate_code AND rc.stay_date = p.stay_date;

COMMENT ON VIEW public.v_product_day_effective IS
'商品日历价库存 + 酒店/房型/价码分层主开关合并后的生效视图：effective_is_open用于判断该商品该日是否可售；CTA/CTD用于入住/离店边界校验。';
