import React, { useState } from "react";
import { db } from "../db/db";

const ProfileModal: React.FC<{
  user: any;
  onClose: () => void;
  onUpdate: (u: any) => void;
}> = ({ user, onClose, onUpdate }) => {
  const [form, setForm] = useState<any>({ ...user });
  const [imgPreview, setImgPreview] = useState<string | undefined>(user.photo);

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImgPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setForm((f: any) => ({ ...f, photoFile: file }));
  };

  const save = async () => {
    let photo = imgPreview;
    // Save/update in IndexedDB (users table)
    if (form.photoFile) {
      // convert file to base64
      photo = imgPreview;
    }
    const updated = { ...form, photo };
    await db.users.update(user.id, updated);
    onUpdate(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-xl w-96 p-6">
        <div className="flex flex-col items-center gap-2">
          {imgPreview ? (
            <img src={imgPreview} alt="User" className="h-20 w-20 rounded-full object-cover mb-2" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center mb-2">
              <svg className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M5.121 17.804A9.004 9.004 0 0112 15c2.137 0 4.113.747 5.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImg} className="mb-2" />
          <input type="text" className="border p-2 rounded w-full mb-2" placeholder="Name"
                 value={form.name || ""} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="flex justify-end gap-4 mt-2">
          <button className="bg-gray-200 px-4 py-1 rounded" onClick={onClose}>Cancel</button>
          <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
};
export default ProfileModal;
