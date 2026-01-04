import React, { useState } from 'react';
import { Table, InputNumber, Card, Modal, Button, Select, Switch, Row, Col, Space, Typography, message } from 'antd';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import TokenCheck from '../../components/common/TokenCheck';

const budgetItems = [
  '总收入', '客房收入', '餐饮收入', '其他收入', 'GOP', 'GOP率', '可出租房间数', '实际出租间夜数', '出租率', '平均房价', '每间收益', '客房利润', '客房利润率', '餐饮利润', '餐饮利润率'
];
const months = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);

const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const initialData = budgetItems.map((item, i) => {
  const row: any = { key: i, item };
  months.forEach((m, j) => {
    if (['出租率', '客房利润率', '餐饮利润率', 'GOP率'].includes(item)) {
      row[`m${j + 1}`] = getRandom(30, 95);
    } else if (item === '平均房价') {
      row[`m${j + 1}`] = getRandom(500, 3000);
    } else if (item === '每间收益') {
      row[`m${j + 1}`] = getRandom(400, 1800);
    } else {
      row[`m${j + 1}`] = getRandom(10000, 1000000);
    }
  });
  return row;
});

const columns = [
  { title: '预测项', dataIndex: 'item', key: 'item', fixed: 'left', width: 120 },
  ...months.map((m, i) => ({
    title: m,
    dataIndex: `m${i + 1}`,
    key: `m${i + 1}`,
    width: 100,
    align: 'center',
    render: (value: number, record: any) => (
      <span
        style={{ cursor: 'pointer', display: 'inline-block', width: '100%' }}
        onClick={() => handleCellClick(record.key, `m${i + 1}`, value)}
      >
        {value !== undefined && value !== null ?
          ((['出租率', '客房利润率', '餐饮利润率', 'GOP率'].includes(record.item))
            ? value.toLocaleString('en-US') + '%'
            : value.toLocaleString('en-US'))
          : ''}
      </span>
    )
  })),
  {
    title: '全年',
    dataIndex: 'yearTotal',
    key: 'yearTotal',
    width: 120,
    align: 'center',
    render: (value: number, record: any) => (
      <span>
        {value !== undefined && value !== null ?
          ((['出租率', '客房利润率', '餐饮利润率', 'GOP率'].includes(record.item))
            ? value.toLocaleString('en-US') + '%'
            : value.toLocaleString('en-US'))
          : ''}
      </span>
    )
  }
];

const hotelList = [
  '前门建国饭店', '北京民族饭店', '京伦饭店', '北京建国饭店', '西苑饭店', '国际饭店', '东方饭店', '崇文门饭店',
  '香山饭店', '北京展览馆宾馆', '宣武门商务酒店', '和平里大酒店', '新侨饭店', '郑州建国饭店', '西苑建国饭店',
  '西安建国饭店', '广州建国酒店', '亚洲大酒店', '北京工大建国酒店', '北京松鹤建国培训中心', '北京宁建雁栖湖酒店',
  '北京唯实国际文化交流中心', '沙河唯实国际文化交流中心', '北京园博大酒店', '北京银保建国酒店', '绿博园建国饭店',
  '郑州奥体建国饭店', '韶山建国酒店', '武汉东方建国酒店', '宝鸡建国饭店', '南阳建国饭店', '滑南建国饭店B座',
  '甘肃长城建国饭店', '杭州白马湖建国饭店', '苏州黎花建国假日酒店', '三亚红塘湾建国酒店', '遵义中建国饭店',
  '昌吉建国饭店', '秦皇岛首旅京伦酒店', '平遥峰岩建国饭店', '江诚建国饭店', '通化丽景建国饭店',
  '平舆建国国际酒店', '海阳建国饭店', '文县正南红种湾京伦饭店', '泸州建国饭店', '江西文澳建国饭店',
  '瑞昌建国', '凤凰大厦建国饭店', '江苏常熟沙家浜建国铂华酒店', '兴安盟建国饭店', '运城建国饭店',
  '南丘信华建国饭店', '好苑建国饭店', '丹东威尼斯酒店', '呼伦贝尔首旅京伦酒店', '元和建国酒店',
  '迁安建国饭店', '云冈建国饭店', '九江信华建国饭店', '长恨宫森林建国酒店', '仙居岭京伦酒店',
  '威海海悦建国酒店', '雁荡山建国饭店', '三亚石溪墅建国度假酒店', '庐华温泉建国饭店', '郑州山商建国饭店',
  '正南南溪酒店', '库尔勒康城建国国际酒店', '渑池建国商务饭店', '福建广建国酒店'
];



