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
        className="h-18 w-18 rounded-full"
        alt=""
      />
      <div className="node-overlay absolute inset-0 rounded-full" />
      <div
        className="absolute top-0 left-0 h-18 w-18 scale-130 rounded-full -z-10"
        style={{
          background: "radial-gradient(circle, black 0%, transparent 70%)",
        }}
      ></div>
      <div className="absolute -top-full -left-full translate-2 -rotate-10 pointer-events-none">
        <Circle text={data.name.toUpperCase()} percentage={1} />
      </div>
    </div>
  );
}

const Circle = ({ percentage, text }: { percentage: number; text: string }) => {
  const r = 43;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - percentage) * circ) / 100; // where stroke will start, e.g. from 15% to 100%.

  // Create a unique path ID
  const pathId = `circlePath-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <svg width={200} height={200}>
      <defs>
        {/* Modified path to start at 12 o'clock position */}
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
        fontSize="8px"
        fill={"#fff"}
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

export function NodeShadow() {
  return <div className="h-18 w-18 rounded-full"></div>;
}
