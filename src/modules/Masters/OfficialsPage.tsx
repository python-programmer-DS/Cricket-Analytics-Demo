import React, { useEffect, useState } from "react";
import { db, type Official } from "../../db/db";

const roles = ["Umpire", "Match Referee"];
const categories = ["International", "Domestic", "Elite", "Plate"];
const statuses = ["Active", "Retired"];

const emptyOfficial: Official = {
  name: "",
  photo: "",
  role: "",
  nationality: "",
  experience: 0,
  category: "",
  state: "",
  status: "Active",
};

const OfficialsPage: React.FC = () => {
  const [form, setForm] = useState<Official>({ ...emptyOfficial });
  const [officials, setOfficials] = useState<Official[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    db.officials.toArray().then(setOfficials);
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
    setForm({ ...emptyOfficial });
    setEditId(null);
    setError("");
  };

  const saveOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) return setError("Name & Role are required.");
    setError("");
    if (editId) {
      await db.officials.update(editId, form);
    } else {
      await db.officials.add(form);
    }
    setOfficials(await db.officials.toArray());
    clearForm();
  };

  const handleEdit = (o: Official) => {
    setForm(o);
    setEditId(o.id ?? null);
    setError("");
  };

  const handleDelete = async (id?: number) => {
    if (id) {
      await db.officials.delete(id);
      setOfficials(await db.officials.toArray());
      clearForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-12">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Officials</h2>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-50">
        <form onSubmit={saveOfficial} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {error && <div className="col-span-2 text-red-600 font-medium">{error}</div>}
          <div>
            <label className="font-semibold text-sm">Name*</label>
            <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required />
          </div>
          <div>
            <label className="font-semibold text-sm">Role*</label>
            <select name="role" value={form.role} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required>
              <option value="">Select</option>
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Photo</label>
            <input type="file" accept="image/*" onChange={handlePhoto} className="block mt-1" />
            {form.photo && <img src={form.photo} alt="Official" className="h-12 w-12 rounded-full mt-2" />}
          </div>
          <div>
            <label className="font-semibold text-sm">Nationality</label>
            <input name="nationality" value={form.nationality} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">State</label>
            <input name="state" value={form.state || ""} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">Experience (matches)</label>
            <input type="number" name="experience" value={form.experience} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" min={0} />
          </div>
          <div>
            <label className="font-semibold text-sm">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1">
              <option value="">Select</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1">
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2 flex gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-bold transition">{editId ? "Update" : "Save"}</button>
            <button type="button" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-bold transition" onClick={clearForm}>Clear</button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        <div className="font-bold text-lg mb-3 text-blue-800">All Officials</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-2 py-2">Photo</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">State</th>
                <th className="px-2 py-2">Nationality</th>
                <th className="px-2 py-2">Experience</th>
                <th className="px-2 py-2">Category</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {officials.map((o) => (
                <tr key={o.id} className="border-b">
                  <td className="px-2 py-2">
                    {o.photo ? (
                      <img src={o.photo} alt="Official" className="h-8 w-8 rounded-full mx-auto object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M5.121 17.804A9.004 9.004 0 0112 15c2.137 0 4.113.747 5.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2">{o.name}</td>
                  <td className="px-2 py-2">{o.role}</td>
                  <td className="px-2 py-2">{o.state}</td>
                  <td className="px-2 py-2">{o.nationality}</td>
                  <td className="px-2 py-2">{o.experience}</td>
                  <td className="px-2 py-2">{o.category}</td>
                  <td className="px-2 py-2">{o.status}</td>
                  <td className="px-2 py-2">
                    <button onClick={() => handleEdit(o)} className="text-blue-700 hover:underline mr-2 font-medium">Edit</button>
                    <button onClick={() => handleDelete(o.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {officials.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-400">No officials added.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficialsPage;
