import React, { useState } from 'react';
import { DatePicker, Button, Table, Collapse, Select, Card, Space, Typography, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'antd/dist/reset.css';
import TokenCheck from '../../components/common/TokenCheck';

const { Panel } = Collapse;

const columns = [
  { 
    title: '项目', 
    dataIndex: 'name', 
    key: 'name', 
    fixed: 'left' as const, 
    width: 120,
    align: 'left' as const,
    onHeaderCell: () => ({
      style: {
        textAlign: 'center' as const
      }
    })
  },
  { 
    title: '入住率', 
    dataIndex: 'occupancy', 
    key: 'occupancy', 
    align: 'right' as const, 
    width: 90,
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#000000',
        color: '#fff',
        fontWeight: 500,
        textAlign: 'center' as const
      }
    })
  },
  { 
    title: '平均房价', 
    dataIndex: 'avgPrice', 
    key: 'avgPrice', 
    align: 'right' as const, 
    width: 100,
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#000000',
        color: '#fff',
        fontWeight: 500,
        textAlign: 'center' as const
      }
    })
  },
  { 
    title: '每间收益', 
    dataIndex: 'perRoomIncome', 
    key: 'perRoomIncome', 
    align: 'right' as const, 
    width: 100,
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#000000',
        color: '#fff',
        fontWeight: 500,
        textAlign: 'center' as const
      }
    })
  },
  { 
    title: '总收入', 
    dataIndex: 'income', 
    key: 'income', 
    align: 'right' as const, 
    width: 110,
    onHeaderCell: () => ({
      style: {
        textAlign: 'center' as const
      }
    })
  },
  { 
    title: '预算', 
    dataIndex: 'budget', 
    key: 'budget', 
    align: 'right' as const, 
    width: 100,
    onHeaderCell: () => ({
      style: {
        textAlign: 'center' as const
      }
    })
  },
  { 
    title: '完成率', 
    dataIndex: 'rate', 
    key: 'rate', 
    align: 'right' as const, 
    width: 90,
    onHeaderCell: () => ({
      style: {
        textAlign: 'center' as const
      }
    })
  },
  { 
    title: '上年同期', 
    dataIndex: 'lastYear', 
    key: 'lastYear', 
    align: 'right' as const, 
    width: 110,
    onHeaderCell: () => ({
      style: {
        textAlign: 'center' as const
      }
    })
  },
  { 
    title: '增长率', 
    dataIndex: 'growth', 
    key: 'growth', 
    align: 'right' as const, 
    width: 90,
    onHeaderCell: () => ({
      style: {
        textAlign: 'center' as const
      }
    })
  },
  { 
    title: '月进度', 
    dataIndex: 'monthProgress', 
    key: 'monthProgress', 
    align: 'right' as const, 
    width: 90,
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#000000',
        color: '#fff',
        fontWeight: 500,
        textAlign: 'center' as const
      }
    })
  },
  { 
    title: '年进度', 
    dataIndex: 'yearProgress', 
    key: 'yearProgress', 
    align: 'right' as const, 
    width: 90,
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#000000',
        color: '#fff',
        fontWeight: 500,
        textAlign: 'center' as const
      }
    })
  },
];

const hotelData = [
  { key: '1', name: '广州洲际', occupancy: '81%', avgPrice: '981', perRoomIncome: '795', income: '36,750', budget: '40,057', rate: '61%', lastYear: '60,571', growth: '-47%', monthProgress: '47%', yearProgress: '18%' },
  { key: '2', name: '三亚璞丽', occupancy: '77%', avgPrice: '1,308', perRoomIncome: '1,008', income: '28,900', budget: '37,000', rate: '77%', lastYear: '34,571', growth: '-17%', monthProgress: '41%', yearProgress: '15%' },
  { key: '3', name: '佛山洲际', occupancy: '53%', avgPrice: '553', perRoomIncome: '293', income: '19,400', budget: '23,000', rate: '53%', lastYear: '22,375', growth: '-13%', monthProgress: '48%', yearProgress: '19%' },
  { key: '4', name: '东平洲际', occupancy: '87%', avgPrice: '917', perRoomIncome: '798', income: '25,900', budget: '26,875', rate: '73%', lastYear: '22,375', growth: '15%', monthProgress: '50%', yearProgress: '20%' },
  { key: '5', name: '汕尾逸林', occupancy: '71%', avgPrice: '1,118', perRoomIncome: '795', income: '23,100', budget: '23,175', rate: '71%', lastYear: '19,375', growth: '19%', monthProgress: '44%', yearProgress: '16%' },
  { key: '6', name: '重庆皇冠', occupancy: '64%', avgPrice: '1,017', perRoomIncome: '651', income: '21,900', budget: '22,000', rate: '64%', lastYear: '18,000', growth: '22%', monthProgress: '43%', yearProgress: '16%' },
  { key: '7', name: '科学城洲际', occupancy: '68%', avgPrice: '1,100', perRoomIncome: '748', income: '20,800', budget: '21,000', rate: '68%', lastYear: '17,000', growth: '22%', monthProgress: '44%', yearProgress: '16%' },
];

