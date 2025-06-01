import React, { useEffect, useState } from "react";
import { db, type ShotType } from "../../db/db";

const shotTypeOptions = ["Aggressive", "Defensive"];

const emptyShotType: ShotType = {
  name: "",
  shotType: ""
};

const ShotTypesPage: React.FC = () => {
  const [form, setForm] = useState<ShotType>({ ...emptyShotType });
  const [shotTypes, setShotTypes] = useState<ShotType[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    db.shotTypes.toArray().then(setShotTypes);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const clearForm = () => {
    setForm({ ...emptyShotType });
    setEditId(null);
  };

  const saveShotType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.shotType) return;
    if (editId) {
      await db.shotTypes.update(editId, form);
    } else {
      await db.shotTypes.add(form);
    }
    setShotTypes(await db.shotTypes.toArray());
    clearForm();
  };

  const handleEdit = (s: ShotType) => {
    setForm(s);
    setEditId(s.id ?? null);
  };

  const handleDelete = async (id?: number) => {
    if (id) {
      await db.shotTypes.delete(id);
      setShotTypes(await db.shotTypes.toArray());
      clearForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-12">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Shot Types</h2>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-50">
        <form onSubmit={saveShotType} className="flex flex-col gap-4">
          <div>
            <label className="font-semibold text-sm">Shot Name*</label>
            <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required />
          </div>
          <div>
            <label className="font-semibold text-sm">Shot Type*</label>
            <select name="shotType" value={form.shotType} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required>
              <option value="">Select</option>
              {shotTypeOptions.map(st => <option key={st}>{st}</option>)}
            </select>
          </div>
          <div className="flex gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-bold transition">{editId ? "Update" : "Save"}</button>
            <button type="button" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-bold transition" onClick={clearForm}>Clear</button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        <div className="font-bold text-lg mb-3 text-blue-800">All Shot Types</div>
        <table className="w-full text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-50 text-blue-900">
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Type</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shotTypes.map((st) => (
              <tr key={st.id} className="border-b">
                <td className="px-2 py-2">{st.name}</td>
                <td className="px-2 py-2">{st.shotType}</td>
                <td className="px-2 py-2">
                  <button onClick={() => handleEdit(st)} className="text-blue-700 hover:underline mr-2 font-medium">Edit</button>
                  <button onClick={() => handleDelete(st.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {shotTypes.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-400">No shot types added.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export function useShotTypes() {
  const [shotTypes, setShotTypes] = React.useState<ShotType[]>([]);
  React.useEffect(() => {
    db.shotTypes.toArray().then(setShotTypes);
  }, []);
  return shotTypes;
}

export default ShotTypesPage;

