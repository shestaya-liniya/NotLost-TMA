import ForceGraph from "./-force-graph";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";

const Graph = () => {
  const { jazzProfile } = useJazzProfileContext();

  if (!jazzProfile?.folders) return null;

  return <ForceGraph data={jazzProfile.folders} />;
};

export default Graph;
