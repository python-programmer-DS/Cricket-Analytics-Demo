import React, { useEffect, useState } from "react";
import { db, type BallType } from "../../db/db";

const bowlerTypes = ["Spin", "Fast", "Medium"];

const emptyBallType: BallType = {
  name: "",
  bowlerType: "",
};

const BallTypesPage: React.FC = () => {
  const [form, setForm] = useState<BallType>({ ...emptyBallType });
  const [ballTypes, setBallTypes] = useState<BallType[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    db.ballTypes.toArray().then(setBallTypes);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const clearForm = () => {
    setForm({ ...emptyBallType });
    setEditId(null);
  };

  const saveBallType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.bowlerType) return;
    if (editId) {
      await db.ballTypes.update(editId, form);
    } else {
      await db.ballTypes.add(form);
    }
    setBallTypes(await db.ballTypes.toArray());
    clearForm();
  };

  const handleEdit = (b: BallType) => {
    setForm(b);
    setEditId(b.id ?? null);
  };

  const handleDelete = async (id?: number) => {
    if (id) {
      await db.ballTypes.delete(id);
      setBallTypes(await db.ballTypes.toArray());
      clearForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-12">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Ball Types</h2>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-50">
        <form onSubmit={saveBallType} className="flex flex-col gap-4">
          <div>
            <label className="font-semibold text-sm">Ball Type*</label>
            <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required />
          </div>
          <div>
            <label className="font-semibold text-sm">Bowler Type*</label>
            <select name="bowlerType" value={form.bowlerType} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required>
              <option value="">Select</option>
              {bowlerTypes.map(bt => <option key={bt}>{bt}</option>)}
            </select>
          </div>
          <div className="flex gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-bold transition">{editId ? "Update" : "Save"}</button>
            <button type="button" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-bold transition" onClick={clearForm}>Clear</button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        <div className="font-bold text-lg mb-3 text-blue-800">All Ball Types</div>
        <table className="w-full text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-50 text-blue-900">
              <th className="px-2 py-2">Type</th>
              <th className="px-2 py-2">Bowler Type</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ballTypes.map((bt) => (
              <tr key={bt.id} className="border-b">
                <td className="px-2 py-2">{bt.name}</td>
                <td className="px-2 py-2">{bt.bowlerType}</td>
                <td className="px-2 py-2">
                  <button onClick={() => handleEdit(bt)} className="text-blue-700 hover:underline mr-2 font-medium">Edit</button>
                  <button onClick={() => handleDelete(bt.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {ballTypes.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-400">No ball types added.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export function useBallTypes() {
  const [ballTypes, setBallTypes] = React.useState<BallType[]>([]);
  React.useEffect(() => {
    db.ballTypes.toArray().then(setBallTypes);
  }, []);
  return ballTypes;
}

export default BallTypesPage;
