﻿﻿﻿CREATE TABLE master_base (
  hotel_group_id bigint NOT NULL,
  hotel_id bigint NOT NULL,
  ids bigint NOT NULL,
  id bigint NOT NULL,
  rsv_id bigint NOT NULL DEFAULT 0,
  is_resrv varchar(5) NOT NULL DEFAULT 'F',
  rsv_man varchar(80) DEFAULT '',
  rsv_man_id bigint DEFAULT 0,
  rsv_company varchar(80) DEFAULT '',
  mobile varchar(300) DEFAULT '',
  group_code varchar(80) DEFAULT '',
  group_manager varchar(80) DEFAULT '',
  parent_id bigint DEFAULT 0,
  rsv_src_id bigint,
  master_rsvsrc_id bigint DEFAULT 0,
  rsv_class char(6) NOT NULL,
  master_id bigint NOT NULL,
  grp_accnt bigint NOT NULL DEFAULT 0,
  grp_flag varchar(30) DEFAULT '',
  block_id bigint NOT NULL,
  block_mark char(6) DEFAULT 'F',
  block_status varchar(30) DEFAULT '',
  block_status_res varchar(30) DEFAULT '',
  biz_date timestamp(3) NOT NULL,
  sta char(6) NOT NULL,
  rmtype varchar(30) NOT NULL,
  rmno varchar(30) NOT NULL,
  rmno_son varchar(20) DEFAULT '',
  rmnum int NOT NULL DEFAULT 1,
  arr timestamp(3) NOT NULL,
  dep timestamp(3) NOT NULL,
  follow_up timestamp(3),
  decision timestamp(3),
  cutoff_days int DEFAULT 0,
  cutoff_date timestamp(3),
  adult int NOT NULL DEFAULT 1,
  children int NOT NULL DEFAULT 0,
  res_sta char(6) NOT NULL,
  res_dep timestamp(3),
  up_rmtype varchar(30) DEFAULT '',
  up_reason varchar(60) DEFAULT '',
  up_remark text DEFAULT '',
  up_user varchar(40) DEFAULT '',
  rack_rate decimal(8,2) NOT NULL DEFAULT 0,
  nego_rate decimal(8,2) NOT NULL DEFAULT 0,
  real_rate decimal(8,2) NOT NULL DEFAULT 0,
  dsc_reason varchar(10) NOT NULL DEFAULT '',
  dsc_amount decimal(8,2) NOT NULL DEFAULT 0,
  dsc_percent decimal(8,2) DEFAULT 0,
  exp_sta char(6) NOT NULL DEFAULT '',
  tm_sta char(6) NOT NULL DEFAULT '',
  rmpost_sta char(6) NOT NULL DEFAULT 'F',
  is_rmposted char(6) NOT NULL DEFAULT 'F',
  tag0 char(6) NOT NULL DEFAULT '',
  company_id bigint NOT NULL DEFAULT 0,
  agent_id bigint NOT NULL DEFAULT 0,
  source_id bigint NOT NULL DEFAULT 0,
  member_type varchar(40) NOT NULL,
  member_no varchar(40) NOT NULL,
  equity_card_no varchar(60) DEFAULT '',
  inner_card_id bigint,
  salesman varchar(40) NOT NULL,
  arno varchar(40) NOT NULL,
  building varchar(70) DEFAULT '',
  src varchar(30) NOT NULL DEFAULT '',
  market varchar(30) NOT NULL DEFAULT '',
  rsv_type varchar(30) NOT NULL DEFAULT '',
  channel varchar(30) NOT NULL DEFAULT '',
  sales_channel varchar(30) DEFAULT '',
  mktact_code varchar(300),
  mktact_descript varchar(1024),
  mktact_code_src varchar(400),
  morning_rate decimal(8,2),
  mktact_rate varchar(300),
  mktact_discount varchar(300),
  ratecode varchar(40) NOT NULL DEFAULT '',
  ratecode_category varchar(40) DEFAULT '',
  cmscode varchar(30) NOT NULL,
  packages varchar(128) NOT NULL,
  specials text,
  amenities varchar(300),
  is_fix_rate char(6) NOT NULL DEFAULT 'F',
  is_fix_rmno char(6) NOT NULL DEFAULT 'F',
  is_sure char(6) NOT NULL DEFAULT 'F',
  is_permanent char(6) NOT NULL DEFAULT 'F',
  is_walkin char(6) NOT NULL DEFAULT 'F',
  is_secret char(6) NOT NULL DEFAULT 'F',
  is_secret_rate char(6) NOT NULL DEFAULT 'F',
  posting_flag char(6) NOT NULL DEFAULT '0',
  sc_flag varchar(40) NOT NULL,
  extra_flag varchar(40) NOT NULL DEFAULT '000000000000000000000000000000',
  extra_bed_num int NOT NULL DEFAULT 0,
  extra_bed_rate decimal(8,2) NOT NULL DEFAULT 0,
  crib_num int NOT NULL DEFAULT 0,
  crib_rate decimal(8,2) NOT NULL DEFAULT 0,
  pay_code varchar(30) NOT NULL DEFAULT '',
  limit_amt decimal(10,2) NOT NULL DEFAULT 0,
  credit_no varchar(40),
  credit_man varchar(300) NOT NULL DEFAULT '',
  credit_company varchar(60),
  charge decimal(12,2) NOT NULL DEFAULT 0,
  pay decimal(12,2) NOT NULL DEFAULT 0,
  credit decimal(12,2) NOT NULL DEFAULT 0,
  last_num int NOT NULL DEFAULT 0,
  last_num_link int NOT NULL DEFAULT 0,
  rmocc_id bigint,
  link_id bigint,
  equity_profile_id bigint,
  other_type varchar(40),
  pkg_link_id bigint,
  rsv_no varchar(40) NOT NULL,
  crs_no varchar(40) NOT NULL,
  tour_no varchar(128) DEFAULT '',
  where_from varchar(30) NOT NULL,
  where_to varchar(30) NOT NULL,
  purpose varchar(30),
  remark varchar(2048) DEFAULT '',
  co_msg varchar(600) NOT NULL,
  is_send varchar(6) DEFAULT 'F',
  is_cor_rsv varchar(6) DEFAULT 'F',
  promotion varchar(30) DEFAULT 'F',
  is_owner char(6) DEFAULT 'F',
  owner_supper char(6) DEFAULT 'F',
  owner_id bigint DEFAULT 0,
  ppe_id bigint DEFAULT 0,
  create_user varchar(40) NOT NULL,
  create_datetime timestamp(3) NOT NULL,
  modify_user varchar(40) NOT NULL,
  modify_datetime timestamp(3) NOT NULL,
  sta_ebooking char(4),
  credit_money decimal(8,2),
  rsv_rm_count decimal(10,0),
  rsv_adult decimal(10,0),
  rate_calculation_mode varchar(40),
  fix_rate_user varchar(80),
  member_name varchar(80),
  member_level varchar(80),
  contact_status varchar(80),
  detailInfo varchar(400),
  award varchar(60),
  full_pay varchar(30),
  booking_source varchar(200),
  unique_no varchar(200),
  self_checkin varchar(200),
  self_checkout varchar(200),
  self_continued varchar(200),
  self_continued_time timestamp(3),
  other_link bigint,
  checkin_code varchar(40),
  guest_label varchar(300),
  upload_datetime timestamp(3)
);

