"use client";

import MetricDetailPage from "@/components/cdp/private-domain-metrics/MetricDetailPage";

export default function MetricFourPage() {
  return (
    <MetricDetailPage
      metricId="metric-four"
      pageTitle="指标四详情页"
      metricName="金牛及以上逸粉本人预订且入住占比"
      showBreadcrumb={true}
      dashboardFiltersConfig={{ enablePeriodFilters: false, showDateRange: true }}
      showBreakdownHint={false}
      detailFiltersConfig={{ enablePeriodFilters: false, showDateRange: true }}
      showDetailExportButton={true}
      detailTableVariant="goldvip"
      breakdownLabels={{
        denominator: "全等级逸扉渠道逸粉人数",
        completed: "金牛及以上本人预订且入住的逸粉人数",
        pending: "其他等级的逸扉渠道逸粉人数",
      }}
    />
  );
}
