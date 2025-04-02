import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import Graph from "./Graph";
import { GraphContextProvider } from "./GraphContext";
import { useLocalStorageListener } from "@/helpers/use-localstorage-listener";
import { JazzListOfFolders } from "@/lib/jazz/schema";
import { useEffect, useMemo } from "react";

export default function GraphWrapper() {
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

  return (
    <GraphContextProvider>
      <Graph data={parsedFolders} />
    </GraphContextProvider>
  );
}