const currentYear = new Date().getFullYear();

let handleCellClick: (rowKey: number, colKey: string, value: number) => void;

function getWeek(date: Date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = ((date as any) - (firstDay as any)) / 86400000 + 1;
  return Math.ceil((dayOfYear + firstDay.getDay()) / 7);
}

// 查询条件选项
const companyOptions = [
  { label: '诺金国际', value: '诺金国际' },
  { label: '首旅建国', value: '首旅建国' },
  { label: '首旅京伦', value: '首旅京伦' },
  { label: '首旅南苑', value: '首旅南苑' },
  { label: '首旅安诺', value: '首旅安诺' },
  { label: '诺金管理', value: '诺金管理' },
  { label: '凯燕', value: '凯燕' },
  { label: '安麓', value: '安麓' },
];
const manageTypeOptions = [
  { label: '委托管理', value: '委托管理' },
  { label: '合资委管', value: '合资委管' },
  { label: '特许加盟', value: '特许加盟' },
];
const propertyTypeOptions = [
  { label: '首旅集团', value: '首旅集团' },
  { label: '首旅置业', value: '首旅置业' },
  { label: '首酒集团', value: '首酒集团' },
  { label: '北展', value: '北展' },
  { label: '非产权店', value: '非产权店' },
];
const cityListOptions = [
  { label: '北京', value: '北京' },
  { label: '外埠', value: '外埠' },
];

// 添加大区、城区、店龄选项
const districtOptions = [
  { label: '一区', value: '一区' },
  { label: '二区', value: '二区' },
];

const cityAreaOptions = [
  { label: '华中', value: '华中' },
  { label: '华南', value: '华南' },
  { label: '华北', value: '华北' },
  { label: '华东', value: '华东' },
  { label: '华西', value: '华西' },
];

const storeAgeOptions = [
  { label: '1年内', value: '1年内' },
  { label: '1-3年', value: '1-3年' },
  { label: '3-7年', value: '3-7年' },
  { label: '7年以上', value: '7年以上' },
];

