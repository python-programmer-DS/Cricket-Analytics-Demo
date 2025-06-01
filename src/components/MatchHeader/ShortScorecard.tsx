// src/components/MatchHeader/ShortScorecard.tsx
import React from "react";

export interface ShortScorecardProps {
  batsmen: Array<{ name: string; runs: number; balls: number; fours: number; sixes: number }>;
  bowler: { name: string; overs: string; runs: number; maidens: number; wickets: number; eco: number };
}

const ShortScorecard: React.FC<ShortScorecardProps> = ({ batsmen, bowler }) => (
  <div className="bg-[#1d252a] rounded-xl px-6 py-2 flex flex-col items-center shadow gap-1 min-w-[320px]">
    <div className="grid grid-cols-3 gap-2 w-full text-[#89ffb5] text-xs">
      <span className="font-semibold">BATSMAN</span>
      <span>R(B)</span>
      <span>4s/6s</span>
    </div>
    {batsmen.map((b, i) => (
      <div className="grid grid-cols-3 gap-2 w-full" key={b.name + i}>
        <span className="font-bold">{b.name}</span>
        <span>{b.runs} ({b.balls})</span>
        <span>{b.fours} / {b.sixes}</span>
      </div>
    ))}
    <div className="h-[1px] bg-gray-700 my-1 w-full" />
    <div className="grid grid-cols-3 gap-2 w-full text-[#fff4b7] text-xs">
      <span className="font-semibold">BOWLER</span>
      <span>O-M-R-W</span>
      <span>ECO</span>
    </div>
    <div className="grid grid-cols-3 gap-2 w-full font-bold">
      <span>{bowler.name}</span>
      <span>{bowler.overs}-{bowler.maidens}-{bowler.runs}-{bowler.wickets}</span>
      <span>{bowler.eco}</span>
    </div>
  </div>
);

export default ShortScorecard;
