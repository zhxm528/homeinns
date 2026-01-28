import { NextResponse } from "next/server";
import { privateDomainMetricsOverview } from "@/lib/privateDomainMetrics";

export async function GET() {
  return NextResponse.json(privateDomainMetricsOverview);
}
