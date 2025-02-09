import ForceGraph from "./-force-graph";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";

const Graph = () => {
  const { jazzProfile } = useJazzProfileContext();

  if (!jazzProfile?.folders) return;

  return <ForceGraph data={jazzProfile.folders!} />;
};

export default Graph;