const manageModes = [
  '置业产权', '首酒产权', '北展产权', '委托管理', '特许'
];

const guestIncomeColumns = [
  { title: '项目', dataIndex: 'name', key: 'name', width: 100 },
  { title: '实际', dataIndex: 'actual', key: 'actual', align: 'right' as const, width: 90 },
  { title: '预算', dataIndex: 'budget', key: 'budget', align: 'right' as const, width: 90 },
  { title: '完成率', dataIndex: 'rate', key: 'rate', align: 'right' as const, width: 80 },
  { title: '上年同期', dataIndex: 'lastYear', key: 'lastYear', align: 'right' as const, width: 90 },
  { title: '增长率', dataIndex: 'growth', key: 'growth', align: 'right' as const, width: 80 },
];

// Helper to compute average for a column in a data array (ignoring '合计' row)
function avgColForData(data: any[], key: string, percent = false) {
  const nums = data.filter(r => r.key !== 'total').map(r => {
    let v = r[key];
    if (typeof v === 'string') {
      v = v.replace(/%/g, '').replace(/,/g, '');
    }
    return v ? Number(v) : undefined;
  }).filter((v: any) => typeof v === 'number' && !isNaN(v)) as number[];
  if (!nums.length) return '';
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return percent ? Math.round(avg) + '%' : Math.round(avg).toLocaleString('en-US');
}

// Helper to compute sum for a column in a data array (ignoring '合计' row)
function sumColForData(data: any[], key: string) {
  const nums = data.filter(r => r.key !== 'total').map(r => {
    let v = r[key];
    if (typeof v === 'string') {
      v = v.replace(/,/g, '');
    }
    return v ? Number(v) : undefined;
  }).filter((v: any) => typeof v === 'number' && !isNaN(v)) as number[];
  if (!nums.length) return '';
  const sum = nums.reduce((a, b) => a + b, 0);
  return Math.round(sum).toLocaleString('en-US');
}

const guestIncomeData = [
  { key: '1', name: '广州洲际', actual: '36,750', budget: '40,057', rate: '61%', lastYear: '60,571', growth: '-47%' },
  { key: '2', name: '三亚璞丽', actual: '28,900', budget: '37,000', rate: '77%', lastYear: '34,571', growth: '-17%' },
  { key: '3', name: '佛山洲际', actual: '19,400', budget: '23,000', rate: '53%', lastYear: '22,375', growth: '-13%' },
  { key: '4', name: '东平洲际', actual: '25,900', budget: '26,875', rate: '73%', lastYear: '22,375', growth: '15%' },
  { key: '5', name: '汕尾逸林', actual: '23,100', budget: '23,175', rate: '71%', lastYear: '19,375', growth: '19%' },
  { key: '6', name: '重庆皇冠', actual: '21,900', budget: '22,000', rate: '64%', lastYear: '18,000', growth: '22%' },
  { key: 'total', name: '合计', actual: '176,750', budget: '193,107', rate: avgColForData([
    { key: '1', rate: '61%' },
    { key: '2', rate: '77%' },
    { key: '3', rate: '53%' },
    { key: '4', rate: '73%' },
    { key: '5', rate: '71%' },
    { key: '6', rate: '64%' },
  ], 'rate', true), lastYear: '193,296', growth: avgColForData([
    { key: '1', growth: '-47%' },
    { key: '2', growth: '-17%' },
    { key: '3', growth: '-13%' },
    { key: '4', growth: '15%' },
    { key: '5', growth: '19%' },
    { key: '6', growth: '22%' },
  ], 'growth', true) },
];

