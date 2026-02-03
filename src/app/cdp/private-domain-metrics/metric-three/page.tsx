"use client";

import MetricDetailPage from "@/components/cdp/private-domain-metrics/MetricDetailPage";

export default function MetricThreePage() {
  return (
    <MetricDetailPage
      metricId="metric-three"
      pageTitle="指标三详情页"
      metricName="小程序渠道间夜占比"
      showBreadcrumb={true}
      dashboardFiltersConfig={{ enablePeriodFilters: false, showDateRange: true }}
      showBreakdownHint={false}
      detailFiltersConfig={{ enablePeriodFilters: false, showDateRange: true }}
      showDetailExportButton={true}
      detailTableVariant="miniapp"
      breakdownLabels={{
        denominator: "全渠道预订间夜数",
        completed: "逸扉小程序渠道预订间夜数",
        pending: "其他渠道预订间夜数",
      }}
    />
  );
}
