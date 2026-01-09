-- =========================================
-- OTB 订单快照表 (PostgreSQL)
-- as_of_date 精确到秒 => 使用 timestamptz
-- =========================================

DROP TABLE IF EXISTS public.otb_order_snapshot CASCADE;

CREATE TABLE public.otb_order_snapshot (
  snapshot_id        bigserial PRIMARY KEY,

  hotel_id           bigint NOT NULL,                     -- hotel id

  rate_code          varchar(50),                         -- Rate Code
  rate_plan          varchar(100),                        -- Rate Plan
  otb_description    text,                                -- Description（OTB描述）

  company            varchar(200),                        -- Company
  crs_number         varchar(80),                         -- crs Number
  pms_number         varchar(80),                         -- pms number

  arrival_date       date,                                -- Arrival Date（到店）
  departure_date     date,                                -- Departure Date（离店）
  length_of_stay     integer CHECK (length_of_stay IS NULL OR length_of_stay >= 0), -- Length of Stay
  lead_time_days     numeric(10,1) CHECK (lead_time_days IS NULL OR lead_time_days >= 0), -- 提前预定天数（1位小数）

  res_status         varchar(50),                         -- Status（预订状态）

  rate               numeric(12,2) CHECK (rate IS NULL OR rate >= 0),               -- Rate
  nights             integer CHECK (nights IS NULL OR nights >= 0),                 -- Nights
  rooms              integer CHECK (rooms IS NULL OR rooms >= 0),                   -- Rooms

  room_type          varchar(50),                         -- Room Type
  channel            varchar(100),                        -- Channel
  source             varchar(100),                        -- Source

  book_date          date,                                -- Book Date
  as_of_date         timestamptz NOT NULL,                -- As of date（快照时间，精确到秒，含时区）

  group_code         varchar(50),                         -- group code
  market_code        varchar(50),                         -- market code

  created_at         timestamptz NOT NULL DEFAULT now()    -- 入库时间
);

COMMENT ON TABLE public.otb_order_snapshot IS 'OTB订单快照表：按as_of_date(精确到秒)存储订单在某一时点的快照数据';

COMMENT ON COLUMN public.otb_order_snapshot.as_of_date IS 'As of date（快照时间，精确到秒，含时区）';

-- =========================================
-- 索引（常用查询维度）
-- =========================================

CREATE INDEX IF NOT EXISTS idx_otb_snap_hotel_asof
  ON public.otb_order_snapshot (hotel_id, as_of_date);

CREATE INDEX IF NOT EXISTS idx_otb_snap_hotel_arrival
  ON public.otb_order_snapshot (hotel_id, arrival_date);

CREATE INDEX IF NOT EXISTS idx_otb_snap_hotel_departure
  ON public.otb_order_snapshot (hotel_id, departure_date);

CREATE INDEX IF NOT EXISTS idx_otb_snap_crs
  ON public.otb_order_snapshot (crs_number);

CREATE INDEX IF NOT EXISTS idx_otb_snap_pms
  ON public.otb_order_snapshot (pms_number);

CREATE INDEX IF NOT EXISTS idx_otb_snap_hotel_asof_channel
  ON public.otb_order_snapshot (hotel_id, as_of_date, channel);

CREATE INDEX IF NOT EXISTS idx_otb_snap_hotel_asof_market
  ON public.otb_order_snapshot (hotel_id, as_of_date, market_code);

CREATE INDEX IF NOT EXISTS idx_otb_snap_hotel_asof_group
  ON public.otb_order_snapshot (hotel_id, as_of_date, group_code);

-- =========================================
-- 可选：快照去重唯一索引（按你的业务选）
-- 方案A：同酒店 + 同快照时间(as_of_date到秒) + 同CRS 只能一条（仅crs_number非空时）
-- =========================================
CREATE UNIQUE INDEX IF NOT EXISTS uq_otb_snap_hotel_asof_crs
  ON public.otb_order_snapshot (hotel_id, as_of_date, crs_number)
  WHERE crs_number IS NOT NULL;

-- 方案B：同酒店 + 同快照时间 + 同PMS 只能一条（仅pms_number非空时）
-- CREATE UNIQUE INDEX IF NOT EXISTS uq_otb_snap_hotel_asof_pms
--   ON public.otb_order_snapshot (hotel_id, as_of_date, pms_number)
--   WHERE pms_number IS NOT NULL;
