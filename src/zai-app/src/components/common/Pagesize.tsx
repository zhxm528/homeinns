import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Select } from 'antd';

const { Option } = Select;

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showSizeChanger = true,
  showQuickJumper = true,
  showTotal = true,
  pageSizeOptions = [10, 50, 100, 200],
  className = ''
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7; // 最多显示7个页码

    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大显示页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 如果总页数大于最大显示页数，需要省略号
      if (current <= 4) {
        // 当前页在前4页
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        // 当前页在后4页
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== current) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onPageSizeChange(newPageSize);
  };

  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 ${className}`}>
      {/* 移动端分页 */}
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => handlePageClick(current - 1)}
          disabled={current === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <button
          onClick={() => handlePageClick(current + 1)}
          disabled={current === totalPages}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>

      {/* 桌面端分页 */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* 左侧：显示总数和每页条数选择 */}
        <div className="flex items-center space-x-4">
          {showTotal && (
            <div className="text-sm text-gray-700">
              显示第 <span className="font-medium">{startItem}</span> 到{' '}
              <span className="font-medium">{endItem}</span> 条，共{' '}
              <span className="font-medium">{total}</span> 条记录
            </div>
          )}
          
          {showSizeChanger && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">每页显示</span>
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                size="small"
                style={{ width: 80 }}
              >
                {pageSizeOptions.map(size => (
                  <Option key={size} value={size}>
                    {size}条
                  </Option>
                ))}
              </Select>
            </div>
          )}
        </div>

        {/* 右侧：分页导航 */}
        <div>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {/* 上一页按钮 */}
            <button
              onClick={() => handlePageClick(current - 1)}
              disabled={current === 1}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="h-5 w-5" />
            </button>

            {/* 页码按钮 */}
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? handlePageClick(page) : undefined}
                disabled={typeof page === 'string'}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  typeof page === 'number'
                    ? page === current
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    : 'bg-white border-gray-300 text-gray-400 cursor-default'
                }`}
              >
                {page}
              </button>
            ))}

            {/* 下一页按钮 */}
            <button
              onClick={() => handlePageClick(current + 1)}
              disabled={current === totalPages}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

/*
使用示例：

import Pagination from '../../components/common/Pagesize';

// 在组件中使用
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [total, setTotal] = useState(0);

const handlePageChange = (page: number) => {
  setCurrentPage(page);
  // 重新加载数据
  fetchData(page, pageSize);
};

const handlePageSizeChange = (newPageSize: number) => {
  setPageSize(newPageSize);
  setCurrentPage(1); // 重置到第一页
  // 重新加载数据
  fetchData(1, newPageSize);
};

// 在JSX中使用
<Pagination
  current={currentPage}
  total={total}
  pageSize={pageSize}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
  showSizeChanger={true}
  showTotal={true}
  pageSizeOptions={[10, 50, 100, 200]}
  className="mt-4 rounded-lg shadow"
/>
*/
