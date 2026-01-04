import React from 'react';
import { Card, Row, Col, Typography, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title } = Typography;

const RevenueAnalysis: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>收益分析</Title>
      
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收入"
              value={112893}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="客房收入"
              value={92893}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="餐饮收入"
              value={20000}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix="¥"
              suffix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="其他收入"
              value={0}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="收益趋势">
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              收益趋势图表
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="收入构成">
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              收入构成饼图
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="收益分析概览">
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              收益分析详细数据表格
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RevenueAnalysis; 