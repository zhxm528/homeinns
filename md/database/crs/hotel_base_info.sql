-- =====================================================================
-- 酒店基础信息表 (PostgreSQL)
-- 表名：public.hotel_base_info
-- 说明：由 SQL Server 结构转换为 PostgreSQL 语法
-- =====================================================================

DROP TABLE IF EXISTS public.hotel_base_info CASCADE;

CREATE TABLE public.hotel_base_info (
  id                          bigserial PRIMARY KEY,
  hotel_code                  varchar(10)  NOT NULL,
  hotel_name                  varchar(500) NOT NULL,
  hotel_en_name               varchar(500) NULL,
  hotel_lang_name             varchar(500) NULL,
  hotel_type                  varchar(40)  NULL, -- 1，酒店；2，集团
  hotel_star                  varchar(40)  NULL,
  group_code                  varchar(40)  NULL,
  hotel_address               varchar(1000) NULL,
  short_hotel_address         varchar(500) NULL,
  hotel_en_address            varchar(1000) NULL,
  post_code                   varchar(100) NULL,
  mobile_phone                varchar(100) NULL,
  phone                       varchar(100) NULL,
  email                       varchar(100) NULL,
  fax                         varchar(100) NULL,
  land_mark                   varchar(1000) NULL,
  catering                    text NULL,
  banquet                     text NULL,
  prompt                      text NULL,
  hotel_features              text NULL,
  business_area               varchar(5000) NULL,
  hotel_area                  numeric(18,2) NULL,
  meeting_room_area           numeric(18,2) NULL,
  the_banquet_area            numeric(18,2) NULL,
  all_room_nums               integer NULL,
  use_money                   integer NULL,
  status                      integer NULL,
  nearby_hotel                varchar(5000) NULL,
  hotel_keyword               varchar(5000) NULL,
  "describe"                  text NULL,
  remarks                     text NULL,
  create_date                 timestamptz NULL,
  sort                        integer NULL,
  is_delete                   integer NULL,
  open_date                   timestamptz NULL,
  pms_type                    varchar(50) NULL,
  restaurant_resv_email       varchar(50) NULL,
  banquet_resv_email          varchar(50) NULL,
  resv_class                  varchar(20) NULL,
  contract_no                 varchar(500) NULL,
  display_status              integer NULL,
  admin_code                  varchar(50) NULL,
  presale_date                timestamptz NULL,
  opening_date                timestamptz NULL,
  over_book_status            smallint NULL,
  sales_id                    varchar(50) NULL,
  rate_code_switch            varchar(100) NOT NULL DEFAULT 'StarRateCodeSwitch',
  room_type_switch            varchar(100) NOT NULL DEFAULT 'StarRoomTypeSwitch',
  best_price_exclusion        boolean NULL DEFAULT true,
  area                        varchar(50) NULL, -- 区域
  urban_area                  varchar(50) NULL, -- 所属城区
  hotel_brand                 varchar(50) NULL, -- 酒店品牌
  hotel_status_start_date     timestamptz NULL, -- 酒店停业时间
  closing_date                timestamptz NULL, -- 酒店永久关闭时间
  mdm_province                varchar(50) NULL, -- MDM省份编号
  mdm_city                    varchar(50) NULL, -- MDM城市编号
  hotel_min_price             numeric(18,2) NULL,
  default_open_sale           boolean NOT NULL DEFAULT true, -- 发布产品默认打开售卖
  default_roll_price_stock    boolean NOT NULL DEFAULT false, -- 房价库存默认滚动销售
  describe_en                 text NULL,
  guaranteed_price            numeric(18,2) NULL,
  best_price_voc_channel_mode boolean NULL,
  property_type               varchar(20) NULL
);
