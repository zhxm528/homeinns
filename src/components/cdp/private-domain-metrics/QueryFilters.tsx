'use client';

import { useEffect, useRef, useState } from "react";

export type PrivateDomainFilters = {
  managementType: string;
  region: string;
  cityArea: string;
  storeAge: string;
  city: string;
  hotel: string;
  startDate: string;
  endDate: string;
  selectedPeriod?: "week" | "month" | "quarter" | "year" | null;
};

type QueryFiltersProps = {
  onChange?: (filters: PrivateDomainFilters) => void;
};

const defaultOptions = {
  managementType: ["直营", "加盟", "合作"],
  region: ["华北", "华东", "华南", "西南"],
  cityArea: ["核心城区", "非核心城区", "郊区"],
  storeAge: ["1年内", "1-3年", "3-5年", "5年以上"],
  city: ["北京", "上海", "广州", "深圳"],
  hotel: ["示例酒店A", "示例酒店B", "示例酒店C"],
};

export default function QueryFilters({ onChange }: QueryFiltersProps) {
  const [filters, setFilters] = useState<PrivateDomainFilters>({
    managementType: "",
    region: "",
    cityArea: "",
    storeAge: "",
    city: "",
    hotel: "",
    startDate: "",
    endDate: "",
  });
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "quarter" | "year" | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const pickerRef = useRef<HTMLDivElement | null>(null);

  // 初始化默认为本季度
  useEffect(() => {
    if (!isInitialized) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
      const quarterStart = new Date(today.getFullYear(), quarterStartMonth, 1);
      
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      setFilters((prev) => ({
        ...prev,
        startDate: formatDate(quarterStart),
        endDate: formatDate(today),
      }));
      setSelectedPeriod("quarter");
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    onChange?.({ ...filters, selectedPeriod });
  }, [filters, selectedPeriod, onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!pickerRef.current) {
        return;
      }
      if (!pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    if (isPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPickerOpen]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDate = (value: string) => {
    if (!value) {
      return null;
    }
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) {
      return null;
    }
    return new Date(year, month - 1, day);
  };

  const startDate = parseDate(filters.startDate);
  const endDate = parseDate(filters.endDate);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) {
      return false;
    }
    const value = date.getTime();
    return value >= startDate.getTime() && value <= endDate.getTime();
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setFilters((prev) => ({
        ...prev,
        startDate: formatDate(date),
        endDate: "",
      }));
      return;
    }
    if (startDate && !endDate) {
      if (date.getTime() < startDate.getTime()) {
        setFilters((prev) => ({
          ...prev,
          startDate: formatDate(date),
          endDate: formatDate(startDate),
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          endDate: formatDate(date),
        }));
      }
    }
  };

  const getMonthMatrix = (baseDate: Date) => {
    const firstDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const startWeekDay = firstDay.getDay();
    const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
    const matrix: Date[] = [];
    for (let i = 0; i < startWeekDay; i += 1) {
      matrix.push(new Date(baseDate.getFullYear(), baseDate.getMonth(), i - startWeekDay + 1));
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      matrix.push(new Date(baseDate.getFullYear(), baseDate.getMonth(), day));
    }
    while (matrix.length % 7 !== 0) {
      const last = matrix[matrix.length - 1];
      matrix.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
    }
    return matrix;
  };

  const addMonths = (baseDate: Date, diff: number) =>
    new Date(baseDate.getFullYear(), baseDate.getMonth() + diff, 1);

  const applyShortcut = (type: "yesterday" | "week" | "month" | "quarter") => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (type === "yesterday") {
      const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      setFilters((prev) => ({
        ...prev,
        startDate: formatDate(yesterday),
        endDate: formatDate(yesterday),
      }));
      return;
    }
    if (type === "week") {
      const day = today.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - diff);
      setFilters((prev) => ({
        ...prev,
        startDate: formatDate(start),
        endDate: formatDate(today),
      }));
      return;
    }
    if (type === "month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      setFilters((prev) => ({
        ...prev,
        startDate: formatDate(start),
        endDate: formatDate(today),
      }));
      return;
    }
    const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
    const start = new Date(today.getFullYear(), quarterStartMonth, 1);
    setFilters((prev) => ({
      ...prev,
      startDate: formatDate(start),
      endDate: formatDate(today),
    }));
  };

  const renderMonth = (baseDate: Date) => {
    const monthMatrix = getMonthMatrix(baseDate);
    const monthLabel = `${baseDate.getFullYear()} 年 ${baseDate.getMonth() + 1} 月`;
    return (
      <div className="w-[260px] border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <button
            type="button"
            onClick={() => setViewMonth((prev) => addMonths(prev, -1))}
            className="text-gray-400 hover:text-gray-700"
            aria-label="上个月"
          >
            &lt;
          </button>
          <span className="font-medium">{monthLabel}</span>
          <button
            type="button"
            onClick={() => setViewMonth((prev) => addMonths(prev, 1))}
            className="text-gray-400 hover:text-gray-700"
            aria-label="下个月"
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
          {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-sm">
          {monthMatrix.map((date, index) => {
            const isCurrentMonth = date.getMonth() === baseDate.getMonth();
            const isSelectedStart = startDate && isSameDay(date, startDate);
            const isSelectedEnd = endDate && isSameDay(date, endDate);
            const inRange = isInRange(date);
            const baseClasses = "h-8 w-8 mx-auto flex items-center justify-center rounded-full";
            const textColor = isCurrentMonth ? "text-gray-700" : "text-gray-300";
            const rangeBg = inRange ? "bg-blue-50" : "";
            const selectedBg = isSelectedStart || isSelectedEnd ? "bg-blue-600 text-white" : "";
            return (
              <button
                key={`${date.toDateString()}-${index}`}
                type="button"
                onClick={() => handleDateClick(date)}
                className={`${baseClasses} ${textColor} ${rangeBg} ${selectedBg}`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex gap-8">
        {/* 大区选择 */}
        <div className="flex-1">
          <div className="text-sm text-gray-600 font-medium mb-3">大区</div>
          <div className="flex flex-wrap gap-3">
            {defaultOptions.region.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, region: prev.region === item ? "" : item }))}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  filters.region === item
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 周期选择 */}
        <div className="flex-1">
          <div className="text-sm text-gray-600 font-medium mb-3">周期</div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (selectedPeriod === "week") {
                  setSelectedPeriod(null);
                } else {
                  setSelectedPeriod("week");
                  applyShortcut("week");
                }
              }}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                selectedPeriod === "week"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              }`}
            >
              本周
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedPeriod === "month") {
                  setSelectedPeriod(null);
                } else {
                  setSelectedPeriod("month");
                  applyShortcut("month");
                }
              }}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                selectedPeriod === "month"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              }`}
            >
              本月
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedPeriod === "quarter") {
                  setSelectedPeriod(null);
                } else {
                  setSelectedPeriod("quarter");
                  applyShortcut("quarter");
                }
              }}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                selectedPeriod === "quarter"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              }`}
            >
              本季度
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedPeriod === "year") {
                  setSelectedPeriod(null);
                } else {
                  setSelectedPeriod("year");
                  const now = new Date();
                  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  const yearStart = new Date(now.getFullYear(), 0, 1);
                  setFilters((prev) => ({
                    ...prev,
                    startDate: formatDate(yearStart),
                    endDate: formatDate(today),
                  }));
                }
              }}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                selectedPeriod === "year"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              }`}
            >
              本年
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
