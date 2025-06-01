import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../../components/ProfileMenu"; // adjust import if needed

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    if ((window as any).electronAPI?.closeApp) {
      (window as any).electronAPI.closeApp();
    } else {
      // Only show alert in browser mode
      alert("Close only works in the desktop app.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6fb]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div className="flex items-center gap-3">
          <img src="/cricket-image.png" alt="App Logo" className="w-10 h-10 rounded-lg" />
          <h1 className="text-2xl font-extrabold text-blue-700">Cricket Analytics Pro</h1>
        </div>
        <div className="flex items-center gap-5">
          <ProfileMenu />
          <button onClick={handleClose} className="hover:text-red-600 hidden md:block" title="Close App">
            <span className="material-icons">close</span>
          </button>
        </div>
      </header>
      {/* Banner */}
      <div className="flex justify-center py-6">
        <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl">
          <img
            src="/cricket-logo.png"
            alt="Cricket Banner"
            className="object-cover w-full opacity-60"
            style={{ minHeight: 150, maxHeight: 220 }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">Welcome to Cricket Analytics Pro</h1>
          </div>
        </div>
      </div>
      {/* Navigation Buttons */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 gap-8">
          <button className="bg-white p-8 rounded-2xl shadow-xl text-xl font-bold hover:bg-blue-50 transition"
            onClick={() => navigate("/config")}>Configuration</button>
          <button className="bg-white p-8 rounded-2xl shadow-xl text-xl font-bold hover:bg-green-50 transition"
            onClick={() => navigate("/masters")}>Masters</button>
          <button className="bg-white p-8 rounded-2xl shadow-xl text-xl font-bold hover:bg-yellow-50 transition"
            onClick={() => navigate("/match-registration")}>Match Registration</button>
          <button className="bg-white p-8 rounded-2xl shadow-xl text-xl font-bold hover:bg-purple-50 transition"
            onClick={() => navigate("/scoring")}>Scoring</button>
          <button className="col-span-2 bg-white p-8 rounded-2xl shadow-xl text-xl font-bold hover:bg-gray-100 transition"
            onClick={() => navigate("/reports")}>Reports</button>
        </div>
      </main>
      <div className="text-gray-400 text-xs text-center my-6">
        Powered by your technical co-founder · Version 1.0
      </div>
    </div>
  );
};
export default Home;
