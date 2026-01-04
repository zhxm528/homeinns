import React, { useContext } from 'react';
import { Card, Form, Row, Col, Input, Select, Button } from 'antd';
import { TabContext } from '@/App';

const { Option } = Select;

const CompanyAdd: React.FC = () => {
  const [form] = Form.useForm();
  const tabContext = useContext(TabContext);

  const handleFinish = (values: any) => {
    // TODO: 提交逻辑
    console.log('表单提交:', values);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <h3 style={{ fontWeight: 600, marginBottom: 24 }}>公司档案</h3>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="公司名称"
                name="companyNameCn"
                rules={[{ required: true, message: '请输入公司名称（中文）' }]}
              >
                <Input size="large" placeholder="请输入公司名称（中文）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="统一社会信用代码"
                name="creditCode"
                rules={[{ required: true, message: '请输入社会信用码' }]}
              >
                <Input size="large" placeholder="请输入社会信用码" />
              </Form.Item>
            </Col>
          </Row>

          {/* 联系人1 */}
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="销售员" name="contact1Name">
                <Input size="large" placeholder="请输入销售员" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="联系电话" name="contact1Phone">
                <Input size="large" placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="部门" name="contact1Dept">
                <Input size="large" placeholder="请输入部门" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="邮箱" name="contact1Email">
                <Input size="large" placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>

          {/* 联系人2 */}
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="联系人" name="contact2Name">
                <Input size="large" placeholder="请输入联系人" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="联系电话" name="contact2Phone">
                <Input size="large" placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="部门" name="contact2Dept">
                <Input size="large" placeholder="请输入部门" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="邮箱" name="contact2Email">
                <Input size="large" placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>

          {/* 地区信息 */}
          <Row gutter={24}>            
            <Col span={6}>
              <Form.Item
                label="城市"
                name="city"
              >
                <Select size="large" placeholder="请选择" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="公司地址" name="address">
                <Input size="large" placeholder="请输入公司地址" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="公司状态" name="companyStatus">
                <Select size="large" placeholder="请选择" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="结算方式" name="settlementType">
                <Select size="large" placeholder="请选择" />
              </Form.Item>
            </Col>
          </Row>

          {/* 法人、税号、银行等 */}
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="企业法人" name="legalPerson">
                <Input size="large" placeholder="请输入企业法人" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="税号" name="taxNo">
                <Input size="large" placeholder="请输入税号" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="银行账号" name="bankAccount">
                <Input size="large" placeholder="请输入银行账号" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="开户行" name="bankName">
                <Input size="large" placeholder="请输入开户行" />
              </Form.Item>
            </Col>
          </Row>

          

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="备注" name="remark">
                <Input.TextArea size="large" rows={2} placeholder="请输入备注" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ minWidth: 120 }}>保存</Button>
            <Button size="large" style={{ marginLeft: 16, minWidth: 120 }} onClick={() => form.resetFields()}>重置</Button>
            <Button
              size="large"
              style={{ marginLeft: 16, minWidth: 120 }}
              onClick={() => tabContext?.removeTab('/company/add')}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CompanyAdd;
