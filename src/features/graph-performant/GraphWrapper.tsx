import ForceGraph from "./Graph";
import { memo } from "react";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";

const Graph = () => {
  const { jazzProfile } = useJazzProfileContext();

  if (!jazzProfile.folders) return;

  return <ForceGraph data={jazzProfile.folders} />;
};

export default memo(Graph);
