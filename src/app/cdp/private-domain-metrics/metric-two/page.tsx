"use client";

import MetricDetailPage from "@/components/cdp/private-domain-metrics/MetricDetailPage";

export default function MetricTwoPage() {
  return (
    <MetricDetailPage
      metricId="metric-two"
      pageTitle="指标二详情页"
      metricName="逸粉每百人成功拉新"
      showBreadcrumb={true}
      dashboardFiltersConfig={{ enablePeriodFilters: false, showDateRange: true }}
      showBreakdownHint={false}
      detailFiltersConfig={{ enablePeriodFilters: false, showDateRange: true }}
      showDetailExportButton={true}
      detailTableVariant="yifen"
      breakdownLabels={{
        denominator: "可拉新逸粉总人数",
        completed: "成功拉新逸粉人数",
        pending: "未成功拉新逸粉人数",
      }}
    />
  );
}
