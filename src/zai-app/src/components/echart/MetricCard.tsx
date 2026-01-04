import React from 'react';
import { Card, Typography, Statistic, Space } from 'antd';

interface MetricCardProps {
  title: string;
  value: string;
  budget: string;
  lastYear: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, budget, lastYear }) => (
  <Card>
    <Statistic
      title={title}
      value={value}
      valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
    />
    <Space style={{ marginTop: '8px' }}>
      <Typography.Text>预算：</Typography.Text>
      <Typography.Text type="danger">{budget}</Typography.Text>
      <Typography.Text>去年：</Typography.Text>
      <Typography.Text type="success">▲{lastYear}</Typography.Text>
    </Space>
  </Card>
);

export default MetricCard;