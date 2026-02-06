'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from "react";

export type PrivateDomainFilters = {
  managementType: string;
  region: string;
  cityArea: string;
  storeAge: string;
  city: string;
  hotel: string;
  startDate: string;
  endDate: string;
  periodValue?: string;
  selectedPeriod?: "week" | "month" | "quarter" | "year" | null;
};

type QueryFiltersProps = {
  onChange?: (filters: PrivateDomainFilters) => void;
  enablePeriodFilters?: boolean;
  showDateRange?: boolean;
};

const defaultOptions = {
  managementType: ["直营", "加盟", "合作"],
  region: ["华北", "华东", "华南", "西南"],
  cityArea: ["核心城区", "非核心城区", "郊区"],
  storeAge: ["1年内", "1-3年", "3-5年", "5年以上"],
  city: ["北京", "上海", "广州", "深圳"],
  hotel: ["示例酒店A", "示例酒店B", "示例酒店C"],
};

export default function QueryFilters({
  onChange,
  enablePeriodFilters = true,
  showDateRange = false,
}: QueryFiltersProps) {
  const [filters, setFilters] = useState<PrivateDomainFilters>({
    managementType: "",
    region: "",
    cityArea: "",
    storeAge: "",
    city: "",
    hotel: "",
    startDate: "",
    endDate: "",
    periodValue: "",
  });
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "quarter" | "year" | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [periodValue, setPeriodValue] = useState("");
  const [quickRange, setQuickRange] = useState<"week" | "month" | "quarter" | "year" | null>(null);

  // 初始化默认为本季度
  useEffect(() => {
    if (!isInitialized) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
      const quarterStart = new Date(today.getFullYear(), quarterStartMonth, 1);
      setFilters((prev) => ({
        ...prev,
        startDate: formatDate(quarterStart),
        endDate: formatDate(today),
        periodValue: "",
      }));
      setSelectedPeriod(enablePeriodFilters ? "quarter" : null);
      setPeriodValue("");
      setIsInitialized(true);
    }
  }, [enablePeriodFilters, isInitialized]);

  useEffect(() => {
    onChange?.({ ...filters, selectedPeriod: enablePeriodFilters ? selectedPeriod : null });
  }, [enablePeriodFilters, filters, selectedPeriod, onChange]);

  useEffect(() => {
    if (!enablePeriodFilters) {
      setSelectedPeriod(null);
      setPeriodValue("");
      setFilters((prev) => ({ ...prev, periodValue: "" }));
    }
  }, [enablePeriodFilters]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addDays = (baseDate: Date, diff: number) =>
    new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + diff);

  const getWeekStart = (date: Date) => {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    return addDays(date, diff);
  };

  const getMonthEnd = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const getQuarterStart = (date: Date) => {
    const quarterStartMonth = Math.floor(date.getMonth() / 3) * 3;
    return new Date(date.getFullYear(), quarterStartMonth, 1);
  };

  const getQuarterEnd = (date: Date) => {
    const start = getQuarterStart(date);
    return new Date(start.getFullYear(), start.getMonth() + 3, 0);
  };

  const periodOptions = useMemo(() => {
    if (!enablePeriodFilters || !selectedPeriod) {
      return [];
    }
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (selectedPeriod === "week") {
      return Array.from({ length: 8 }).map((_, index) => {
        const base = addDays(today, -7 * index);
        const start = getWeekStart(base);
        const end = addDays(start, 6);
        return {
          label: `${formatDate(start)} ~ ${formatDate(end)}`,
          value: `${formatDate(start)}_${formatDate(end)}`,
          startDate: formatDate(start),
          endDate: formatDate(end),
        };
      });
    }

    if (selectedPeriod === "month") {
      return Array.from({ length: 12 }).map((_, index) => {
        const base = new Date(today.getFullYear(), today.getMonth() - index, 1);
        const start = new Date(base.getFullYear(), base.getMonth(), 1);
        const end = index === 0 ? today : getMonthEnd(base);
        return {
          label: `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}`,
          value: `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}`,
          startDate: formatDate(start),
          endDate: formatDate(end),
        };
      });
    }

    if (selectedPeriod === "quarter") {
      return Array.from({ length: 8 }).map((_, index) => {
        const base = new Date(today.getFullYear(), today.getMonth() - index * 3, 1);
        const start = getQuarterStart(base);
        const end = index === 0 ? today : getQuarterEnd(base);
        const quarter = Math.floor(start.getMonth() / 3) + 1;
        return {
          label: `${start.getFullYear()} Q${quarter}`,
          value: `${start.getFullYear()}-Q${quarter}`,
          startDate: formatDate(start),
          endDate: formatDate(end),
        };
      });
    }

    return Array.from({ length: 5 }).map((_, index) => {
      const year = today.getFullYear() - index;
      const start = new Date(year, 0, 1);
      const end = index === 0 ? today : new Date(year, 11, 31);
      return {
        label: `${year}`,
        value: `${year}`,
        startDate: formatDate(start),
        endDate: formatDate(end),
      };
    });
  }, [enablePeriodFilters, selectedPeriod]);

  const getToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const getQuickRangeMatch = (preferred?: "week" | "month" | "quarter" | "year" | null) => {
    if (!filters.startDate || !filters.endDate) {
      return null;
    }
    const today = getToday();
    if (filters.endDate !== formatDate(today)) {
      return null;
    }
    const start = filters.startDate;
    const matches: ("week" | "month" | "quarter" | "year")[] = [];
    if (start === formatDate(getWeekStart(today))) matches.push("week");
    if (start === formatDate(new Date(today.getFullYear(), today.getMonth(), 1))) matches.push("month");
    if (start === formatDate(getQuarterStart(today))) matches.push("quarter");
    if (start === formatDate(new Date(today.getFullYear(), 0, 1))) matches.push("year");
    if (preferred && matches.includes(preferred)) {
      return preferred;
    }
    return matches[0] ?? null;
  };

  useEffect(() => {
    if (!enablePeriodFilters) {
      return;
    }
    if (!selectedPeriod) {
      setPeriodValue("");
      setFilters((prev) => ({ ...prev, periodValue: "", startDate: "", endDate: "" }));
      setQuickRange(null);
      return;
    }
    if (!periodValue && periodOptions.length > 0) {
      const next = periodOptions[0];
      setPeriodValue(next.value);
      setFilters((prev) => ({
        ...prev,
        startDate: next.startDate,
        endDate: next.endDate,
        periodValue: next.value,
      }));
      setQuickRange(null);
    }
  }, [enablePeriodFilters, periodOptions, periodValue, selectedPeriod]);

  const applyQuickRange = (range: "week" | "month" | "quarter" | "year") => {
    const today = getToday();
    let start: Date;

    if (range === "week") {
      start = getWeekStart(today);
    } else if (range === "month") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (range === "quarter") {
      start = getQuarterStart(today);
    } else {
      start = new Date(today.getFullYear(), 0, 1);
    }

    setSelectedPeriod(null);
    setPeriodValue("");
    setQuickRange(range);
    setFilters((prev) => ({
      ...prev,
      startDate: formatDate(start),
      endDate: formatDate(today),
      periodValue: "",
    }));
  };

  const isQuickRangeActive = (range: "week" | "month" | "quarter" | "year") => {
    return quickRange === range;
  };

  const quickRanges = [
    { label: "本周", value: "week" },
    { label: "本月", value: "month" },
    { label: "本季度", value: "quarter" },
    { label: "本年", value: "year" },
  ] as const;

  const handlePeriodSelect = (value: string) => {
    setPeriodValue(value);
    const option = periodOptions.find((item) => item.value === value);
    if (!option) {
      return;
    }
    setFilters((prev) => ({
      ...prev,
      startDate: option.startDate,
      endDate: option.endDate,
      periodValue: option.value,
    }));
  };

  const handleDateChange = (key: "startDate" | "endDate") => (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setSelectedPeriod(null);
    setPeriodValue("");
    setFilters((prev) => ({
      ...prev,
      [key]: nextValue,
    }));
  };

  useEffect(() => {
    if (!showDateRange) {
      setQuickRange(null);
      return;
    }
    setQuickRange(getQuickRangeMatch(quickRange));
  }, [filters.endDate, filters.startDate, quickRange, showDateRange]);

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

        {enablePeriodFilters && (
          <div className="flex-1">
            <div className="text-sm text-gray-600 font-medium mb-3">周期</div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  if (selectedPeriod === "week") {
                    setSelectedPeriod(null);
                    setPeriodValue("");
                  } else {
                    setSelectedPeriod("week");
                    setPeriodValue("");
                  }
                }}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  selectedPeriod === "week"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                }`}
              >
                周
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedPeriod === "month") {
                    setSelectedPeriod(null);
                    setPeriodValue("");
                  } else {
                    setSelectedPeriod("month");
                    setPeriodValue("");
                  }
                }}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  selectedPeriod === "month"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                }`}
              >
                月
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedPeriod === "quarter") {
                    setSelectedPeriod(null);
                    setPeriodValue("");
                  } else {
                    setSelectedPeriod("quarter");
                    setPeriodValue("");
                  }
                }}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  selectedPeriod === "quarter"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                }`}
              >
                季度
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedPeriod === "year") {
                    setSelectedPeriod(null);
                    setPeriodValue("");
                  } else {
                    setSelectedPeriod("year");
                    setPeriodValue("");
                  }
                }}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  selectedPeriod === "year"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                }`}
              >
                年
              </button>
            </div>
          </div>
        )}

        {enablePeriodFilters && (
          <div className="flex-1">
            <div className="text-sm text-gray-600 font-medium mb-3">周期选择</div>
            <select
              value={periodValue}
              onChange={(event) => handlePeriodSelect(event.target.value)}
              disabled={!selectedPeriod}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">{selectedPeriod ? "请选择" : "请先选择周期"}</option>
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {showDateRange && (
          <div className="flex-1">
            <div className="text-sm text-gray-600 font-medium mb-3">日期段</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {quickRanges.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => applyQuickRange(item.value)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                    isQuickRangeActive(item.value)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={filters.startDate}
                onChange={handleDateChange("startDate")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
              />
              <span className="text-sm text-gray-500">至</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={handleDateChange("endDate")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
