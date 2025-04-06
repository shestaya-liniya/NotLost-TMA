import Tappable from "@/ui/Tappable";
import { IGraphFolderFlag, IGraphRef } from "../Graph.interface";
import { getUniqueKey } from "@/helpers/getUniqueKey";
import { graphZoomToNode } from "../helpers/graphZoomToNode";

export function GraphFolderFlag(props: {
  flag: IGraphFolderFlag;
  graphRef: IGraphRef;
}) {
  const { flag, graphRef } = props;
  return (
    <Tappable
      onClick={() => graphZoomToNode(graphRef, flag.id as string)}
      key={flag.id}
      style={{
        top: flag.y,
        left: flag.x,
        opacity: flag.visible ? 0 : 1,
      }}
      className={`absolute z-40 text-xs bg-link/20 text-link px-2 py-1 rounded-xl  backdrop-blur-lg whitespace-nowrap transition-opacity duration-300 ease-in-out flex items-center gap-1`}
    >
      {flag.title}
      <span className="text-hint">{Math.floor(flag.distance / 100)}</span>
    </Tappable>
  );
}

export function GraphFolderFlags(props: {
  folderFlags: IGraphFolderFlag[];
  graphRef: IGraphRef;
}) {
  return props.folderFlags.map((flag) => (
    <GraphFolderFlag
      key={getUniqueKey()}
      flag={flag}
      graphRef={props.graphRef}
    />
  ));
}
