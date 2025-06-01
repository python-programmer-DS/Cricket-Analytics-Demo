import React, { useEffect, useState } from "react";

const WIDTH = 460; // Widened
const HEIGHT = 500;

// Perspective
const PITCH_BOTTOM_W = 260; // Wider
const PITCH_TOP_W = 90;
const PITCH_LEN = 360; // Taller
const PITCH_CENTER_X = WIDTH / 2;
const PITCH_BOTTOM_Y = HEIGHT - 90;
const PITCH_TOP_Y = PITCH_BOTTOM_Y - PITCH_LEN;

const zones = [
  "Full Toss", "Yorker", "Full", "Good", "Short", "Bouncer"
];
const cols = [
  "Wide Outside Off", "Outside Off", "Middle", "Outside Leg", "Wide Down Leg"
];

// Helper for lerp
function lerp(x1: number, y1: number, x2: number, y2: number, t: number) {
  return { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t };
}

interface PitchMapProps {
  onSelect: (row: string, col: string, x: number, y: number) => void;
  resetTrigger?: number;
}

const PitchMap: React.FC<PitchMapProps> = ({ onSelect, resetTrigger }) => {
  const [dot, setDot] = useState<{ x: number, y: number, row: string, col: string } | null>(null);

  useEffect(() => setDot(null), [resetTrigger]);

  // Four corners for perspective
  const pitch = [
    { x: PITCH_CENTER_X - PITCH_BOTTOM_W / 2, y: PITCH_BOTTOM_Y },
    { x: PITCH_CENTER_X + PITCH_BOTTOM_W / 2, y: PITCH_BOTTOM_Y },
    { x: PITCH_CENTER_X + PITCH_TOP_W / 2, y: PITCH_TOP_Y },
    { x: PITCH_CENTER_X - PITCH_TOP_W / 2, y: PITCH_TOP_Y },
  ];

  function getZoneCol(x: number, y: number) {
    const fracY = (y - PITCH_TOP_Y) / (PITCH_BOTTOM_Y - PITCH_TOP_Y);
    if (fracY < 0 || fracY > 1) return null;
    const leftX = pitch[3].x + (pitch[0].x - pitch[3].x) * fracY;
    const rightX = pitch[2].x + (pitch[1].x - pitch[2].x) * fracY;
    if (x < leftX || x > rightX) return null;
    const rowIdx = Math.floor(fracY * zones.length);
    const fracX = (x - leftX) / (rightX - leftX);
    const colIdx = Math.floor(fracX * cols.length);
    if (rowIdx < 0 || rowIdx >= zones.length || colIdx < 0 || colIdx >= cols.length) return null;
    return { row: zones[rowIdx], col: cols[colIdx] };
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * HEIGHT;
    const res = getZoneCol(x, y);
    if (!res) return;
    setDot({ x, y, ...res });
    onSelect(res.row, res.col, x, y);
  }

  function drawZones() {
    return zones.map((zone, zi) => {
      const t0 = zi / zones.length, t1 = (zi + 1) / zones.length;
      const p0 = lerp(pitch[3].x, pitch[3].y, pitch[0].x, pitch[0].y, t0);
      const p1 = lerp(pitch[2].x, pitch[2].y, pitch[1].x, pitch[1].y, t0);
      const p2 = lerp(pitch[2].x, pitch[2].y, pitch[1].x, pitch[1].y, t1);
      const p3 = lerp(pitch[3].x, pitch[3].y, pitch[0].x, pitch[0].y, t1);
      return (
        <polygon
          key={zone}
          points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
          fill={zi % 2 === 0 ? "#ecd9c6" : "#e2bb8d"}
          opacity={0.92}
        />
      );
    });
  }

  function drawColumns() {
    return cols.map((col, ci) => {
      if (ci === 0 || ci === cols.length) return null;
      const t = ci / cols.length;
      const p0 = lerp(pitch[3].x, pitch[3].y, pitch[2].x, pitch[2].y, t);
      const p1 = lerp(pitch[0].x, pitch[0].y, pitch[1].x, pitch[1].y, t);
      return (
        <line
          key={col}
          x1={p0.x} y1={p0.y}
          x2={p1.x} y2={p1.y}
          stroke="#fff"
          strokeWidth={2}
          opacity={0.18}
        />
      );
    });
  }

  function drawZoneLines() {
    return zones.slice(1).map((_, zi) => {
      const t = (zi + 1) / zones.length;
      const p0 = lerp(pitch[3].x, pitch[3].y, pitch[0].x, pitch[0].y, t);
      const p1 = lerp(pitch[2].x, pitch[2].y, pitch[1].x, pitch[1].y, t);
      return (
        <line
          key={zi}
          x1={p0.x} y1={p0.y}
          x2={p1.x} y2={p1.y}
          stroke="#fff"
          strokeWidth={2}
          opacity={0.18}
        />
      );
    });
  }

  function drawPitchShape() {
    return (
      <polygon
        points={pitch.map(p => `${p.x},${p.y}`).join(" ")}
        fill="#cfa55b"
        stroke="#bb8b2d"
        strokeWidth={4.5}
        opacity={0.98}
        filter="url(#shadow)"
      />
    );
  }

  // Vertical lighter stripes
  function drawPitchStripes() {
    const stripes = [];
    for (let s = 1; s < 8; ++s) {
      const t = s / 8;
      const p0 = lerp(pitch[3].x, pitch[3].y, pitch[2].x, pitch[2].y, t);
      const p1 = lerp(pitch[0].x, pitch[0].y, pitch[1].x, pitch[1].y, t);
      stripes.push(
        <line
          key={s}
          x1={p0.x} y1={p0.y}
          x2={p1.x} y2={p1.y}
          stroke="#fff"
          strokeWidth={2.5}
          opacity={0.09}
        />
      );
    }
    return stripes;
  }

  // Draw both sets of stumps
  function drawStumps() {
    // Bottom (batsman)
    const creaseY = pitch[0].y - 6;
    const x0 = pitch[0].x + 22;
    const x1 = pitch[1].x - 22;
    const stumps = [0.18, 0.5, 0.82].map(frac =>
      lerp(x0, creaseY, x1, creaseY, frac)
    );
    // Top (bowler, foreshortened)
    const tCreaseY = pitch[3].y + 8;
    const tx0 = pitch[3].x + 8, tx1 = pitch[2].x - 8;
    const tStumps = [0.18, 0.5, 0.82].map(frac =>
      lerp(tx0, tCreaseY, tx1, tCreaseY, frac)
    );

    return (
      <>
        {/* Batsman crease */}
        <line
          x1={x0 - 14} y1={creaseY}
          x2={x1 + 14} y2={creaseY}
          stroke="#fff"
          strokeWidth={5.5}
          opacity={0.84}
        />
        {stumps.map((pt, i) =>
          <rect
            key={"b" + i}
            x={pt.x - 4}
            y={pt.y + 3}
            width={8}
            height={26}
            rx={2.7}
            fill="#e2e2e2"
            stroke="#333"
            strokeWidth={1.4}
            opacity={0.92}
          />
        )}
        {/* Bowler's end */}
        <line
          x1={tx0 - 7} y1={tCreaseY}
          x2={tx1 + 7} y2={tCreaseY}
          stroke="#fff"
          strokeWidth={3.5}
          opacity={0.56}
        />
        {tStumps.map((pt, i) =>
          <rect
            key={"t" + i}
            x={pt.x - 2.3}
            y={pt.y - 7}
            width={4.7}
            height={13}
            rx={1.6}
            fill="#e2e2e2"
            stroke="#333"
            strokeWidth={1}
            opacity={0.88}
          />
        )}
      </>
    );
  }

  // Draw batsman marker as a shadow/oval at bottom
  function drawBatsmanShadow() {
    const bx = PITCH_CENTER_X, by = pitch[0].y + 23;
    return (
      <ellipse
        cx={bx}
        cy={by}
        rx={19}
        ry={8.2}
        fill="#444"
        opacity={0.41}
      />
    );
  }

  function drawLabels() {
    const zoneLabels = zones.map((zone, zi) => {
      const t = (zi + 0.5) / zones.length;
      const pt = lerp(pitch[3].x, pitch[3].y, pitch[0].x, pitch[0].y, t);
      return (
        <text
          key={zone}
          x={pt.x - 22}
          y={pt.y + 7}
          textAnchor="end"
          fontWeight={700}
          fontSize={18}
          fill="#fff"
          opacity={0.92}
          style={{ fontFamily: "inherit" }}
        >{zone}</text>
      );
    });
    const colLabels = cols.map((col, ci) => {
      const t = (ci + 0.5) / cols.length;
      const pt = lerp(pitch[0].x, pitch[0].y, pitch[1].x, pitch[1].y, t);
      return (
        <text
          key={col}
          x={pt.x}
          y={pitch[0].y + 38}
          textAnchor="middle"
          fontWeight={700}
          fontSize={15}
          fill="#fff"
          opacity={0.90}
          style={{ fontFamily: "inherit" }}
        >{col}</text>
      );
    });
    return (
      <>
        {zoneLabels}
        {colLabels}
      </>
    );
  }

  function drawDot() {
    if (!dot) return null;
    // Shadow for ball
    return (
      <>
        <ellipse
          cx={dot.x + 7}
          cy={dot.y + 13}
          rx={10}
          ry={5}
          fill="#222"
          opacity={0.21}
        />
        <circle
          cx={dot.x}
          cy={dot.y}
          r={13}
          fill="#fa4605"
          stroke="#fff"
          strokeWidth={3.2}
        />
      </>
    );
  }

  return (
    <div
      className="flex flex-col items-center bg-[#181a18] shadow-2xl rounded-2xl p-4"
      style={{ minWidth: WIDTH, minHeight: HEIGHT + 38 }}
    >
      <div className="font-bold text-2xl mb-2 text-[#e3ffe3] tracking-wide"
        style={{ letterSpacing: 1 }}>
        Pitch Map
      </div>
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{ background: "#181a18", borderRadius: 36 }}
        onClick={handleClick}
      >
        {/* SVG shadow filter */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="13" stdDeviation="8" floodColor="#111" floodOpacity="0.27" />
          </filter>
        </defs>
        {/* Zones */}
        {drawZones()}
        {/* Main pitch */}
        {drawPitchShape()}
        {/* Vertical stripes */}
        {drawPitchStripes()}
        {/* Lines */}
        {drawColumns()}
        {drawZoneLines()}
        {/* Stumps & creases */}
        {drawStumps()}
        {/* Batsman oval */}
        {drawBatsmanShadow()}
        {/* Labels */}
        {drawLabels()}
        {/* Ball */}
        {drawDot()}
      </svg>
      <div className="text-xs text-[#e3ffe3] mt-3 tracking-wide">
        Click within the pitch to mark ball:{" "}
        <span className="font-semibold text-white">
          {dot ? `${dot.row}, ${dot.col}` : "--"}
        </span>
      </div>
    </div>
  );
};

export default PitchMap;
