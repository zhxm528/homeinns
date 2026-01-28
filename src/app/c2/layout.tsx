import type React from "react";
import C2Shell from "@/components/c2/C2Shell";

export default function C2Layout({ children }: { children: React.ReactNode }) {
  return <C2Shell>{children}</C2Shell>;
}
