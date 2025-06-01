// src/components/MatchHeader/MatchHeader.tsx
import React from "react";
import ShortScorecard, { type ShortScorecardProps } from "./ShortScorecard";

export interface Team {
  name: string;
  shortName?: string;
  logoUrl?: string;
}

export interface MatchHeaderProps {
  matchName: string;
  homeTeam: Team;
  awayTeam: Team;
  live?: boolean;
  score: { runs: number; wickets: number; overs: string };
  stats: {
    runRate: number;
    partnership: string;
    target: string;
    reqRate: number;
    ballsLeft: number;
    wicketsLeft: number;
  };
  shortScorecard: ShortScorecardProps;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({
  matchName,
  homeTeam,
  awayTeam,
  live,
  score,
  stats,
  shortScorecard
}) => (
  <header className="w-full max-w-7xl mx-auto rounded-2xl bg-[#181d23] p-4 shadow flex flex-col gap-3 mb-3 sticky top-0 z-50">
    <div className="flex flex-row justify-between items-center">
      <div className="flex gap-2 items-center">
        <span className="font-bold text-lg text-[#e0ffe5]">{matchName}</span>
        {live && <span className="bg-blue-700 text-white px-2 rounded text-xs ml-1">LIVE</span>}
      </div>
      <div className="text-[#f7fda1] font-extrabold text-2xl">{score.runs}/{score.wickets}
        <span className="text-xs ml-2 text-blue-100 font-normal">Over: {score.overs}</span>
      </div>
    </div>
    {/* ShortScorecard center aligned */}
    <div className="flex justify-center">
      <ShortScorecard {...shortScorecard} />
    </div>
    {/* Stats row */}
    <div className="flex flex-row gap-6 justify-center text-xs text-[#b3f1cd]">
      <span>Run Rate <b className="text-[#9ffe63]">{stats.runRate}</b></span>
      <span>Target <b className="text-[#eee]">{stats.target}</b></span>
      <span>Partnership <b className="text-[#eee]">{stats.partnership}</b></span>
      <span>Req. Rate <b className="text-[#ffd6a1]">{stats.reqRate}</b></span>
      <span>Balls Left <b className="text-[#fff]">{stats.ballsLeft}</b></span>
      <span>Wickets Left <b className="text-[#fff]">{stats.wicketsLeft}</b></span>
    </div>
  </header>
);

export default MatchHeader;
