import React, { useState, useEffect } from "react";
import { Zoom } from "@visx/zoom";
import { localPoint } from "@visx/event";
import { RectClipPath } from "@visx/clip-path";
import { scaleLinear } from "@visx/scale";
import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";

// Define types for props and chat data
interface TelegramRadarProps {
  width?: number;
  height?: number;
}

interface ChatParticipant {
  id: number;
  name: string;
  image: string;
  importance: number;
}

interface PositionedChatParticipant extends ChatParticipant {
  x: number;
  y: number;
  row: number; // Which row within its importance level
}

// Constants
const bg = "#f2f2f2";
const NODE_RADIUS = 30; // Radius of each node/profile picture
const MIN_NODE_DISTANCE = NODE_RADIUS * 2.2; // Minimum distance between node centers to prevent overlap
const IMPORTANCE_ZONE_GAP = 40; // Gap between importance zones in pixels

// Importance score will determine base distance from center
// Adding more spacing between importance levels
const baseDistanceScale = scaleLinear<number>({
  domain: [10, 0], // Importance scale from 10-0 (reversed so higher importance is closer)
  range: [100, 650], // Increased range to spread out importance levels
});

// Group chats by importance level
function groupByImportance(
  chats: ChatParticipant[]
): Map<number, ChatParticipant[]> {
  const groups = new Map<number, ChatParticipant[]>();

  for (const chat of chats) {
    if (!groups.has(chat.importance)) {
      groups.set(chat.importance, []);
    }
    groups.get(chat.importance)?.push(chat);
  }

  return groups;
}

// Calculate how many nodes fit in a circle
function nodesPerCircle(radius: number): number {
  const circumference = 2 * Math.PI * radius;
  return Math.floor(circumference / MIN_NODE_DISTANCE);
}

// Function to position nodes in multiple rows per importance level with increased spacing
function positionNodes(
  chats: ChatParticipant[],
  width: number,
  height: number
): PositionedChatParticipant[] {
  const center = { x: width / 2, y: height / 2 };
  const result: PositionedChatParticipant[] = [];

  // Group chats by importance
  const importanceGroups = groupByImportance(chats);

  // Sort importance levels (highest first)
  const importanceLevels = Array.from(importanceGroups.keys()).sort(
    (a, b) => b - a
  );

  // Calculate base radii with added spacing between importance levels
  const baseRadii = new Map<number, number>();
  let previousRadius = 0;

  // First pass: calculate base radii for each importance level
  for (const importance of importanceLevels) {
    // Start with the base distance for this importance level
    let baseRadius = baseDistanceScale(importance);

    // If we have a previous radius, ensure there's enough gap
    if (previousRadius > 0) {
      baseRadius = Math.max(baseRadius, previousRadius + IMPORTANCE_ZONE_GAP);
    }

    baseRadii.set(importance, baseRadius);

    // Calculate the max radius for this importance level
    const chatsInGroup = importanceGroups.get(importance) || [];
    const rowCount = Math.ceil(
      chatsInGroup.length / nodesPerCircle(baseRadius)
    );

    // Calculate the radius of the outermost row for this importance level
    const maxRadius =
      baseRadius + (rowCount - 1) * NODE_RADIUS * 2.5 + NODE_RADIUS;
    previousRadius = maxRadius;
  }

  // Second pass: position nodes using the calculated base radii
  for (const importance of importanceLevels) {
    const chatsInGroup = importanceGroups.get(importance) || [];
    const baseRadius =
      baseRadii.get(importance) || baseDistanceScale(importance);

    let remainingChats = [...chatsInGroup];
    let rowIndex = 0;

    // Continue creating rows until all chats in this importance level are positioned
    while (remainingChats.length > 0) {
      // Calculate radius for this row (increase slightly for each additional row)
      const rowRadius = baseRadius + rowIndex * NODE_RADIUS * 2.5;

      // Calculate how many nodes can fit in this circle
      const nodesInThisRow = nodesPerCircle(rowRadius);

      // Get chats for this row
      const chatsForThisRow = remainingChats.slice(0, nodesInThisRow);
      remainingChats = remainingChats.slice(nodesInThisRow);

      // Position chats in this row
      chatsForThisRow.forEach((chat, index) => {
        // Distribute evenly around the circle
        const angle =
          (index / Math.max(1, chatsForThisRow.length)) * 2 * Math.PI;

        // Convert polar coordinates to Cartesian
        const x = center.x + rowRadius * Math.cos(angle);
        const y = center.y + rowRadius * Math.sin(angle);

        result.push({
          ...chat,
          x,
          y,
          row: rowIndex,
        });
      });

      rowIndex++;
    }
  }

  return result;
}