const occupancyColumns = [
  { title: '项目', dataIndex: 'name', key: 'name', width: 120 },
  { title: '实际', dataIndex: 'actual', key: 'actual', align: 'right' as const, width: 100 },
  { title: '预算', dataIndex: 'budget', key: 'budget', align: 'right' as const, width: 100 },
  { title: '完成率', dataIndex: 'rate', key: 'rate', align: 'right' as const, width: 90 },
  { title: '上年同期', dataIndex: 'lastYear', key: 'lastYear', align: 'right' as const, width: 110 },
  { title: '增长率', dataIndex: 'growth', key: 'growth', align: 'right' as const, width: 90 },
];
const occupancyData = [
  { key: '1', name: '广州洲际', actual: '81%', budget: '90%', rate: '90%', lastYear: '88%', growth: '-7%' },
  { key: '2', name: '三亚璞丽', actual: '77%', budget: '85%', rate: '91%', lastYear: '84%', growth: '-8%' },
  { key: '3', name: '佛山洲际', actual: '53%', budget: '60%', rate: '88%', lastYear: '59%', growth: '-10%' },
  { key: '4', name: '东平洲际', actual: '87%', budget: '90%', rate: '97%', lastYear: '89%', growth: '-2%' },
  { key: '5', name: '汕尾逸林', actual: '71%', budget: '75%', rate: '95%', lastYear: '73%', growth: '-3%' },
  { key: '6', name: '重庆皇冠', actual: '64%', budget: '70%', rate: '91%', lastYear: '68%', growth: '-6%' },
  { key: 'total', name: '合计', actual: avgColForData([
    { key: '1', actual: '81%' },
    { key: '2', actual: '77%' },
    { key: '3', actual: '53%' },
    { key: '4', actual: '87%' },
    { key: '5', actual: '71%' },
    { key: '6', actual: '64%' },
  ], 'actual', true), budget: avgColForData([
    { key: '1', budget: '90%' },
    { key: '2', budget: '85%' },
    { key: '3', budget: '60%' },
    { key: '4', budget: '90%' },
    { key: '5', budget: '75%' },
    { key: '6', budget: '70%' },
  ], 'budget', true), rate: avgColForData([
    { key: '1', rate: '90%' },
    { key: '2', rate: '91%' },
    { key: '3', rate: '88%' },
    { key: '4', rate: '97%' },
    { key: '5', rate: '95%' },
    { key: '6', rate: '91%' },
  ], 'rate', true), lastYear: avgColForData([
    { key: '1', lastYear: '88%' },
    { key: '2', lastYear: '84%' },
    { key: '3', lastYear: '59%' },
    { key: '4', lastYear: '89%' },
    { key: '5', lastYear: '73%' },
    { key: '6', lastYear: '68%' },
  ], 'lastYear', true), growth: avgColForData([
    { key: '1', growth: '-7%' },
    { key: '2', growth: '-8%' },
    { key: '3', growth: '-10%' },
    { key: '4', growth: '-2%' },
    { key: '5', growth: '-3%' },
    { key: '6', growth: '-6%' },
  ], 'growth', true) },
];
const avgPriceColumns = [
  { title: '项目', dataIndex: 'name', key: 'name', width: 120 },
  { title: '实际', dataIndex: 'actual', key: 'actual', align: 'right' as const, width: 100 },
  { title: '预算', dataIndex: 'budget', key: 'budget', align: 'right' as const, width: 100 },
  { title: '完成率', dataIndex: 'rate', key: 'rate', align: 'right' as const, width: 90 },
  { title: '上年同期', dataIndex: 'lastYear', key: 'lastYear', align: 'right' as const, width: 110 },
  { title: '增长率', dataIndex: 'growth', key: 'growth', align: 'right' as const, width: 90 },
];
const avgPriceData = [
  { key: '1', name: '广州洲际', actual: '981', budget: '1,000', rate: '98%', lastYear: '1,050', growth: '-7%' },
  { key: '2', name: '三亚璞丽', actual: '1,308', budget: '1,400', rate: '93%', lastYear: '1,350', growth: '-3%' },
  { key: '3', name: '佛山洲际', actual: '553', budget: '600', rate: '92%', lastYear: '590', growth: '-6%' },
  { key: '4', name: '东平洲际', actual: '917', budget: '950', rate: '97%', lastYear: '930', growth: '-1%' },
  { key: '5', name: '汕尾逸林', actual: '1,118', budget: '1,200', rate: '93%', lastYear: '1,150', growth: '-3%' },
  { key: '6', name: '重庆皇冠', actual: '1,017', budget: '1,100', rate: '92%', lastYear: '1,050', growth: '-3%' },
  { key: 'total', name: '合计', actual: sumColForData([
    { key: '1', actual: '981' },
    { key: '2', actual: '1,308' },
    { key: '3', actual: '553' },
    { key: '4', actual: '917' },
    { key: '5', actual: '1,118' },
    { key: '6', actual: '1,017' },
  ], 'actual'), budget: sumColForData([
    { key: '1', budget: '1,000' },
    { key: '2', budget: '1,400' },
    { key: '3', budget: '600' },
    { key: '4', budget: '950' },
    { key: '5', budget: '1,200' },
    { key: '6', budget: '1,100' },
  ], 'budget'), rate: avgColForData([
    { key: '1', rate: '98%' },
    { key: '2', rate: '93%' },
    { key: '3', rate: '92%' },
    { key: '4', rate: '97%' },
    { key: '5', rate: '93%' },
    { key: '6', rate: '92%' },
  ], 'rate', true), lastYear: sumColForData([
    { key: '1', lastYear: '1,050' },
    { key: '2', lastYear: '1,350' },
    { key: '3', lastYear: '590' },
    { key: '4', lastYear: '930' },
    { key: '5', lastYear: '1,150' },
    { key: '6', lastYear: '1,050' },
  ], 'lastYear'), growth: avgColForData([
    { key: '1', growth: '-7%' },
    { key: '2', growth: '-3%' },
    { key: '3', growth: '-6%' },
    { key: '4', growth: '-1%' },
    { key: '5', growth: '-3%' },
    { key: '6', growth: '-3%' },
  ], 'growth', true) },
];
const revparColumns = [
  { title: '项目', dataIndex: 'name', key: 'name', width: 120 },
  { title: '实际', dataIndex: 'actual', key: 'actual', align: 'right' as const, width: 100 },
  { title: '预算', dataIndex: 'budget', key: 'budget', align: 'right' as const, width: 100 },
  { title: '完成率', dataIndex: 'rate', key: 'rate', align: 'right' as const, width: 90 },
  { title: '上年同期', dataIndex: 'lastYear', key: 'lastYear', align: 'right' as const, width: 110 },
  { title: '增长率', dataIndex: 'growth', key: 'growth', align: 'right' as const, width: 90 },
];
const revparData = [
  { key: '1', name: '广州洲际', actual: '845', budget: '900', rate: '94%', lastYear: '924', growth: '-9%' },
  { key: '2', name: '三亚璞丽', actual: '1,008', budget: '1,190', rate: '85%', lastYear: '1,134', growth: '-11%' },
  { key: '3', name: '佛山洲际', actual: '293', budget: '360', rate: '81%', lastYear: '348', growth: '-16%' },
  { key: '4', name: '东平洲际', actual: '798', budget: '855', rate: '93%', lastYear: '828', growth: '-4%' },
  { key: '5', name: '汕尾逸林', actual: '795', budget: '900', rate: '88%', lastYear: '840', growth: '-5%' },
  { key: '6', name: '重庆皇冠', actual: '651', budget: '770', rate: '85%', lastYear: '714', growth: '-9%' },
  { key: 'total', name: '合计', actual: sumColForData([
    { key: '1', actual: '845' },
    { key: '2', actual: '1,008' },
    { key: '3', actual: '293' },
    { key: '4', actual: '798' },
    { key: '5', actual: '795' },
    { key: '6', actual: '651' },
  ], 'actual'), budget: sumColForData([
    { key: '1', budget: '900' },
    { key: '2', budget: '1,190' },
    { key: '3', budget: '360' },
    { key: '4', budget: '855' },
    { key: '5', budget: '900' },
    { key: '6', budget: '770' },
  ], 'budget'), rate: avgColForData([
    { key: '1', rate: '94%' },
    { key: '2', rate: '85%' },
    { key: '3', rate: '81%' },
    { key: '4', rate: '93%' },
    { key: '5', rate: '88%' },
    { key: '6', rate: '85%' },
  ], 'rate', true), lastYear: sumColForData([
    { key: '1', lastYear: '924' },
    { key: '2', lastYear: '1,134' },
    { key: '3', lastYear: '348' },
    { key: '4', lastYear: '828' },
    { key: '5', lastYear: '840' },
    { key: '6', lastYear: '714' },
  ], 'lastYear'), growth: avgColForData([
    { key: '1', growth: '-9%' },
    { key: '2', growth: '-11%' },
    { key: '3', growth: '-16%' },
    { key: '4', growth: '-4%' },
    { key: '5', growth: '-5%' },
    { key: '6', growth: '-9%' },
  ], 'growth', true) },
];

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

