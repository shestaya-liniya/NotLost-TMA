import ForceGraph from "./-force-graph";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import { memo, useEffect } from "react";
import { useLocalStorageListener } from "@/helpers/use-localstorage-listener";
import { JazzListOfFolders } from "@/lib/jazz/schema";

// As jazz folders are updated one by one on init, graph is updated very frequently that cause chaos
// Getting folders from local storage is the only way to avoid this

const Graph = () => {
  const { jazzProfile } = useJazzProfileContext();

  const [folders, setFolders] = useLocalStorageListener("folders");

  useEffect(() => {
    if (!folders) {
      setFolders(JSON.stringify(jazzProfile.folders));
    }
  }, []);

  if (!folders) return null;

  const parsedFolders = JSON.parse(folders) as unknown as JazzListOfFolders;

  return <ForceGraph data={parsedFolders} />;
};

export default memo(Graph);
