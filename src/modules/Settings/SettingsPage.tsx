import React, { useState, useEffect } from "react";
import { db } from "../../db/db";

const SettingsPage: React.FC = () => {
  const [storageDirName, setStorageDirName] = useState<string | null>(null);

  useEffect(() => {
    // Load saved config if exists
    db.appConfigs.toArray().then((cfgs) => {
      if (cfgs[0]?.storageDirHandle && cfgs[0]?.storageDirHandle.name) {
        setStorageDirName(cfgs[0].storageDirHandle.name);
      }
    });
  }, []);

  // File System Access API for picking folder
  const handlePickFolder = async () => {
    // @ts-ignore
    if ('showDirectoryPicker' in window) {
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker();
      // Save to IndexedDB
      await db.appConfigs.clear();
      await db.appConfigs.add({ storageDirHandle: dirHandle });
      setStorageDirName(dirHandle.name);
      alert("Folder selected: " + dirHandle.name);
    } else {
      alert("Folder picking not supported in this browser. Use Chrome/Edge or Electron.");
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Application Settings</h2>
      <div className="mb-4">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700"
          onClick={handlePickFolder}
        >
          Pick Base Folder for Match Data
        </button>
        {storageDirName && (
          <div className="mt-2 text-green-700">
            Current Folder: <b>{storageDirName}</b>
          </div>
        )}
      </div>
      <div className="text-gray-500 text-sm">
        <b>Note:</b> The folder you select will be used to save all videos and match data.
      </div>
    </div>
  );
};

export default SettingsPage;