const ForecastEntry: React.FC = () => {
  const [data, setData] = useState(
    initialData.map(row => {
      const isAvg = ['出租率', '客房利润率', '餐饮利润率', 'GOP率', '平均房价', '每间收益'].includes(row.item);
      const vals = months.map((_, i) => row[`m${i + 1}`]);
      let yearTotal;
      if (isAvg) {
        const valid = vals.filter(v => typeof v === 'number');
        yearTotal = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : undefined;
      } else {
        yearTotal = vals.filter(v => typeof v === 'number').reduce((a, b) => a + b, 0);
      }
      return { ...row, yearTotal };
    })
  );
  const [modal, setModal] = useState({ visible: false, rowKey: -1, colKey: '', value: 0 });
  const [editValue, setEditValue] = useState<number>(0);
  const [logs, setLogs] = useState<{ week: string; value: number; time: string; user: string; status?: string }[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string | undefined>(undefined);
  const [budgetOpen, setBudgetOpen] = useState<boolean>(true);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = useState<string[]>([]);
  const [selectedStoreAges, setSelectedStoreAges] = useState<string[]>([]);

  handleCellClick = (rowKey, colKey, value) => {
    setModal({ visible: true, rowKey, colKey, value });
    setEditValue(value);
    setLogs([
      { week: '第23周', value, time: '2024-06-01 10:00', user: '张三', status: '已通过' },
      { week: '第22周', value: value + 1000, time: '2024-05-20 09:30', user: '李四', status: '待审核' }
    ]);
  };

  const handleCancel = () => setModal({ ...modal, visible: false });
  const handleSave = () => {
    setData(prev => prev.map(row => row.key === modal.rowKey ? { ...row, [modal.colKey]: editValue } : row));
    setLogs(prev => [
      { week: '第' + getWeek(new Date()) + '周', value: editValue, time: new Date().toLocaleString(), user: '当前用户', status: '待审核' },
      ...prev
    ]);
    setModal({ ...modal, visible: false });
  };

  return (
    <TokenCheck checkToken={false}>
      <div className="p-6">
      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Typography.Title level={4}>预测填报</Typography.Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
                placeholder="管理公司"
                style={{ width: '100%' }}
                options={companyOptions}
                value={selectedCompanies}
                onChange={setSelectedCompanies}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
                placeholder="产权类型"
                style={{ width: '100%' }}
                options={propertyTypeOptions}
                value={selectedPropertyTypes}
                onChange={setSelectedPropertyTypes}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
                placeholder="管理类型"
                style={{ width: '100%' }}
                options={manageTypeOptions}
                value={selectedManageTypes}
                onChange={setSelectedManageTypes}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
                placeholder="大区"
                style={{ width: '100%' }}
                options={districtOptions}
                value={selectedDistricts}
                onChange={setSelectedDistricts}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
                placeholder="城区"
                style={{ width: '100%' }}
                options={cityAreaOptions}
                value={selectedCityAreas}
                onChange={setSelectedCityAreas}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
                placeholder="店龄"
                style={{ width: '100%' }}
                options={storeAgeOptions}
                value={selectedStoreAges}
                onChange={setSelectedStoreAges}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
                placeholder="选择城市"
                style={{ width: '100%' }}
                options={cityListOptions}
                value={selectedCity}
                onChange={setSelectedCity}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                showSearch
                allowClear
                placeholder="选择酒店"
                style={{ width: '100%' }}
                options={hotelList.map(hotel => ({ label: hotel, value: hotel }))}
                value={selectedHotel}
                onChange={setSelectedHotel}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Space>
                <Button>导入</Button>
                <Button>下载模板</Button>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Space>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
                  <span style={{ marginRight: 6 }}>预测开放</span>
                  <Switch checked={budgetOpen} onChange={setBudgetOpen} />
                </label>
              </Space>
            </Col>
          </Row>
        </Space>
      </Card>

      <Card style={{ marginTop: '24px' }} title="预测填报" bordered={false}>
        <Table
          columns={columns as any}
          dataSource={data as any}
          pagination={false}
          bordered
          scroll={{ x: 1400 }}
        />
      </Card>
      <Modal
        open={modal.visible}
        title="修改预测"
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        {modal.visible && (
          <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 16 }}>
            <span style={{ marginRight: 24 }}>预测项：{data.find(row => row.key === modal.rowKey)?.item}</span>
            <span>月份：{(() => {
              const idx = modal.colKey.startsWith('m') ? Number(modal.colKey.slice(1)) - 1 : -1;
              return idx >= 0 ? months[idx] : '';
            })()}</span>
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <InputNumber
            min={0}
            value={editValue}
            style={{ width: '100%' }}
            formatter={v => v ? (modal.rowKey !== -1 && ['出租率','客房利润率','餐饮利润率','GOP率'].includes(data.find(row => row.key === modal.rowKey)?.item) ? Number(v).toLocaleString('en-US') + '%' : Number(v).toLocaleString('en-US')) : ''}
            parser={v => v ? Number(String(v).replace(/,/g, '').replace('%', '')) : 0}
            onChange={v => setEditValue(Number(v))}
          />
        </div>
        <div style={{ maxHeight: 200, overflow: 'auto', marginBottom: 16 }}>
          <Table
            size="small"
            columns={[
              { title: '预测值', dataIndex: 'value', key: 'value', render: (v: number) => v.toLocaleString('en-US') },
              { title: '修改时间', dataIndex: 'time', key: 'time' },
              { title: '修改人', dataIndex: 'user', key: 'user' }
            ]}
            dataSource={logs.map((log, idx) => ({ ...log, key: idx }))}
            pagination={false}
            bordered
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>取消</Button>
          <Button type="primary" onClick={handleSave}>保存</Button>
        </div>
      </Modal>
    </div>
    </TokenCheck>
  );
};

export default ForecastEntry; 