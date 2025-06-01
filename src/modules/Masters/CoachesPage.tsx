import React, { useEffect, useState } from "react";
import { db, type Coach } from "../../db/db";

const coachRoles = [
  "Head Coach", "Batting Coach", "Bowling Coach", "Fielding Coach", "Physio", "Analyst"
];

const emptyCoach: Coach = {
  name: "",
  photo: "",
  team: "",
  nationality: "",
  role: "",
};

const CoachesPage: React.FC = () => {
  const [form, setForm] = useState<Coach>({ ...emptyCoach });
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    db.coaches.toArray().then(setCoaches);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, photo: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const clearForm = () => {
    setForm({ ...emptyCoach });
    setEditId(null);
  };

  const saveCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      alert("Name and Role are required.");
      return;
    }
    if (editId) {
      await db.coaches.update(editId, form);
    } else {
      await db.coaches.add(form);
    }
    setCoaches(await db.coaches.toArray());
    clearForm();
  };

  const handleEdit = (c: Coach) => {
    setForm(c);
    setEditId(c.id ?? null);
  };

  const handleDelete = async (id?: number) => {
    if (id) {
      await db.coaches.delete(id);
      setCoaches(await db.coaches.toArray());
      clearForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-12">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Coaches / Staff</h2>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-50">
        <form onSubmit={saveCoach} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-sm">Name*</label>
            <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required />
          </div>
          <div>
            <label className="font-semibold text-sm">Team</label>
            <input name="team" value={form.team} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">Photo</label>
            <input type="file" accept="image/*" onChange={handlePhoto} className="block mt-1" />
            {form.photo && <img src={form.photo} alt="Coach" className="h-12 w-12 rounded-full mt-2" />}
          </div>
          <div>
            <label className="font-semibold text-sm">Nationality</label>
            <input name="nationality" value={form.nationality} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">Role*</label>
            <select name="role" value={form.role} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required>
              <option value="">Select</option>
              {coachRoles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="col-span-2 flex gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-bold transition">{editId ? "Update" : "Save"}</button>
            <button type="button" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-bold transition" onClick={clearForm}>Clear</button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        <div className="font-bold text-lg mb-3 text-blue-800">All Coaches</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-2 py-2">Photo</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Team</th>
                <th className="px-2 py-2">Nationality</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="px-2 py-2">
                    {c.photo ? (
                      <img src={c.photo} alt="Coach" className="h-8 w-8 rounded-full mx-auto object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M5.121 17.804A9.004 9.004 0 0112 15c2.137 0 4.113.747 5.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2">{c.name}</td>
                  <td className="px-2 py-2">{c.role}</td>
                  <td className="px-2 py-2">{c.team}</td>
                  <td className="px-2 py-2">{c.nationality}</td>
                  <td className="px-2 py-2">
                    <button onClick={() => handleEdit(c)} className="text-blue-700 hover:underline mr-2 font-medium">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {coaches.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">No coaches added.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoachesPage;
