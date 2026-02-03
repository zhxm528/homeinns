-- =====================================================================
-- 酒店房价码表 (PostgreSQL)
-- 表名：public.hotel_rate_code
-- 说明：由 SQL Server 结构转换为 PostgreSQL 语法
-- =====================================================================

DROP TABLE IF EXISTS public.hotel_rate_code CASCADE;

CREATE TABLE public.hotel_rate_code (
  id                    bigserial PRIMARY KEY,
  hotel_code            varchar(10)  NOT NULL,
  rate_code             varchar(10)  NOT NULL,
  cate_code             varchar(10)  NOT NULL,
  rate_code_name        varchar(500) NOT NULL,
  begin_date            timestamptz NOT NULL,
  end_date              timestamptz NOT NULL,
  min_los               integer NOT NULL,
  max_los               integer NOT NULL,
  min_adv_bookin        integer NOT NULL,
  max_adv_bookin        integer NOT NULL,
  market                varchar(200) NULL,
  sources               varchar(200) NULL,
  room_type_code        varchar(500) NOT NULL,
  is_price              integer NULL,
  rate_group            integer NULL,
  short_info            varchar(500) NULL,
  long_info             varchar(5000) NULL,
  is_allow_down         integer NULL,
  sort                  integer NULL,
  is_delete             integer NULL, -- 是否删除
  rate_grouping          varchar(500) NULL,
  hour_nums             varchar(10)  NULL,
  check_begin_date      timestamptz NULL,
  check_end_date        timestamptz NULL,
  sl_enable             varchar(50)  NULL,
  rate_code_display_name varchar(500) NULL,
  xms_sync_switch       integer NULL,
  is_enable_dp           boolean NULL DEFAULT false,
  is_cy_price            boolean NULL,
  type_code             varchar(10)  NULL,
  rate_code_en_name     varchar(100) NULL,
  resflag               varchar(20)  NULL,
  priv                  varchar(10)  NULL,
  check_in_begin_time   timestamptz NULL,
  check_in_end_time     timestamptz NULL,
  commission_code       varchar(100) NULL,
  is_multi_price        boolean NULL,
  rate_check            boolean NULL,
  rate_note             varchar(100) NULL,
  team_note             varchar(500) NULL,
  team_note_en          varchar(500) NULL,
  begin_time            varchar(10)  NULL,
  end_time              varchar(10)  NULL,
  rate_secret           varchar(1)   NULL,
  week_control          varchar(20)  NULL,
  continuous_week_control varchar(20) NULL,
  block_code            varchar(50)  NULL,
  guarantee_stock       integer NULL
);
