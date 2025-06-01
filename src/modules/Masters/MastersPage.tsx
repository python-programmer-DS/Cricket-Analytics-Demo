import React from "react";
import { useNavigate } from "react-router-dom";

const masters = [
  { label: "Users", route: "/masters/users" },
  { label: "Competitions", route: "/masters/competitions" },
  { label: "Teams", route: "/masters/teams" },
  { label: "Players", route: "/masters/players" },
  { label: "Officials", route: "/masters/officials" },
  { label: "Coaches", route: "/masters/coaches" },
  { label: "Venues", route: "/masters/venues" },
  { label: "Shot Types", route: "/masters/shot-types" },
  { label: "Ball Types", route: "/masters/ball-types" },
  { label: "Bowler Specs", route: "/masters/bowler-specializations" },
  { label: "Fielding Factors", route: "/masters/fielding-factors" },
];

const MastersPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center justify-start py-12">
      <div className="text-3xl font-extrabold mb-4 text-blue-800">Masters</div>
      <div className="text-gray-500 mb-8">Manage all core data for scoring and analytics</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-3xl">
        {masters.map(m => (
          <button
            key={m.label}
            className="bg-white p-8 rounded-2xl shadow-xl text-lg font-semibold hover:bg-blue-50 transition border border-transparent hover:border-blue-400"
            onClick={() => navigate(m.route)}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MastersPage;
