"use client";

import MetricDetailPage from "@/components/cdp/private-domain-metrics/MetricDetailPage";

export default function MetricOnePage() {
  return (
    <MetricDetailPage
      metricId="metric-one"
      pageTitle="指标一详情页"
      metricName="企微每百人成功拉新"
      showBreadcrumb={true}
      dashboardFiltersConfig={{ enablePeriodFilters: false, showDateRange: true }}
      showBreakdownHint={false}
      detailFiltersConfig={{ enablePeriodFilters: false, showDateRange: true }}
      showDetailExportButton={true}
      detailTableVariant="metricone"
      breakdownLabels={{
        denominator: "可拉新企微总人数",
        completed: "成功拉新企微人数",
        pending: "未成功拉新企微人数",
      }}
    />
  );
}
