import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import CrossIcon from "@/assets/icons/remove.svg?react";
import Tappable from "@/ui/Tappable";
import { useReactFlow } from "@xyflow/react";
import { twMerge } from "tailwind-merge";
import { truncateWord } from "@/helpers/truncateWord";
import { GridFlowNode } from "../GridFlowInterface";
import { gridFlowDeleteNode } from "../GridFlowUtils";
import { useAppStore } from "@/lib/store/store";

export default function GridFlowChatNode(node: GridFlowNode) {
  const { telegramDialogs } = useAppStore();
  const isDeleting = node.data.status === "deleting";
  const reactFlow = useReactFlow();

  const onDelete = () => {
    gridFlowDeleteNode(
      node,
      reactFlow.setNodes as React.Dispatch<React.SetStateAction<GridFlowNode[]>>
    );
  };

  const getUnreadCount = () => {
    const dialog = telegramDialogs.find(
      (d) => d.username === node.data.username
    );
    if (dialog && dialog.unreadCount > 0) {
      return dialog.unreadCount;
    } else {
      return null;
    }
  };

  return (
    <div
      className={twMerge(
        `relative custom-node scale-80`,
        isDeleting &&
          "transition-all ease duration-300 scale-20 animate-fadeOutHidden"
      )}
    >
      <img
        src={getTelegramAvatarLink(node.data.username)}
        className="h-18 w-18 rounded-full relative -top-2"
        alt=""
      />
      <div className="node-overlay absolute h-18 w-18 -top-2 left-0 rounded-full" />
      <div
        className="absolute -top-2 left-0 h-18 w-18 rounded-full -z-10"
        style={{
          background: "radial-gradient(circle, black 0%, transparent 70%)",
        }}
      ></div>
      {/* <div className="absolute -top-full -left-full translate-2 -rotate-90 pointer-events-none">
        <Circle text={truncateWord(data.name, 20)} percentage={1} />
      </div> */}
      <div className="text-xs tracking-[0.5px] absolute -bottom-[10px] left-1/2 -translate-x-1/2 text-nowrap font-medium text-[#D6CFCB]">
        {node.data.name.length > 12 ? (
          <div className="relative">
            {truncateWord(node.data.name, 12)}
            <div className="bg-gradient-to-r from-transparent to-primary h-full w-8 absolute right-0 top-0"></div>
          </div>
        ) : (
          node.data.name
        )}
      </div>
      {node.data.deleteMode && (
        <Tappable
          onTap={onDelete}
          className="absolute -top-2 -right-1 bg-secondary p-1 rounded-full"
        >
          <CrossIcon className="h-4 w-4" />
        </Tappable>
      )}
      {getUnreadCount() && !node.data.deleteMode && (
        <div className="absolute -top-2 right-0 min-w-6 text-xs bg-black p-1 rounded-full font-semibold grid place-content-center">
          {getUnreadCount()}
        </div>
      )}
    </div>
  );
}
/*
const Circle = ({ percentage, text }: { percentage: number; text: string }) => {
  const r = 43;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - percentage) * circ) / 100; // where stroke will start, e.g. from 15% to 100%.

  // Create a unique path ID
  const pathId = `circlePath-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <svg width={200} height={200}>
      <defs>
        <path
          id={pathId}
          d={`M 100,${100 - r} A ${r},${r} 0 1,1 ${100 - 0.01},${100 - r}`}
        />
      </defs>
      <g transform="rotate(-90, 100, 100)">
        <circle
          r={r}
          cx={100}
          cy={100}
          strokeWidth={"14px"}
          fill="transparent"
          strokeDasharray={circ}
          strokeDashoffset={percentage ? strokePct : 0}
        ></circle>
      </g>
      <text
        fontSize="10px"
        fill={"rgba(255,255,255,0.8)"}
        fontWeight={800}
        dy="2"
        dx={4}
        letterSpacing="2px"
      >
        <textPath href={`#${pathId}`} startOffset="0%" textAnchor="start">
          {text}
        </textPath>
      </text>
    </svg>
  );
};
*/

export function NodeShadow() {
  return <div className="h-18 w-18 rounded-full"></div>;
}
