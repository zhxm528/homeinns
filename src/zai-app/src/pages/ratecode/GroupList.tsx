import React, { useState } from 'react';
import { Table, Card, Button, Select, Input, Space, Form, Row, Col, Typography, message, Tooltip, Modal } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import FuturePeriodDate from '../../components/common/FuturePeriodDate';
import TokenCheck from '../../components/common/TokenCheck';


interface GroupInfo {
  id: string;
  groupName: string;
  groupCode: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  roomCount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createTime: string;
  createUser: string;
  salesperson: string;  // 销售员
  booker: string;      // 预订人
  company: string;     // 协议公司
}

const mockData: GroupInfo[] = [
  {
    id: '1',
    groupName: '北京旅游团',
    groupCode: 'BJ20240301',
    hotelName: '北京建国饭店',
    checkIn: '2024-03-01',
    checkOut: '2024-03-05',
    roomCount: 20,
    status: 'confirmed',
    createTime: '2024-02-20 10:00:00',
    createUser: '张三',
    salesperson: '王五',
    booker: '赵六',
    company: '北京旅游有限公司'
  },
  {
    id: '2',
    groupName: '上海商务团',
    groupCode: 'SH20240305',
    hotelName: '上海建国饭店',
    checkIn: '2024-03-05',
    checkOut: '2024-03-07',
    roomCount: 15,
    status: 'pending',
    createTime: '2024-02-21 14:30:00',
    createUser: '李四',
    salesperson: '钱七',
    booker: '孙八',
    company: '上海商务服务有限公司'
  }
];

const GroupList: React.FC = () => {
  const navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [data, setData] = useState<GroupInfo[]>(mockData);
  const [loading, setLoading] = useState(false);

  // 处理预订
  const handleBooking = (record: GroupInfo) => {
    navigate(`/api/ratecode/group/booking/${record.id}`);
  };

  // 表格列定义
  const columns: ColumnsType<GroupInfo> = [
    {
      title: '团队名称',
      dataIndex: 'groupName',
      key: 'groupName',
      width: 150,
    },
    {
      title: '团队编号',
      dataIndex: 'groupCode',
      key: 'groupCode',
      width: 120,
    },
    {
      title: '酒店名称',
      dataIndex: 'hotelName',
      key: 'hotelName',
      width: 150,
    },
    {
      title: '销售员',
      dataIndex: 'salesperson',
      key: 'salesperson',
      width: 100,
    },
    {
      title: '协议公司',
      dataIndex: 'company',
      key: 'company',
      width: 150,
    },
    {
      title: '开始日期',
      dataIndex: 'checkIn',
      key: 'checkIn',
      width: 120,
    },
    {
      title: '结束日期',
      dataIndex: 'checkOut',
      key: 'checkOut',
      width: 120,
    },
    {
      title: '房间数',
      dataIndex: 'roomCount',
      key: 'roomCount',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          pending: { text: '草稿', color: 'orange' },
          confirmed: { text: '预订中', color: 'green' },
          cancelled: { text: '已完成', color: 'red' }
        };
        return <span style={{ color: statusMap[status as keyof typeof statusMap].color }}>
          {statusMap[status as keyof typeof statusMap].text}
        </span>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 处理搜索
  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    // TODO: 实现搜索逻辑
  };

  // 处理新增
  const handleAdd = () => {
    navigate('/api/ratecode/group/add');
  };

  // 处理编辑
  const handleEdit = (record: GroupInfo) => {
    navigate(`/api/ratecode/group/edit/${record.id}`);
  };

  // 处理删除
  const handleDelete = (record: GroupInfo) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除团队"${record.groupName}"吗？`,
      onOk: () => {
        // TODO: 实现删除逻辑
        message.success('删除成功');
      }
    });
  };

  return (
    <TokenCheck checkToken={false}>
      <div style={{ padding: 24 }}>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Typography.Title level={4}>团队</Typography.Title>
            
            {/* 搜索表单 */}
            <Form
              form={searchForm}
              onFinish={handleSearch}
              layout="vertical"
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="groupName" label="团队名称">
                    <Input size="large" placeholder="请输入团队名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="groupCode" label="团队编号">
                    <Input size="large" placeholder="请输入团队编号" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="hotelName" label="酒店名称">
                    <Input size="large" placeholder="请输入酒店名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="salesperson" label="销售员">
                    <Input size="large" placeholder="请输入销售员" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="booker" label="预订人">
                    <Input size="large" placeholder="请输入预订人" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="company" label="协议公司">
                    <Input size="large" placeholder="请输入协议公司" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="dateRange" label="开始日期" style={{ width: '100%' }}>
                    <FuturePeriodDate />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="status" label="状态">
                    <Select
                      size="large"
                      placeholder="请选择状态"
                      options={[
                        { label: '草稿', value: 'pending' },
                        { label: '预订中', value: 'confirmed' },
                        { label: '已完成', value: 'cancelled' }
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label=" " colon={false}>
                    <Space>
                      <Button size="large" type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        查询
                      </Button>
                      <Button size="large" onClick={() => searchForm.resetFields()}>
                        重置
                      </Button>
                      <Button size="large" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        新增团队
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            {/* 数据表格 */}
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              scroll={{ x: 1300 }}
              pagination={{
                total: data.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`
              }}
            />
          </Space>
        </Card>
      </div>
    </TokenCheck>
  );
};

export default GroupList;
