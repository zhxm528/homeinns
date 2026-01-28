import SectionHome from "@/components/SectionHome";
import { headerMenuById } from "@/data/menu";

export default function ScrmHome() {
  const section = headerMenuById("scrm");
  if (!section) {
    throw new Error("SCRM menu configuration missing.");
  }

  return <SectionHome section={section} />;
}
