import React from "react";
import ProfileMenu from "./ProfileMenu";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[#f4f6fb]">
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow">
      <div className="flex items-center gap-2">
        <img src="/logo192.png" className="h-9 w-9 rounded-lg" alt="Logo" />
        <span className="font-bold text-xl text-gray-800">Cricket Analytics Pro</span>
      </div>
      <ProfileMenu />
    </header>
    <main className="flex-1 w-full mx-auto">{children}</main>
  </div>
);
export default MainLayout;
