import SectionHome from "@/components/SectionHome";
import { headerMenuById } from "@/data/menu";

export default function MaHome() {
  const section = headerMenuById("ma");
  if (!section) {
    throw new Error("MA menu configuration missing.");
  }

  return <SectionHome section={section} />;
}
