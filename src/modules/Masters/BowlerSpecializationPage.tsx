import React, { useEffect, useState } from "react";
import { db, type BowlerSpecialization } from "../../db/db";

const bowlingTypes = ["Spin", "Fast"];
const bowlingStyles = ["Right", "Left"];

const emptySpec: BowlerSpecialization = {
  specialization: "",
  bowlingType: "",
  bowlingStyle: ""
};

const BowlerSpecializationPage: React.FC = () => {
  const [form, setForm] = useState<BowlerSpecialization>({ ...emptySpec });
  const [specs, setSpecs] = useState<BowlerSpecialization[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    db.bowlerSpecializations.toArray().then(setSpecs);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const clearForm = () => {
    setForm({ ...emptySpec });
    setEditId(null);
  };

  const saveSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.specialization.trim() || !form.bowlingType || !form.bowlingStyle) return;
    if (editId) {
      await db.bowlerSpecializations.update(editId, form);
    } else {
      await db.bowlerSpecializations.add(form);
    }
    setSpecs(await db.bowlerSpecializations.toArray());
    clearForm();
  };

  const handleEdit = (s: BowlerSpecialization) => {
    setForm(s);
    setEditId(s.id ?? null);
  };

  const handleDelete = async (id?: number) => {
    if (id) {
      await db.bowlerSpecializations.delete(id);
      setSpecs(await db.bowlerSpecializations.toArray());
      clearForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-12">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Bowler Specializations</h2>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-50">
        <form onSubmit={saveSpec} className="flex flex-col gap-4">
          <div>
            <label className="font-semibold text-sm">Specialization*</label>
            <input name="specialization" value={form.specialization} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required />
          </div>
          <div>
            <label className="font-semibold text-sm">Bowling Type*</label>
            <select name="bowlingType" value={form.bowlingType} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required>
              <option value="">Select</option>
              {bowlingTypes.map(bt => <option key={bt}>{bt}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Bowling Style*</label>
            <select name="bowlingStyle" value={form.bowlingStyle} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required>
              <option value="">Select</option>
              {bowlingStyles.map(bs => <option key={bs}>{bs}</option>)}
            </select>
          </div>
          <div className="flex gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-bold transition">{editId ? "Update" : "Save"}</button>
            <button type="button" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-bold transition" onClick={clearForm}>Clear</button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        <div className="font-bold text-lg mb-3 text-blue-800">All Bowler Specializations</div>
        <table className="w-full text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-50 text-blue-900">
              <th className="px-2 py-2">Specialization</th>
              <th className="px-2 py-2">Bowling Type</th>
              <th className="px-2 py-2">Bowling Style</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {specs.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="px-2 py-2">{s.specialization}</td>
                <td className="px-2 py-2">{s.bowlingType}</td>
                <td className="px-2 py-2">{s.bowlingStyle}</td>
                <td className="px-2 py-2">
                  <button onClick={() => handleEdit(s)} className="text-blue-700 hover:underline mr-2 font-medium">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {specs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">No bowler specs added.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BowlerSpecializationPage;