// Find the radius of each importance level's outer circle with padding
function findImportanceCircles(
  chats: PositionedChatParticipant[],
  centerX: number,
  centerY: number
): { importance: number; radius: number; innerRadius: number }[] {
  const importanceGroups = new Map<number, PositionedChatParticipant[]>();

  // Group positioned chats by importance
  for (const chat of chats) {
    if (!importanceGroups.has(chat.importance)) {
      importanceGroups.set(chat.importance, []);
    }
    importanceGroups.get(chat.importance)?.push(chat);
  }

  // Sort importance levels (highest first)
  const importanceLevels = Array.from(importanceGroups.keys()).sort(
    (a, b) => b - a
  );

  const result: { importance: number; radius: number; innerRadius: number }[] =
    [];

  // Calculate the radius for each importance level
  for (const importance of importanceLevels) {
    const chatsInGroup = importanceGroups.get(importance) || [];

    // Find the minimum and maximum distance from center
    let minDistance = Infinity;
    let maxDistance = 0;

    for (const chat of chatsInGroup) {
      const distance = Math.sqrt(
        Math.pow(chat.x - centerX, 2) + Math.pow(chat.y - centerY, 2)
      );
      minDistance = Math.min(minDistance, distance);
      maxDistance = Math.max(maxDistance, distance);
    }

    // Add the node radius to get the outer circle radius
    // Add some padding (10px) to make the circle visually pleasing
    result.push({
      importance,
      radius: maxDistance + NODE_RADIUS + 10,
      innerRadius: minDistance - NODE_RADIUS - 5,
    });
  }

  return result;
}

// Sample data structure for chat participants
const initialChats: ChatParticipant[] = [
  // Priority 10 (highest)
  { id: 1, name: "User 1", image: "/api/placeholder/60/60", importance: 10 },
  { id: 2, name: "User 2", image: "/api/placeholder/60/60", importance: 10 },
  { id: 3, name: "User 3", image: "/api/placeholder/60/60", importance: 10 },
  { id: 4, name: "User 4", image: "/api/placeholder/60/60", importance: 10 },
  { id: 5, name: "User 5", image: "/api/placeholder/60/60", importance: 10 },
  { id: 6, name: "User 6", image: "/api/placeholder/60/60", importance: 10 },
  { id: 7, name: "User 7", image: "/api/placeholder/60/60", importance: 10 },
  { id: 30, name: "User 7", image: "/api/placeholder/60/60", importance: 10 },
  { id: 31, name: "User 7", image: "/api/placeholder/60/60", importance: 10 },
  { id: 32, name: "User 7", image: "/api/placeholder/60/60", importance: 10 },
  { id: 33, name: "User 7", image: "/api/placeholder/60/60", importance: 10 },
  { id: 34, name: "User 7", image: "/api/placeholder/60/60", importance: 10 },
  { id: 35, name: "User 7", image: "/api/placeholder/60/60", importance: 10 },
  { id: 36, name: "User 7", image: "/api/placeholder/60/60", importance: 10 },

  // Priority 9
  { id: 8, name: "User 8", image: "/api/placeholder/60/60", importance: 9 },
  { id: 9, name: "User 9", image: "/api/placeholder/60/60", importance: 9 },
  { id: 10, name: "User 10", image: "/api/placeholder/60/60", importance: 9 },
  { id: 11, name: "User 11", image: "/api/placeholder/60/60", importance: 9 },
  { id: 12, name: "User 12", image: "/api/placeholder/60/60", importance: 9 },
  { id: 120, name: "User 12", image: "/api/placeholder/60/60", importance: 9 },
  { id: 121, name: "User 12", image: "/api/placeholder/60/60", importance: 9 },
  { id: 122, name: "User 12", image: "/api/placeholder/60/60", importance: 9 },
  { id: 123, name: "User 12", image: "/api/placeholder/60/60", importance: 9 },
  { id: 124, name: "User 12", image: "/api/placeholder/60/60", importance: 9 },

  // Priority 8
  { id: 13, name: "User 13", image: "/api/placeholder/60/60", importance: 8 },
  { id: 14, name: "User 14", image: "/api/placeholder/60/60", importance: 8 },
  { id: 15, name: "User 15", image: "/api/placeholder/60/60", importance: 8 },
];

