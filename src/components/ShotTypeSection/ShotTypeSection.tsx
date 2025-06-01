// src/components/ShotTypeSection/ShotTypeSection.tsx
import React, { useState } from "react";

// Dummy data, replace with your useShotTypes()
const demoShots = [
  { name: "Cover Drive", shotType: "Aggressive" }, { name: "Flick", shotType: "Aggressive" }, { name: "Cut", shotType: "Defensive" }
];

const ShotTypeSection: React.FC = () => {
  const [type, setType] = useState<"Aggressive" | "Defensive">("Aggressive");
  // const shotTypes = useShotTypes();
  const shotTypes = demoShots;

  return (
    <div className="bg-[#181d23] rounded-2xl shadow-xl p-4 flex flex-col gap-2 w-full">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-lg font-bold text-white">Shot Type</span>
        <button
          className={`px-3 py-1 rounded ${type === "Aggressive" ? "bg-yellow-300 text-black font-bold" : "bg-[#262b2f] text-white"}`}
          onClick={() => setType("Aggressive")}
        >Aggressive</button>
        <button
          className={`px-3 py-1 rounded ${type === "Defensive" ? "bg-yellow-300 text-black font-bold" : "bg-[#262b2f] text-white"}`}
          onClick={() => setType("Defensive")}
        >Defensive</button>
        <input className="ml-4 bg-[#23272e] border-none px-3 py-1 rounded text-white w-24" placeholder="6's Distar" />
        <button className="ml-2 px-2 py-1 rounded bg-[#23272e] text-yellow-300 font-bold text-lg">+</button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {shotTypes.filter(s => s.shotType === type).map(s => (
          <span className="bg-[#23272e] text-white rounded px-3 py-1 font-semibold text-sm" key={s.name}>{s.name}</span>
        ))}
      </div>
    </div>
  );
};

export default ShotTypeSection;
