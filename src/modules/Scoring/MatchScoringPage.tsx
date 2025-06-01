// src/pages/MatchScoringPage.tsx
import React from "react";
import MatchHeader from "../../components/MatchHeader/MatchHeader";
import PitchMap from "../../components/PitchMap";
import WagonWheel from "../../components/WagonWheel";
import VideoPlayerSection from "../../components/VideoPlayerSection/VideoPlayerSection";
import BallTypeSection from "../../components/BallTypeSection/BallTypeSection";
import ShotTypeSection from "../../components/ShotTypeSection/ShotTypeSection";
import EventSection from "../../components/EventSection/EventSection";

const MatchScoringPage = () => {
  return (
    <div className="min-h-screen bg-[#11161a] flex flex-col items-center">
      <MatchHeader
        matchName="IPL 2025"
        homeTeam={{ name: "RCB" }}
        awayTeam={{ name: "CSK" }}
        live={true}
        score={{ runs: 84, wickets: 2, overs: "10.3" }}
        stats={{
          runRate: 7.5, partnership: "32 (18)", target: "160", reqRate: 8.2, ballsLeft: 57, wicketsLeft: 8
        }}
        shortScorecard={{
          batsmen: [
            { name: "Virat Kohli", runs: 35, balls: 24, fours: 4, sixes: 1 },
            { name: "Faf du Plessis", runs: 26, balls: 18, fours: 2, sixes: 1 }
          ],
          bowler: { name: "Jadeja", overs: "2.3", runs: 12, maidens: 0, wickets: 1, eco: 4.8 }
        }}
      />
      {/* Main Grid */}
      <div className="w-full max-w-7xl grid grid-cols-12 gap-8 mt-4">
        <div className="col-span-3 flex flex-col"><PitchMap onSelect={function (row: string, col: string, x: number, y: number): void {
          throw new Error("Function not implemented.");
        } } /></div>
        <div className="col-span-6 flex flex-col items-center">
          <VideoPlayerSection />
          <div className="flex gap-3 mt-4">
            <button className="bg-[#ff7676] px-4 py-2 rounded-lg font-semibold">End Over</button>
            <button className="bg-[#39e7af] px-4 py-2 rounded-lg font-semibold">Start Ball</button>
            <button className="bg-[#8ab4f8] px-4 py-2 rounded-lg font-semibold">Start Capture</button>
          </div>
        </div>
        <div className="col-span-3 flex flex-col"><WagonWheel /></div>
      </div>
      <div className="w-full max-w-7xl grid grid-cols-12 gap-8 mt-4">
        <div className="col-span-6"><BallTypeSection /></div>
        <div className="col-span-6"><ShotTypeSection /></div>
      </div>
      <div className="w-full max-w-7xl mt-4"><EventSection /></div>
    </div>
  );
};

export default MatchScoringPage;