COMMENT ON COLUMN master_base.hotel_group_id IS '酒店集团ID';
COMMENT ON COLUMN master_base.hotel_id IS '酒店ID';
COMMENT ON COLUMN master_base.ids IS 'IDS';
COMMENT ON COLUMN master_base.id IS 'ID';
COMMENT ON COLUMN master_base.rsv_id IS '预订ID';
COMMENT ON COLUMN master_base.is_resrv IS '是否预订';
COMMENT ON COLUMN master_base.rsv_man IS '预订人';
COMMENT ON COLUMN master_base.rsv_man_id IS '预订人ID';
COMMENT ON COLUMN master_base.rsv_company IS '预订公司';
COMMENT ON COLUMN master_base.mobile IS '手机号码';
COMMENT ON COLUMN master_base.group_code IS '团队代码';
COMMENT ON COLUMN master_base.group_manager IS '团队负责人';
COMMENT ON COLUMN master_base.parent_id IS '父ID';
COMMENT ON COLUMN master_base.rsv_src_id IS '预订来源ID';
COMMENT ON COLUMN master_base.master_rsvsrc_id IS '主预订来源ID';
COMMENT ON COLUMN master_base.rsv_class IS '预订类别';
COMMENT ON COLUMN master_base.master_id IS '主单ID';
COMMENT ON COLUMN master_base.grp_accnt IS '团队账户';
COMMENT ON COLUMN master_base.grp_flag IS '团队标志';
COMMENT ON COLUMN master_base.block_id IS '房量预留ID';
COMMENT ON COLUMN master_base.block_mark IS '预留标记';
COMMENT ON COLUMN master_base.block_status IS '预留状态';
COMMENT ON COLUMN master_base.block_status_res IS '预留状态说明';
COMMENT ON COLUMN master_base.biz_date IS '业务日期';
COMMENT ON COLUMN master_base.sta IS '状态';
COMMENT ON COLUMN master_base.rmtype IS '房型';
COMMENT ON COLUMN master_base.rmno IS '房号';
COMMENT ON COLUMN master_base.rmno_son IS '子房号';
COMMENT ON COLUMN master_base.rmnum IS '房数';
COMMENT ON COLUMN master_base.arr IS '到店日期';
COMMENT ON COLUMN master_base.dep IS '离店日期';
COMMENT ON COLUMN master_base.follow_up IS '跟进日期';
COMMENT ON COLUMN master_base.decision IS '决策日期';
COMMENT ON COLUMN master_base.cutoff_days IS '截止天数';
COMMENT ON COLUMN master_base.cutoff_date IS '截止日期';
COMMENT ON COLUMN master_base.adult IS '成人数';
COMMENT ON COLUMN master_base.children IS '儿童数';
COMMENT ON COLUMN master_base.res_sta IS '预订状态';
COMMENT ON COLUMN master_base.res_dep IS '预订离店日期';
COMMENT ON COLUMN master_base.up_rmtype IS '升级房型';
COMMENT ON COLUMN master_base.up_reason IS '升级原因';
COMMENT ON COLUMN master_base.up_remark IS '升级备注';
COMMENT ON COLUMN master_base.up_user IS '升级操作人';
COMMENT ON COLUMN master_base.rack_rate IS '门市价';
COMMENT ON COLUMN master_base.nego_rate IS '协商价';
COMMENT ON COLUMN master_base.real_rate IS '实际价';
COMMENT ON COLUMN master_base.dsc_reason IS '折扣原因';
COMMENT ON COLUMN master_base.dsc_amount IS '折扣金额';
COMMENT ON COLUMN master_base.dsc_percent IS '折扣比例';
COMMENT ON COLUMN master_base.exp_sta IS '预期状态';
COMMENT ON COLUMN master_base.tm_sta IS '时段状态';
COMMENT ON COLUMN master_base.rmpost_sta IS '房费过账状态';
COMMENT ON COLUMN master_base.is_rmposted IS '是否已过账';
COMMENT ON COLUMN master_base.tag0 IS '标签0';
COMMENT ON COLUMN master_base.company_id IS '公司ID';
COMMENT ON COLUMN master_base.agent_id IS '代理ID';
COMMENT ON COLUMN master_base.source_id IS '来源ID';
COMMENT ON COLUMN master_base.member_type IS '会员类型';
COMMENT ON COLUMN master_base.member_no IS '会员号';
COMMENT ON COLUMN master_base.equity_card_no IS '权益卡号';
COMMENT ON COLUMN master_base.inner_card_id IS '内部卡ID';
COMMENT ON COLUMN master_base.salesman IS '销售员';
COMMENT ON COLUMN master_base.arno IS '应收账号';
COMMENT ON COLUMN master_base.building IS '楼栋';
COMMENT ON COLUMN master_base.src IS '来源';
COMMENT ON COLUMN master_base.market IS '市场';
COMMENT ON COLUMN master_base.rsv_type IS '预订类型';
COMMENT ON COLUMN master_base.channel IS '渠道';
COMMENT ON COLUMN master_base.sales_channel IS '销售渠道';
COMMENT ON COLUMN master_base.mktact_code IS '营销活动代码';
COMMENT ON COLUMN master_base.mktact_descript IS '营销活动描述';
COMMENT ON COLUMN master_base.mktact_code_src IS '活动来源代码';
COMMENT ON COLUMN master_base.morning_rate IS '早鸟价';
COMMENT ON COLUMN master_base.mktact_rate IS '活动价格';
COMMENT ON COLUMN master_base.mktact_discount IS '活动折扣';
COMMENT ON COLUMN master_base.ratecode IS '房价代码';
COMMENT ON COLUMN master_base.ratecode_category IS '房价类别';
COMMENT ON COLUMN master_base.cmscode IS 'CMS代码';
COMMENT ON COLUMN master_base.packages IS '套餐';
COMMENT ON COLUMN master_base.specials IS '特殊要求';
COMMENT ON COLUMN master_base.amenities IS '配套设施';
COMMENT ON COLUMN master_base.is_fix_rate IS '是否固定房价';
COMMENT ON COLUMN master_base.is_fix_rmno IS '是否固定房号';
COMMENT ON COLUMN master_base.is_sure IS '是否确认';
COMMENT ON COLUMN master_base.is_permanent IS '是否长期';
COMMENT ON COLUMN master_base.is_walkin IS '是否散客';
COMMENT ON COLUMN master_base.is_secret IS '是否保密';
COMMENT ON COLUMN master_base.is_secret_rate IS '是否保密价';
COMMENT ON COLUMN master_base.posting_flag IS '过账标志';
COMMENT ON COLUMN master_base.sc_flag IS '服务费标志';
COMMENT ON COLUMN master_base.extra_flag IS '额外标志';
COMMENT ON COLUMN master_base.extra_bed_num IS '加床数量';
COMMENT ON COLUMN master_base.extra_bed_rate IS '加床价格';
COMMENT ON COLUMN master_base.crib_num IS '婴儿床数量';
COMMENT ON COLUMN master_base.crib_rate IS '婴儿床价格';
COMMENT ON COLUMN master_base.pay_code IS '支付方式';
COMMENT ON COLUMN master_base.limit_amt IS '额度限制';
COMMENT ON COLUMN master_base.credit_no IS '信用卡号';
COMMENT ON COLUMN master_base.credit_man IS '持卡人';
COMMENT ON COLUMN master_base.credit_company IS '发卡公司';
COMMENT ON COLUMN master_base.charge IS '应收金额';
COMMENT ON COLUMN master_base.pay IS '支付金额';
COMMENT ON COLUMN master_base.credit IS '挂账金额';
COMMENT ON COLUMN master_base.last_num IS '最后数量';
COMMENT ON COLUMN master_base.last_num_link IS '最后联房数';
COMMENT ON COLUMN master_base.rmocc_id IS '房态ID';
COMMENT ON COLUMN master_base.link_id IS '联房ID';
COMMENT ON COLUMN master_base.equity_profile_id IS '权益档案ID';
COMMENT ON COLUMN master_base.other_type IS '其他类型';
COMMENT ON COLUMN master_base.pkg_link_id IS '套餐关联ID';
COMMENT ON COLUMN master_base.rsv_no IS '预订号';
COMMENT ON COLUMN master_base.crs_no IS 'CRS号';
COMMENT ON COLUMN master_base.tour_no IS '团队号';
COMMENT ON COLUMN master_base.where_from IS '来源地';
COMMENT ON COLUMN master_base.where_to IS '目的地';
COMMENT ON COLUMN master_base.purpose IS '目的';
COMMENT ON COLUMN master_base.remark IS '备注';
COMMENT ON COLUMN master_base.co_msg IS '同住信息';
COMMENT ON COLUMN master_base.is_send IS '是否发送';
COMMENT ON COLUMN master_base.is_cor_rsv IS '是否关联预订';
COMMENT ON COLUMN master_base.promotion IS '促销标志';
COMMENT ON COLUMN master_base.is_owner IS '是否业主';
COMMENT ON COLUMN master_base.owner_supper IS '业主支持';
COMMENT ON COLUMN master_base.owner_id IS '业主ID';
COMMENT ON COLUMN master_base.ppe_id IS 'PPE ID';
COMMENT ON COLUMN master_base.create_user IS '创建人';
COMMENT ON COLUMN master_base.create_datetime IS '创建时间';
COMMENT ON COLUMN master_base.modify_user IS '修改人';
COMMENT ON COLUMN master_base.modify_datetime IS '修改时间';
COMMENT ON COLUMN master_base.sta_ebooking IS '电子预订状态';
COMMENT ON COLUMN master_base.credit_money IS '信用额度';
COMMENT ON COLUMN master_base.rsv_rm_count IS '预订房数';
COMMENT ON COLUMN master_base.rsv_adult IS '预订成人数';
COMMENT ON COLUMN master_base.rate_calculation_mode IS '房价计算方式';
COMMENT ON COLUMN master_base.fix_rate_user IS '固定房价人';
COMMENT ON COLUMN master_base.member_name IS '会员姓名';
COMMENT ON COLUMN master_base.member_level IS '会员等级';
COMMENT ON COLUMN master_base.contact_status IS '联系人状态';
COMMENT ON COLUMN master_base.detailInfo IS '详细信息';
COMMENT ON COLUMN master_base.award IS '奖励';
COMMENT ON COLUMN master_base.full_pay IS '全额支付';
COMMENT ON COLUMN master_base.booking_source IS '预订来源';
COMMENT ON COLUMN master_base.unique_no IS '唯一编号';
COMMENT ON COLUMN master_base.self_checkin IS '自助入住';
COMMENT ON COLUMN master_base.self_checkout IS '自助退房';
COMMENT ON COLUMN master_base.self_continued IS '自助续住';
COMMENT ON COLUMN master_base.self_continued_time IS '自助续住时间';
COMMENT ON COLUMN master_base.other_link IS '其他关联ID';
COMMENT ON COLUMN master_base.checkin_code IS '入住码';
COMMENT ON COLUMN master_base.guest_label IS '住客标签';
COMMENT ON COLUMN master_base.upload_datetime IS '上传时间';
