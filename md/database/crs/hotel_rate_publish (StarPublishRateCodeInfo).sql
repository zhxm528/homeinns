-- =====================================================================
-- 房价发布表 (PostgreSQL)
-- 表名：public.star_publish_rate_code_info
-- 说明：由 SQL Server 结构转换为 PostgreSQL 语法
-- =====================================================================

DROP TABLE IF EXISTS public.star_publish_rate_code_info CASCADE;

CREATE TABLE public.star_publish_rate_code_info (
  id              bigserial PRIMARY KEY,
  hotel_code      varchar(10)  NOT NULL,
  channel_code    varchar(50)  NULL,
  rate_code       varchar(50)  NULL,
  begin_date      timestamptz NULL,
  end_date        timestamptz NULL,
  publish_status  varchar(100) NULL, -- 发布房价针对身份:1，协议客户；2，会员；3，散客；4，团队
  member_class    varchar(100) NULL,
  create_date     timestamptz NULL,
  guid_value      varchar(100) NULL,
  commission_code varchar(100) NULL,
  protocol_unit   varchar(100) NULL,
  team_no         varchar(30)  NULL,
  team_status     integer NULL,
  latest_time     varchar(10)  NULL,
  member_flags    varchar(100) NULL,
  is_unify_publish boolean NULL
);
