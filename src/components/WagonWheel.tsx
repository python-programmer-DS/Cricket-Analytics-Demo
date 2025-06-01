import React, { useEffect, useState } from "react";

// FIELDING SECTORS ORDERED CLOCKWISE FROM TOP
const sectors = [
  "Fine Leg",
  "Square Leg",
  "Mid Wicket",
  "Long On",
  "Long Off",
  "Covers",
  "Point",
  "Third Man",
];

const GROUND_RADIUS = 150;
const INNER_RADIUS = 75; // For analysis: inner circle
const PITCH_WIDTH = 20;
const PITCH_LENGTH = 80; // Pitch length within ground
const SVG_SIZE = 340;
const CENTER = SVG_SIZE / 2;
const fieldGreen = "url(#fieldGradient)";

interface WagonWheelProps {
  onDraw?: (sector: string, r: number, theta: number) => void;
  resetTrigger?: number;
}

const WagonWheel: React.FC<WagonWheelProps> = ({ onDraw, resetTrigger }) => {
  const [shot, setShot] = useState<{ sector: string; r: number; theta: number } | null>(null);

  useEffect(() => setShot(null), [resetTrigger]);

  // Arcs for sector boundaries
  const sectorAngle = (2 * Math.PI) / sectors.length;

  // Find which sector and radius was clicked
  function handleClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * SVG_SIZE;
    const y = ((e.clientY - rect.top) / rect.height) * SVG_SIZE;
    const dx = x - CENTER;
    const dy = y - CENTER;
    const r = Math.sqrt(dx * dx + dy * dy);

    if (r > GROUND_RADIUS) return; // ignore clicks outside ground

    // 0 = "north"/top, clockwise
    let theta = Math.atan2(dy, dx);
    if (theta < -Math.PI / 2) theta += 2 * Math.PI; // normalize
    if (theta < 0) theta += 2 * Math.PI;

    // Sector 0 starts at -90deg (top, 12 o'clock), then clockwise
    const sectorIdx = Math.floor((theta + sectorAngle / 2) / sectorAngle) % sectors.length;
    const sector = sectors[sectorIdx];

    setShot({ sector, r, theta });
    onDraw && onDraw(sector, r, theta);
  }

  // Draw pitch in the center, brown, vertical
  function drawPitch() {
    return (
      <rect
        x={CENTER - PITCH_WIDTH / 2}
        y={CENTER - PITCH_LENGTH / 2}
        width={PITCH_WIDTH}
        height={PITCH_LENGTH}
        rx={7}
        fill="#dbb173"
        stroke="#b88731"
        strokeWidth={2}
        filter="url(#shadow)"
      />
    );
  }

  // Draw sector boundaries as *curved* lines (arcs from center to outer edge)
  function drawSectorLines() {
    return sectors.map((_, i) => {
      const angle = -Math.PI / 2 + i * sectorAngle; // -90deg is "up"
      const x = CENTER + GROUND_RADIUS * Math.cos(angle);
      const y = CENTER + GROUND_RADIUS * Math.sin(angle);
      return (
        <path
          key={i}
          d={`M${CENTER},${CENTER} L${x},${y}`}
          stroke="#fff"
          strokeWidth={2}
          opacity={0.7}
        />
      );
    });
  }

  // Draw sector labels, inside the pies
  function drawLabels() {
    return sectors.map((sector, i) => {
      const angle = -Math.PI / 2 + (i + 0.5) * sectorAngle;
      // halfway from center to outer edge, but a little closer to center
      const labelR = GROUND_RADIUS * 0.70;
      const x = CENTER + labelR * Math.cos(angle);
      const y = CENTER + labelR * Math.sin(angle) + 4;
      return (
        <text
          key={sector}
          x={x}
          y={y}
          textAnchor="middle"
          fontWeight={600}
          fontSize={16}
          fill="#222"
          opacity={0.48}
          pointerEvents="none"
        >
          {sector}
        </text>
      );
    });
  }

  // Draw the inner circle (for analysis)
  function drawInnerCircle() {
    return (
      <circle
        cx={CENTER}
        cy={CENTER}
        r={INNER_RADIUS}
        fill="none"
        stroke="#fff"
        strokeDasharray="6,5"
        strokeWidth={2}
        opacity={0.6}
      />
    );
  }

  // Draw the shot (line from top of pitch to click)
  function drawShot() {
    if (!shot) return null;
    // The pitch runs from center vertically. Start from center (batsman) and draw to shot.
    const pitchTopY = CENTER - PITCH_LENGTH / 2;
    return (
      <g>
        <circle cx={CENTER} cy={pitchTopY} r={6} fill="#dbb173" stroke="#b88731" strokeWidth={2} />
        <line
          x1={CENTER}
          y1={pitchTopY}
          x2={CENTER + shot.r * Math.cos(shot.theta)}
          y2={CENTER + shot.r * Math.sin(shot.theta)}
          stroke="#e85523"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <circle
          cx={CENTER + shot.r * Math.cos(shot.theta)}
          cy={CENTER + shot.r * Math.sin(shot.theta)}
          r={10}
          fill="#e85523"
          stroke="#fff"
          strokeWidth={3}
        />
      </g>
    );
  }

  return (
    <div
      className="flex flex-col items-center bg-[#181e19] shadow-2xl rounded-2xl p-4"
      style={{ minWidth: SVG_SIZE, minHeight: SVG_SIZE + 36 }}
    >
      <div className="font-bold text-lg mb-2 text-[#e3ffe3] tracking-wide">Wagon Wheel</div>
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        style={{ background: "#213921", borderRadius: 30, boxShadow: "0 4px 32px #061a0939" }}
        onClick={handleClick}
      >
        <defs>
          <radialGradient id="fieldGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#7CFC00" />
            <stop offset="100%" stopColor="#228B22" />
          </radialGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.2" />
          </filter>
        </defs>
        {/* Main green ground */}
        <circle cx={CENTER} cy={CENTER} r={GROUND_RADIUS} fill={fieldGreen} />
        {drawInnerCircle()}
        {/* Pitch */}
        {drawPitch()}
        {/* Pie lines */}
        {drawSectorLines()}
        {/* Labels */}
        {drawLabels()}
        {/* Shot line and dot */}
        {drawShot()}
      </svg>
      <div className="text-xs text-[#c0e5b0] mt-2 tracking-wide">
        Click inside the ground to mark shot direction.
        <br />
        <span className="font-semibold text-[#e3ffe3]">
          {shot ? shot.sector : "--"}
        </span>
      </div>
    </div>
  );
};

export default WagonWheel;