// Helper to compute average for a column (ignoring '合计' row)
function avgCol(key: keyof typeof hotelData[0] | string, percent = false) {
  const nums = hotelData.filter(r => r.key !== 'total').map(r => {
    let v = (r as any)[key];
    if (typeof v === 'string') {
      v = v.replace(/%/g, '').replace(/,/g, '');
    }
    return v ? Number(v) : undefined;
  }).filter((v: any) => typeof v === 'number' && !isNaN(v)) as number[];
  if (!nums.length) return '';
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return percent ? Math.round(avg) + '%' : Math.round(avg).toLocaleString('en-US');
}

const totalRow = {
  key: 'total',
  name: '合计',
  occupancy: avgCol('occupancy', true),
  avgPrice: avgCol('avgPrice'),
  perRoomIncome: avgCol('perRoomIncome'),
  income: '176,750',
  budget: '193,107',
  rate: avgCol('rate', true),
  lastYear: '193,296',
  growth: avgCol('growth', true),
  monthProgress: avgCol('monthProgress', true),
  yearProgress: avgCol('yearProgress', true)
};

const dataSource = [...hotelData, totalRow];

const foodIncomeColumns = [
  { title: '项目', dataIndex: 'name', key: 'name', width: 100 },
  { title: '实际', dataIndex: 'actual', key: 'actual', align: 'right' as const, width: 90 },
  { title: '预算', dataIndex: 'budget', key: 'budget', align: 'right' as const, width: 90 },
  { title: '完成率', dataIndex: 'rate', key: 'rate', align: 'right' as const, width: 80 },
  { title: '上年同期', dataIndex: 'lastYear', key: 'lastYear', align: 'right' as const, width: 90 },
  { title: '增长率', dataIndex: 'growth', key: 'growth', align: 'right' as const, width: 80 },
];

