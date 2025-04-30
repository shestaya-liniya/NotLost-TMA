import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";

export default function CustomNode({
  data,
}: {
  data: { username: string; name: string };
}) {
  return (
    <div className="relative custom-node scale-80">
      <img
        src={getTelegramAvatarLink(data.username)}
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
      <div className="text-xs tracking-[0.5px] absolute -bottom-[10px] left-1/2 -translate-x-1/2 text-nowrap">
        {data.name.length > 12 ? (
          <div className="relative">
            {truncateWord(data.name, 12)}
            <div className="bg-gradient-to-r from-transparent to-primary h-full w-8 absolute right-0 top-0"></div>
          </div>
        ) : (
          data.name
        )}
      </div>
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

function truncateWord(word: string, maxLength: number): string {
  return word.length > maxLength ? word.slice(0, maxLength) : word;
}
