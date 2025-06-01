import React from "react";

const DatabaseConfigPage: React.FC = () => (
  <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-20">
    <div className="text-2xl font-bold mb-6 text-blue-800">Database Configuration</div>
    <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-lg">
      {/* Add your backup/restore/export buttons here */}
      <button className="block w-full bg-blue-600 text-white font-bold py-2 rounded-lg mb-4 hover:bg-blue-700">Backup Database</button>
      <button className="block w-full bg-green-600 text-white font-bold py-2 rounded-lg mb-4 hover:bg-green-700">Restore Database</button>
      <button className="block w-full bg-yellow-500 text-white font-bold py-2 rounded-lg hover:bg-yellow-600">Export Data</button>
    </div>
  </div>
);

export default DatabaseConfigPage;