const otherIncomeColumns = [
  { title: '项目', dataIndex: 'name', key: 'name', width: 100 },
  { title: '实际', dataIndex: 'actual', key: 'actual', align: 'right' as const, width: 90 },
  { title: '预算', dataIndex: 'budget', key: 'budget', align: 'right' as const, width: 90 },
  { title: '完成率', dataIndex: 'rate', key: 'rate', align: 'right' as const, width: 80 },
  { title: '上年同期', dataIndex: 'lastYear', key: 'lastYear', align: 'right' as const, width: 90 },
  { title: '增长率', dataIndex: 'growth', key: 'growth', align: 'right' as const, width: 80 },
];

const foodIncomeData = [
  { key: '1', name: '广州洲际', actual: '12,500', budget: '13,000', rate: '96%', lastYear: '12,800', growth: '-2%' },
  { key: '2', name: '三亚璞丽', actual: '15,200', budget: '15,500', rate: '98%', lastYear: '15,000', growth: '1%' },
  { key: '3', name: '佛山洲际', actual: '8,300', budget: '8,500', rate: '98%', lastYear: '8,200', growth: '1%' },
  { key: '4', name: '东平洲际', actual: '9,800', budget: '10,000', rate: '98%', lastYear: '9,700', growth: '1%' },
  { key: '5', name: '汕尾逸林', actual: '7,500', budget: '7,800', rate: '96%', lastYear: '7,400', growth: '1%' },
  { key: '6', name: '重庆皇冠', actual: '10,200', budget: '10,500', rate: '97%', lastYear: '10,000', growth: '2%' },
  { key: 'total', name: '合计', actual: '63,500', budget: '65,300', rate: avgColForData([
    { key: '1', rate: '96%' },
    { key: '2', rate: '98%' },
    { key: '3', rate: '98%' },
    { key: '4', rate: '98%' },
    { key: '5', rate: '96%' },
    { key: '6', rate: '97%' },
  ], 'rate', true), lastYear: '63,100', growth: avgColForData([
    { key: '1', growth: '-2%' },
    { key: '2', growth: '1%' },
    { key: '3', growth: '1%' },
    { key: '4', growth: '1%' },
    { key: '5', growth: '1%' },
    { key: '6', growth: '2%' },
  ], 'growth', true) },
];

