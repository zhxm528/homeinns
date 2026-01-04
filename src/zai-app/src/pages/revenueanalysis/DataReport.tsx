import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, DatePicker, message, Radio, Select, Checkbox } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';

interface ReportItem {
  key: string;
  name: string;
  description: string;
}

const DataReport: React.FC = () => {
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [form] = Form.useForm();
  const [filterType, setFilterType] = useState<string>('all');

  // 设置dayjs为中文
  dayjs.locale('zh-cn');

  // 筛选选项数据
  const propertyTypeOptions = [
    { label: '产权酒店', value: 'property' },
    { label: '非产权酒店', value: 'non-property' },
  ];

  const managementTypeOptions = [
    { label: '自营', value: 'self-operated' },
    { label: '委托管理', value: 'entrusted' },
    { label: '特许经营', value: 'franchise' },
  ];

  const regionOptions = [
    { label: '北京', value: 'beijing' },
    { label: '外埠', value: 'outbound' },
  ];

  const managementCompanyOptions = [
    { label: '诺金', value: 'nuojin' },
    { label: '建国', value: 'yifei' },
    { label: '南苑', value: 'homeinns' },
  ];

  const reportTypeOptions = [
    { label: '日报', value: 'daily' },
    { label: '月累计', value: 'monthly' },
    { label: '年累计', value: 'yearly' },
  ];

  // 市场营销报表数据
  const marketingReports: ReportItem[] = [
    {
      key: '1',
      name: '根据日期导出日、月、年累计的营收数据报表。',
      description: ''
    }
  ];

  // 财务分析报表数据
  const financeReports: ReportItem[] = [
    {
      key: '1',
      name: '财务分析报表',
      description: ''
    }
  ];

  const handleDownload = (record: ReportItem) => {
    setSelectedReport(record);
    setDownloadModalVisible(true);
    setFilterType('all');
    form.resetFields();
  };

  const handleDownloadConfirm = async () => {
    try {
      const values = await form.validateFields();
      const { selectedDate, propertyType, managementType, region, managementCompany, reportType } = values;
      
      // 这里可以调用实际的下载API
      console.log('下载报表:', {
        reportName: selectedReport?.name,
        selectedDate: selectedDate.format('YYYY-MM-DD'),
        filterType,
        filters: {
          propertyType,
          managementType,
          region,
          managementCompany,
          reportType
        }
      });
      
      message.success('报表下载已开始，请稍候...');
      setDownloadModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleDownloadCancel = () => {
    setDownloadModalVisible(false);
    setSelectedReport(null);
    setFilterType('all');
    form.resetFields();
  };

  const columns: ColumnsType<ReportItem> = [
    {
      title: '报表名称',
      dataIndex: 'name',
      key: 'name',
      width: '70%',
    },
    {
      title: '操作',
      key: 'action',
      width: '30%',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => handleDownload(record)}
        >
          下载
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 市场营销 Panel */}
      <Card title="市场营销" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={marketingReports}
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 财务分析 Panel */}
      <Card title="财务分析" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={financeReports}
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 下载弹窗 */}
      <Modal
        title={`下载报表 - ${selectedReport?.name}`}
        open={downloadModalVisible}
        onOk={handleDownloadConfirm}
        onCancel={handleDownloadCancel}
        okText="确认下载"
        cancelText="取消"
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="选择日期"
            name="selectedDate"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker
              placeholder="请选择日期"
              style={{ width: '100%' }}
              format="YYYY年MM月DD日"
              defaultValue={dayjs()}
              locale={locale.DatePicker}
            />
          </Form.Item>

          <Form.Item
            label="报表类型"
            name="reportType"
            rules={[{ required: true, message: '请选择至少一种报表类型' }]}
          >
            <Checkbox.Group options={reportTypeOptions} />
          </Form.Item>

          <Form.Item
            label="筛选条件"
            name="filterType"
            initialValue="all"
          >
            <Radio.Group 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <Radio value="all">全量</Radio>
              <Radio value="custom">自定义</Radio>
            </Radio.Group>
          </Form.Item>

          {filterType === 'custom' && (
            <>
              <Form.Item
                label="产权类型"
                name="propertyType"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择产权类型"
                  options={propertyTypeOptions}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="管理类型"
                name="managementType"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择管理类型"
                  options={managementTypeOptions}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="地区"
                name="region"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择地区"
                  options={regionOptions}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="管理公司"
                name="managementCompany"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择管理公司"
                  options={managementCompanyOptions}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default DataReport;
