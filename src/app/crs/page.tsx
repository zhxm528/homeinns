import SectionHome from "@/components/SectionHome";
import { headerMenuById } from "@/data/menu";

export default function CrsHome() {
  const section = headerMenuById("crs");
  if (!section) {
    throw new Error("CRS menu configuration missing.");
  }

  return <SectionHome section={section} />;
}
