// src/components/BallTypeSection/BallTypeSection.tsx
import React, { useState } from "react";

// Dummy data, replace with your useBallTypes()
const demoTypes = [
  { name: "Inswinger", bowlerType: "Fast" }, { name: "Outswinger", bowlerType: "Fast" }, { name: "Leg Cutter", bowlerType: "Spin" }
];

const BallTypeSection: React.FC = () => {
  const [type, setType] = useState<"Fast" | "Spin">("Fast");
  // const ballTypes = useBallTypes();
  const ballTypes = demoTypes;

  return (
    <div className="bg-[#181d23] rounded-2xl shadow-xl p-4 flex flex-col gap-2 w-full">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-lg font-bold text-white">Ball Type</span>
        <button
          className={`px-3 py-1 rounded ${type === "Fast" ? "bg-[#39e7af] text-black font-bold" : "bg-[#262b2f] text-white"}`}
          onClick={() => setType("Fast")}
        >Fast</button>
        <button
          className={`px-3 py-1 rounded ${type === "Spin" ? "bg-[#39e7af] text-black font-bold" : "bg-[#262b2f] text-white"}`}
          onClick={() => setType("Spin")}
        >Spin</button>
        <input className="ml-4 bg-[#23272e] border-none px-3 py-1 rounded text-white w-20" placeholder="KPH" />
        <button className="ml-2 px-2 py-1 rounded bg-[#23272e] text-[#39e7af] font-bold text-lg">+</button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {ballTypes.filter(b => b.bowlerType === type).map(b => (
          <span className="bg-[#23272e] text-white rounded px-3 py-1 font-semibold text-sm" key={b.name}>{b.name}</span>
        ))}
      </div>
    </div>
  );
};

export default BallTypeSection;
