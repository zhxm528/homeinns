import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Card, Button, Space, Typography, message, Row, Col, Modal, Table } from 'antd';
import { PlusOutlined, MinusCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import TokenCheck from '../../components/common/TokenCheck';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface RoomRequest {
  roomType: string;
  count: number;
}

interface GroupFormData {
  // 基本信息
  teamName: string;
  teamCode: string;
  salesperson: string;
  hotel: string;
  company: string;
  status: string;
  
  // 联系人信息
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  
  // 确认函接收人
  confirmationReceivers: string[];
  
  // 预订需求
  paymentMethod: string[];    // 新增结算方式
  latestCancellationDays: number;  // 新增最晚取消天数
  latestCancellationTime: string;  // 新增入住当晚最晚取消时间
  advanceBookingDays: number;      // 新增提前预订天数
  validPeriod: [dayjs.Dayjs, dayjs.Dayjs];  // 改名：dateRange -> validPeriod
  roomRequests: RoomRequest[];
  estimatedGuestCount: number;
  specialRequests?: string;
}

const GroupAdd: React.FC = () => {
  const [form] = Form.useForm<GroupFormData>();
  const [loading, setLoading] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState({
    basic: true,
    contact: true,
    confirmation: true,
    booking: true
  });

  const togglePanel = (panel: keyof typeof expandedPanels) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  };

  return (
    <div>
      {/* 联系人信息 */}
      <Card 
        title={
          <Space>
            <span>协议公司联系人</span>
            <Button 
              type="text" 
              icon={expandedPanels.contact ? <UpOutlined /> : <DownOutlined />}
              onClick={() => togglePanel('contact')}
            />
          </Space>
        } 
        type="inner"
        bodyStyle={{ display: expandedPanels.contact ? 'block' : 'none' }}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="contactName"
              label="联系人姓名"
              rules={[{ required: true, message: '请输入联系人姓名' }]}
            >
              <Input 
                placeholder="请输入联系人姓名" 
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="contactPhone"
              label="联系电话"
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
              ]}
            >
              <Input 
                placeholder="请输入联系电话" 
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="contactEmail"
              label="联系邮箱（接收预订确认函）"
              rules={[
                { required: true, message: '请输入联系邮箱' },
                { type: 'email', message: '请输入正确的邮箱地址' }
              ]}
            >
              <Input 
                placeholder="请输入联系邮箱" 
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 确认函接收人 */}
      <Card 
        title={
          <Space>
            <span>确认函接收人</span>
            <Button 
              type="text" 
              icon={expandedPanels.confirmation ? <UpOutlined /> : <DownOutlined />}
              onClick={() => togglePanel('confirmation')}
            />
          </Space>
        } 
        type="inner"
        bodyStyle={{ display: expandedPanels.confirmation ? 'block' : 'none' }}
        style={{ marginBottom: 16 }}
      >
        <Form.List
          name="confirmationReceivers"
          initialValue={['']}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                  <Col span={22}>
                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[
                        { required: true, message: '请输入接收邮箱' },
                        { type: 'email', message: '请输入正确的邮箱地址' }
                      ]}
                    >
                      <Input 
                        placeholder="请输入接收确认函的邮箱地址" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        style={{ marginTop: 8 }}
                      />
                    )}
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  size="large"
                >
                  添加接收邮箱
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      {/* 预订需求 */}
    </div>
  );
};

export default GroupAdd; 