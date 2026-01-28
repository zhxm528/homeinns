import { NextResponse } from "next/server";
import { privateDomainMetricDetails } from "@/lib/privateDomainMetrics";

export async function GET() {
  return NextResponse.json(privateDomainMetricDetails["metric-one"]);
}