// Initial transform for the visualization
const initialTransform = {
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
};

const TelegramRadar: React.FC<TelegramRadarProps> = ({
  width = 800,
  height = 800,
}) => {
  const [showMiniMap, setShowMiniMap] = useState<boolean>(true);
  const [chats, setChats] = useState<PositionedChatParticipant[]>([]);
  const [importanceCircles, setImportanceCircles] = useState<
    { importance: number; radius: number; innerRadius: number }[]
  >([]);

  // Position nodes on mount and when dimensions change
  useEffect(() => {
    const positionedChats = positionNodes(initialChats, width, height);
    setChats(positionedChats);

    // Calculate importance circles
    const circles = findImportanceCircles(
      positionedChats,
      width / 2,
      height / 2
    );
    setImportanceCircles(circles);
  }, [width, height]);

  // Color scale for importance circles
  const getImportanceColor = (importance: number): string => {
    const hue = importance * 24; // Spread colors across hue spectrum
    return `hsla(${hue}, 70%, 60%, 0.3)`;
  };

  // Get border color for importance circles
  const getImportanceBorderColor = (importance: number): string => {
    const hue = importance * 24; // Spread colors across hue spectrum
    return `hsla(${hue}, 70%, 40%, 0.8)`;
  };

  return (
    <>
      <Zoom<SVGSVGElement>
        width={width}
        height={height}
        scaleXMin={0.5}
        scaleXMax={4}
        scaleYMin={0.5}
        scaleYMax={4}
        initialTransformMatrix={initialTransform}
      >
        {(zoom) => (
          <div className="relative">
            <svg
              width={width}
              height={height}
              style={{
                cursor: zoom.isDragging ? "grabbing" : "grab",
                touchAction: "none",
              }}
              ref={zoom.containerRef}
            >
              <RectClipPath id="zoom-clip" width={width} height={height} />
              <rect width={width} height={height} rx={14} fill={bg} />

              {/* Main visualization */}
              <g transform={zoom.toString()}>
                {/* Zone divider lines for visual reference */}
                {importanceCircles.map((circle) => (
                  <g key={`zone-divider-${circle.importance}`}>
                    {/* Outer circle for the zone */}
                    <circle
                      cx={width / 2}
                      cy={height / 2}
                      r={circle.radius}
                      fill="none"
                      stroke={getImportanceBorderColor(circle.importance)}
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />

                    {/* Zone label */}
                    <text
                      x={width / 2}
                      y={height / 2 - circle.radius - 5}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill={getImportanceBorderColor(circle.importance)}
                    >
                      Priority {circle.importance}
                    </text>

                    {/* Fill the zone with semi-transparent color */}
                    <circle
                      cx={width / 2}
                      cy={height / 2}
                      r={circle.radius}
                      fill={getImportanceColor(circle.importance)}
                      stroke="none"
                    />
                  </g>
                ))}

                {/* Center point */}
                <circle cx={width / 2} cy={height / 2} r={10} fill="#555" />

                {/* Chat profile images */}
                {chats.map((chat) => (
                  <g key={chat.id}>
                    {/* Profile image circle with clip path */}
                    <defs>
                      <clipPath id={`clip-${chat.id}`}>
                        <circle cx={chat.x} cy={chat.y} r={NODE_RADIUS} />
                      </clipPath>
                    </defs>
                    <circle
                      cx={chat.x}
                      cy={chat.y}
                      r={NODE_RADIUS}
                      stroke="#fff"
                      strokeWidth={3}
                      fill="#fff"
                    />
                    <image
                      x={chat.x - NODE_RADIUS}
                      y={chat.y - NODE_RADIUS}
                      width={NODE_RADIUS * 2}
                      height={NODE_RADIUS * 2}
                      xlinkHref={getTelegramAvatarLink("shestaya_liniya")}
                      clipPath={`url(#clip-${chat.id})`}
                    />

                    {/* Optional: Add name labels for debugging */}
                    <text
                      x={chat.x}
                      y={chat.y + NODE_RADIUS + 15}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#333"
                    >
                      {chat.name}
                    </text>
                  </g>
                ))}
              </g>

              {/* Interaction layer */}
              <rect
                width={width}
                height={height}
                rx={14}
                fill="transparent"
                onTouchStart={zoom.dragStart}
                onTouchMove={zoom.dragMove}
                onTouchEnd={zoom.dragEnd}
                onMouseDown={zoom.dragStart}
                onMouseMove={zoom.dragMove}
                onMouseUp={zoom.dragEnd}
                onMouseLeave={() => {
                  if (zoom.isDragging) zoom.dragEnd();
                }}
                onDoubleClick={(event) => {
                  const point = localPoint(event) || { x: 0, y: 0 };
                  zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                }}
              />

              {/* Mini map */}
              {showMiniMap && (
                <g
                  clipPath="url(#zoom-clip)"
                  transform={`
                    scale(0.25)
                    translate(${width * 4 - width - 60}, ${height * 4 - height - 60})
                  `}
                >
                  <rect width={width} height={height} fill="#212121" />

                  {/* Mini importance circles */}
                  {importanceCircles.map((circle) => (
                    <circle
                      key={`mini-importance-${circle.importance}`}
                      cx={width / 2}
                      cy={height / 2}
                      r={circle.radius}
                      fill={getImportanceColor(circle.importance)}
                      stroke={getImportanceBorderColor(circle.importance)}
                      strokeWidth={2}
                    />
                  ))}

                  {/* Mini chat dots */}
                  {chats.map((chat) => (
                    <circle
                      key={`mini-${chat.id}`}
                      cx={chat.x}
                      cy={chat.y}
                      r={6}
                      fill="white"
                    />
                  ))}

                  {/* Viewport indicator */}
                  <rect
                    width={width}
                    height={height}
                    fill="white"
                    fillOpacity={0.2}
                    stroke="white"
                    strokeWidth={4}
                    transform={zoom.toStringInvert()}
                  />
                </g>
              )}
            </svg>

            {/* Controls */}
            <div className="controls">
              <button
                type="button"
                className="btn btn-zoom"
                onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
              >
                +
              </button>
              <button
                type="button"
                className="btn btn-zoom btn-bottom"
                onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
              >
                -
              </button>
              <button
                type="button"
                className="btn btn-lg"
                onClick={() => {
                  zoom.translateTo({ x: width / 2, y: height / 2 });
                }}
              >
                Center
              </button>
              <button type="button" className="btn btn-lg" onClick={zoom.reset}>
                Reset
              </button>
            </div>

            <div className="mini-map">
              <button
                type="button"
                className="btn btn-lg"
                onClick={() => setShowMiniMap(!showMiniMap)}
              >
                {showMiniMap ? "Hide" : "Show"} Mini Map
              </button>
            </div>
          </div>
        )}
      </Zoom>
      <style>{`
        .btn {
          margin: 0;
          text-align: center;
          border: none;
          background: #2f2f2f;
          color: #fff;
          padding: 0 4px;
          border-top: 1px solid #0a0a0a;
          cursor: pointer;
        }
        .btn-lg {
          font-size: 12px;
          line-height: 1;
          padding: 4px;
        }
        .btn-zoom {
          width: 26px;
          font-size: 22px;
        }
        .btn-bottom {
          margin-bottom: 1rem;
        }
        .controls {
          position: absolute;
          top: 15px;
          right: 15px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .mini-map {
          position: absolute;
          bottom: 25px;
          right: 15px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .relative {
          position: relative;
        }
      `}</style>
    </>
  );
};

export default TelegramRadar;
