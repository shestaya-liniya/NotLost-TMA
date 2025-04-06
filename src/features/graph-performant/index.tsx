import ForceGraph from "./-force-graph";
import { memo, useEffect, useMemo } from "react";
import { JazzListOfFolders } from "@/lib/jazz/schema";
import { useLocalStorageListener } from "@/helpers/useLocalStorageListener";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";

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

  const parsedFolders = useMemo(() => {
    if (!folders) return null; // Handle the case where folders is null
    return JSON.parse(folders) as JazzListOfFolders;
  }, [folders]);

  if (!parsedFolders) return null;

  return <ForceGraph data={parsedFolders} />;
};

export default memo(Graph);