const otherIncomeData = [
  { key: '1', name: '广州洲际', actual: '5,200', budget: '5,500', rate: '95%', lastYear: '5,300', growth: '-2%' },
  { key: '2', name: '三亚璞丽', actual: '6,800', budget: '7,000', rate: '97%', lastYear: '6,700', growth: '1%' },
  { key: '3', name: '佛山洲际', actual: '3,500', budget: '3,800', rate: '92%', lastYear: '3,400', growth: '3%' },
  { key: '4', name: '东平洲际', actual: '4,200', budget: '4,500', rate: '93%', lastYear: '4,100', growth: '2%' },
  { key: '5', name: '汕尾逸林', actual: '3,200', budget: '3,500', rate: '91%', lastYear: '3,100', growth: '3%' },
  { key: '6', name: '重庆皇冠', actual: '4,500', budget: '4,800', rate: '94%', lastYear: '4,400', growth: '2%' },
  { key: 'total', name: '合计', actual: '27,400', budget: '29,100', rate: avgColForData([
    { key: '1', rate: '95%' },
    { key: '2', rate: '97%' },
    { key: '3', rate: '92%' },
    { key: '4', rate: '93%' },
    { key: '5', rate: '91%' },
    { key: '6', rate: '94%' },
  ], 'rate', true), lastYear: '27,000', growth: avgColForData([
    { key: '1', growth: '-2%' },
    { key: '2', growth: '1%' },
    { key: '3', growth: '3%' },
    { key: '4', growth: '2%' },
    { key: '5', growth: '3%' },
    { key: '6', growth: '2%' },
  ], 'growth', true) },
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

const HotelSummaryReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs(), dayjs()]);
  const [selectedManageModes, setSelectedManageModes] = React.useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = React.useState<string[]>([]);
  const [selectedManageTypes, setSelectedManageTypes] = React.useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = React.useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = React.useState<string[]>([]);
  const [selectedCityAreas, setSelectedCityAreas] = React.useState<string[]>([]);
  const [selectedStoreAges, setSelectedStoreAges] = React.useState<string[]>([]);

  return (
    <TokenCheck>
      <div className="p-6">
        {/* 查询条件区域 */}
        <Card style={{ marginBottom: '24px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Typography.Title level={4}>酒店项目日报</Typography.Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <DatePicker.RangePicker
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                  allowClear={false}
                  format="YYYY-MM-DD"
                  locale={locale}
                  style={{ width: '100%' }}
                />
              </Col>
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
                <Space>
                  <Button type="primary">查询</Button>
                  <Button>重置</Button>
                </Space>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* 汇总指标 */}
        <Collapse defaultActiveKey={["1"]} style={{ background: 'transparent', marginBottom: '24px' }}>
          <Panel header="汇总指标" key="1">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              scroll={{ x: 1000 }}
              bordered
              size="middle"
            />
          </Panel>
        </Collapse>

        {/* 分项指标 */}
        <Collapse defaultActiveKey={["room-metrics"]} style={{ background: 'transparent' }}>
          <Panel header="分项指标" key="room-metrics">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card title="入住率" bordered={false}>
                    <Table 
                      columns={occupancyColumns} 
                      dataSource={occupancyData} 
                      pagination={false} 
                      size="small" 
                      bordered 
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="平均房价（元/间夜）" bordered={false}>
                    <Table 
                      columns={avgPriceColumns} 
                      dataSource={avgPriceData} 
                      pagination={false} 
                      size="small" 
                      bordered 
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card title="每房收益（元/间夜）" bordered={false}>
                    <Table 
                      columns={revparColumns} 
                      dataSource={revparData} 
                      pagination={false} 
                      size="small" 
                      bordered 
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="客房收入（万元）" bordered={false}>
                    <Table 
                      columns={guestIncomeColumns} 
                      dataSource={guestIncomeData} 
                      pagination={false} 
                      size="small" 
                      bordered 
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card title="餐饮收入（万元）" bordered={false}>
                    <Table 
                      columns={foodIncomeColumns} 
                      dataSource={foodIncomeData} 
                      pagination={false} 
                      size="small" 
                      bordered 
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="其他收入（万元）" bordered={false}>
                    <Table 
                      columns={otherIncomeColumns} 
                      dataSource={otherIncomeData} 
                      pagination={false} 
                      size="small" 
                      bordered 
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Panel>
        </Collapse>
      </div>
    </TokenCheck>
  );
};

export default HotelSummaryReport; 