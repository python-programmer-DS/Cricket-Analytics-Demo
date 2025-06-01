import React from "react";
import { useNavigate } from "react-router-dom";

const configOptions = [
  { label: "Database Configuration", route: "/config/database" },
  { label: "Application Configuration", route: "/config/application" },
  { label: "Shortcut Configuration", route: "/config/shortcuts" },
];

const ConfigPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-12">
      <div className="text-3xl font-extrabold mb-4 text-blue-800">Configuration</div>
      <div className="text-gray-500 mb-8">Set up the application and preferences</div>
      <div className="flex flex-col gap-6 w-full max-w-md">
        {configOptions.map(opt => (
          <button
            key={opt.label}
            className="bg-white p-6 rounded-2xl shadow-xl text-lg font-semibold hover:bg-green-50 transition border border-transparent hover:border-green-400"
            onClick={() => navigate(opt.route)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConfigPage;
