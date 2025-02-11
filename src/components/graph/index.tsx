import { useEffect, useRef, useState } from "react";
import ForceGraph from "./-force-graph";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import { JazzListOfFolders } from "@/lib/jazz/schema";

const Graph = () => {
  const { jazzProfile } = useJazzProfileContext();
  const [folders, setFolders] = useState<JazzListOfFolders | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!jazzProfile?.folders) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setFolders(jazzProfile.folders);
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [jazzProfile]);

  if (!folders) return null;

  return <ForceGraph data={folders} />;
};

export default Graph;
