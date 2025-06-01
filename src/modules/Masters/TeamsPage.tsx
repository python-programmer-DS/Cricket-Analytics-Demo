import React, { useState, useEffect } from "react";
import { db } from "../../db/db";
import type { Team } from "../../db/db";

const emptyTeam: Team = {
  name: "",
  code: "",
  teamType: "",
  logo: "",
  country: "",
  // The rest will be ignored
};

const teamTypes = ["Franchise", "National", "State", "Club", "Other"];

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [form, setForm] = useState<Team>({ ...emptyTeam });
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    db.teams.toArray().then(setTeams);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setForm({ ...emptyTeam });
    setEditId(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!form.name.trim()) return setError("Team Name is required.");
    if (!form.code.trim()) return setError("Team Code is required.");
    if (!form.teamType.trim()) return setError("Team Type is required.");
    if (!form.country.trim()) return setError("Country/Region is required.");

    setError("");
    if (editId) {
      await db.teams.update(editId, form);
    } else {
      await db.teams.add(form);
    }
    setTeams(await db.teams.toArray());
    clearForm();
  };

  const handleEdit = (team: Team) => {
    setForm(team);
    setEditId(team.id ?? null);
    setError("");
  };

  const handleDelete = async (id?: number) => {
    if (id) {
      await db.teams.delete(id);
      setTeams(await db.teams.toArray());
      clearForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-12">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Teams</h2>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-50">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {error && <div className="col-span-2 text-red-600 font-medium">{error}</div>}
          <div>
            <label className="font-semibold text-sm">Team Name*</label>
            <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" required />
          </div>
          <div>
            <label className="font-semibold text-sm">Team Code*</label>
            <input name="code" value={form.code} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" maxLength={8} required />
          </div>
          <div>
            <label className="font-semibold text-sm">Team Type*</label>
            <select name="teamType" value={form.teamType} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" required>
              <option value="">Select Type</option>
              {teamTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Country/Region*</label>
            <input name="country" value={form.country} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" required />
          </div>
          <div className="col-span-2 flex items-center gap-6 mt-3">
            <div className="flex flex-col items-center">
              <label htmlFor="team-logo" className="font-semibold text-sm mb-1">Team Logo</label>
              <div>
                {form.logo ? (
                  <img src={form.logo} alt="Logo" className="h-16 w-16 rounded-full border-2 border-blue-200 object-cover shadow" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200 shadow">
                    <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M5.121 17.804A9.004 9.004 0 0112 15c2.137 0 4.113.747 5.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <input id="team-logo" type="file" accept="image/*" onChange={handleLogoChange} className="block mt-1" />
            </div>
          </div>
          <div className="col-span-2 flex gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-bold transition">{editId ? "Update" : "Save"}</button>
            <button type="button" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-bold transition" onClick={clearForm}>Clear</button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        <div className="font-bold text-lg mb-3 text-blue-800">All Teams</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-2 py-2">Logo</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Code</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Country/Region</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="px-2 py-2">
                    {t.logo ? (
                      <img src={t.logo} alt="Logo" className="h-8 w-8 rounded-full mx-auto object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M5.121 17.804A9.004 9.004 0 0112 15c2.137 0 4.113.747 5.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2">{t.name}</td>
                  <td className="px-2 py-2">{t.code}</td>
                  <td className="px-2 py-2">{t.teamType}</td>
                  <td className="px-2 py-2">{t.country}</td>
                  <td className="px-2 py-2">
                    <button onClick={() => handleEdit(t)} className="text-blue-700 hover:underline mr-2 font-medium">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">No teams added.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
