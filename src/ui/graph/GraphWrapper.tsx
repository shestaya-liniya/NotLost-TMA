import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import Graph from "./Graph";

export default function GraphWrapper() {
  const { jazzProfile } = useJazzProfileContext();

  if (!jazzProfile.folders) return;
  return <Graph data={jazzProfile.folders} />;
}
