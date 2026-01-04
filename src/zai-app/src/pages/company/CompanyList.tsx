import React, { useState } from 'react';
import { Card, Form, Row, Col, Input, Button, Table, Space, Typography, Tag, Tooltip, Modal } from 'antd';
import { SearchOutlined, ReloadOutlined, FileExcelOutlined, PlusOutlined, CheckCircleTwoTone, EditOutlined, DeleteOutlined, ApartmentOutlined, FileDoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const mockData = [
  {
    key: '1',
    archiveNo: 'COC63773',
    creditCode: '91310000710938456A',
    companyName: '丰田汽车金融(中国)有限公司',
    groupSales: '丁雪梅',
    contractPeriod: '无合同',
    hotelCount: '92',
    contractStatus: '-',
    companyStatus: '正常',
  },
  {
    key: '2',
    archiveNo: 'COC07923',
    creditCode: '91310000710938456B',
    companyName: '中国黄金集团有限公司',
    groupSales: '丁雪梅',
    contractPeriod: '2025.06.15 - 2026.06.30',
    hotelCount: '92',
    contractStatus: '待生效',
    companyStatus: '正常',
  },
  // ... 其余 mock 数据 ...
];

const managedCompanyColumns = [
  { title: '结算企业名称', dataIndex: 'managedCompanyName', key: 'managedCompanyName' },
  { title: '结算企业编号', dataIndex: 'managedCompanyNo', key: 'managedCompanyNo' },
  { title: '结算方式', dataIndex: 'settlementType', key: 'settlementType' },
  { title: '资金余额', dataIndex: 'balance', key: 'balance' },
];

const mockManagedCompanies = [
  {
    managedCompanyName: '结算公司A',
    managedCompanyNo: 'M001',
    settlementType: '月结',
    balance: '¥100,000',
  },
  {
    managedCompanyName: '结算公司B',
    managedCompanyNo: 'M002',
    settlementType: '预付',
    balance: '¥50,000',
  },
];

const contractColumns = [
  { title: '合同号', dataIndex: 'contractNo', key: 'contractNo' },
  { title: '合同有效期', dataIndex: 'period', key: 'period' },
  { title: '合同状态', dataIndex: 'status', key: 'status' },
  { title: '合同价格', dataIndex: 'price', key: 'price' },
  { title: '房价码', dataIndex: 'rateCode', key: 'rateCode' },
  { title: '酒店数量', dataIndex: 'hotelCount', key: 'hotelCount' },
];

const mockContracts = [
  {
    contractNo: 'HT2024001',
    period: '2024.01.01 - 2024.12.31',
    status: '生效中',
    price: '¥100,000',
    rateCode: 'RC001',
    hotelCount: 10,
  },
  {
    contractNo: 'HT2023002',
    period: '2023.01.01 - 2023.12.31',
    status: '已结束',
    price: '¥80,000',
    rateCode: 'RC002',
    hotelCount: 8,
  },
];

const CompanyList: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [managedModal, setManagedModal] = useState<{visible: boolean, companyNo?: string, companyName?: string}>({visible: false});
  const [managedData, setManagedData] = useState<any[]>([]);
  const [contractModal, setContractModal] = useState<{visible: boolean, companyNo?: string, companyName?: string}>({visible: false});
  const [contractData, setContractData] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    // TODO: 查询逻辑
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleShowManaged = (record: any) => {
    setManagedModal({ visible: true, companyNo: record.archiveNo, companyName: record.companyName });
    setManagedData(mockManagedCompanies); // 实际可根据record请求数据
  };

  const handleCloseManaged = () => {
    setManagedModal({ visible: false });
    setManagedData([]);
  };

  const handleShowContract = (record: any) => {
    setContractModal({ visible: true, companyNo: record.archiveNo, companyName: record.companyName });
    setContractData(mockContracts); // 实际可根据record请求数据
  };

  const handleCloseContract = () => {
    setContractModal({ visible: false });
    setContractData([]);
  };

  const columns = [
    { title: '公司编号', dataIndex: 'archiveNo', render: (text: string) => <a>{text}</a>, fixed: 'left' as const },
    { title: '统一社会信用代码', dataIndex: 'creditCode' },
    { title: '公司名称', dataIndex: 'companyName' },
    { title: '销售员', dataIndex: 'groupSales' },
    { title: '酒店数', dataIndex: 'hotelCount' },
    { title: '公司状态', dataIndex: 'companyStatus' },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="text"
              shape="circle"
              icon={<EditOutlined />}
              style={{ border: '1px solid #d9d9d9' }}
              onClick={() => {/* TODO: 编辑逻辑 */}}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              style={{ border: '1px solid #d9d9d9' }}
              onClick={() => {/* TODO: 删除逻辑 */}}
            />
          </Tooltip>
          <Tooltip title="结算公司">
            <Button
              type="text"
              shape="circle"
              icon={<ApartmentOutlined />}
              style={{ border: '1px solid #d9d9d9' }}
              onClick={() => handleShowManaged(record)}
            />
          </Tooltip>
          <Tooltip title="合同">
            <Button
              type="text"
              shape="circle"
              icon={<FileDoneOutlined />}
              style={{ border: '1px solid #d9d9d9' }}
              onClick={() => handleShowContract(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="archiveNo" label="公司编号：">
                <Input size="large" placeholder="请输入公司编号" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="companyName" label="企业名称：">
                <Input size="large" placeholder="请输入企业名称" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="groupSales" label="销售员：">
                <Input size="large" placeholder="请输入销售员" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="creditCode" label="统一社会信用代码：">
                <Input size="large" placeholder="统一社会信用代码" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Space>
                <Button size="large" type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
                <Button size="large" onClick={handleReset} icon={<ReloadOutlined />}>重置</Button>
                <Button size="large" icon={<FileExcelOutlined />} style={{ background: '#52c41a', color: '#fff', border: 'none' }}>导出excel</Button>
                <Button
                  size="large"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/company/add')}
                >
                  新建档案
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: 215,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            current: 1,
          }}
          bordered
        />
      </Card>
      <Modal
        open={managedModal.visible}
        title={`${managedModal.companyNo || ''} ${managedModal.companyName || ''}`}
        onCancel={handleCloseManaged}
        footer={null}
        width={700}
      >
        <Table
          columns={managedCompanyColumns}
          dataSource={managedData}
          rowKey="managedCompanyNo"
          pagination={false}
          bordered
          size="small"
        />
      </Modal>
      <Modal
        open={contractModal.visible}
        title={`${contractModal.companyNo || ''} ${contractModal.companyName || ''}`}
        onCancel={handleCloseContract}
        footer={null}
        width={700}
      >
        <Table
          columns={contractColumns}
          dataSource={contractData}
          rowKey="contractNo"
          pagination={false}
          bordered
          size="small"
        />
      </Modal>
    </div>
  );
};

export default CompanyList;
