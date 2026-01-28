import SectionHome from "@/components/SectionHome";
import { headerMenuById } from "@/data/menu";

export default function ToolsHome() {
  const section = headerMenuById("tools");
  if (!section) {
    throw new Error("Tools menu configuration missing.");
  }

  return <SectionHome section={section} />;
}
