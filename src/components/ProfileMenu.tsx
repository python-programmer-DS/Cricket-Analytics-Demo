import React, { useEffect, useState, useRef } from "react";
import { db } from "../db/db";
import ProfileModal from "./ProfileModal";

const defaultProfile = {
  name: "Guest User",
  photo: "",
};

const ProfileMenu: React.FC = () => {
  const [user, setUser] = useState<any>(defaultProfile);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load user info from IndexedDB, pick first user as "logged in"
  useEffect(() => {
    db.users?.toArray().then(users => {
      setUser(users?.[0] || defaultProfile);
    });
  }, []);

  // Close menu if clicked outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  // Avatar rendering: if no photo, show default
  const Avatar = () =>
    user.photo ? (
      <img src={user.photo} alt="User" className="h-11 w-11 rounded-full border object-cover" />
    ) : (
      <div className="h-11 w-11 rounded-full bg-gray-300 flex items-center justify-center">
        {/* Heroicons User SVG */}
        <svg className="h-7 w-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5.121 17.804A9.004 9.004 0 0112 15c2.137 0 4.113.747 5.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    );

  return (
    <div className="relative" ref={menuRef}>
      <button className="outline-none" onClick={() => setMenuOpen(m => !m)}>
        <Avatar />
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white py-2 z-50 border">
          <div className="px-4 py-2 text-gray-700 font-medium flex items-center gap-2">
            {user.photo ? (
              <img src={user.photo} alt="User" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M5.121 17.804A9.004 9.004 0 0112 15c2.137 0 4.113.747 5.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
            <span>{user.name || "Guest User"}</span>
          </div>
          <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  onClick={() => { setShowProfile(true); setMenuOpen(false); }}>
            Profile
          </button>
          <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  onClick={() => { window.location.href = "/settings"; }}>
            Settings
          </button>
          <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  onClick={() => alert("Logged out!")}>
            Logout
          </button>
        </div>
      )}
      {showProfile &&
        <ProfileModal user={user} onClose={() => setShowProfile(false)} onUpdate={u => setUser(u)} />
      }
    </div>
  );
};
export default ProfileMenu;
