import React, { useEffect, useState } from "react";
import { db, type FieldingFactor } from "../../db/db";

const emptyField: FieldingFactor = { name: "" };

const FieldingFactorsPage: React.FC = () => {
  const [form, setForm] = useState<FieldingFactor>({ ...emptyField });
  const [factors, setFactors] = useState<FieldingFactor[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    db.fieldingFactors.toArray().then(setFactors);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, name: e.target.value }));
  };

  const clearForm = () => {
    setForm({ ...emptyField });
    setEditId(null);
  };

  const saveFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) {
      await db.fieldingFactors.update(editId, form);
    } else {
      await db.fieldingFactors.add(form);
    }
    setFactors(await db.fieldingFactors.toArray());
    clearForm();
  };

  const handleEdit = (f: FieldingFactor) => {
    setForm(f);
    setEditId(f.id ?? null);
  };

  const handleDelete = async (id?: number) => {
    if (id) {
      await db.fieldingFactors.delete(id);
      setFactors(await db.fieldingFactors.toArray());
      clearForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-12">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Fielding Factors</h2>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-50">
        <form onSubmit={saveFactor} className="flex flex-col gap-4">
          <div>
            <label className="font-semibold text-sm">Fielding Factor*</label>
            <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required />
          </div>
          <div className="flex gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-bold transition">{editId ? "Update" : "Save"}</button>
            <button type="button" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-bold transition" onClick={clearForm}>Clear</button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        <div className="font-bold text-lg mb-3 text-blue-800">All Fielding Factors</div>
        <table className="w-full text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-50 text-blue-900">
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {factors.map((f) => (
              <tr key={f.id} className="border-b">
                <td className="px-2 py-2">{f.name}</td>
                <td className="px-2 py-2">
                  <button onClick={() => handleEdit(f)} className="text-blue-700 hover:underline mr-2 font-medium">Edit</button>
                  <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {factors.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-400">No fielding factors added.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FieldingFactorsPage;
