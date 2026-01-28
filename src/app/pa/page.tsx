import SectionHome from "@/components/SectionHome";
import { headerMenuById } from "@/data/menu";

export default function PaHome() {
  const section = headerMenuById("pa");
  if (!section) {
    throw new Error("PA menu configuration missing.");
  }

  return <SectionHome section={section} />;
}
