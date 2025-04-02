import Tappable from "@/ui/Tappable";
import { IGraphFolderFlag } from "../Graph.interface";
import { graphZoomToNode } from "../helpers/graphZoomToNode";
import { getUniqueKey } from "@/helpers/getUniqueKey";
import { useGraphStore } from "../GraphStore";

export function GraphFolderFlag(props: { flag: IGraphFolderFlag }) {
  const { graphRef } = useGraphStore();
  const { flag } = props;
  return (
    <Tappable
      onClick={() => graphZoomToNode(graphRef, flag.id as string)}
      key={flag.id}
      style={{
        top: flag.y,
        left: flag.x,
        opacity: flag.visible ? 0 : 1,
      }}
      className={`text-xs bg-link/20 text-link px-2 py-1 rounded-xl absolute z-40 backdrop-blur-lg whitespace-nowrap transition-opacity duration-300 ease-in-out flex items-center gap-1 -translate-x-1/2`}
    >
      {flag.title}
      <span className="text-hint">{Math.floor(flag.distance / 100)}</span>{" "}
    </Tappable>
  );
}

export function GraphFolderFlags(props: { folderFlags: IGraphFolderFlag[] }) {
  return props.folderFlags.map((flag) => (
    <GraphFolderFlag key={getUniqueKey()} flag={flag} />
  ));
}
