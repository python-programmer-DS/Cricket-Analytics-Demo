// src/modules/Masters/CompetitionsPage.tsx

import React, { useEffect, useState } from "react";
import { db, type Competition, type Team } from "../../db/db";

const compTypes = ["International", "Domestic", "Franchise", "Club", "Local"];
const formats = ["Round Robin", "Double Round Robin", "Tri-Series", "Bilateral"];
const matchTypes = [
  "Test", "ODI", "T20I", "100 Balls", "T20D", "First Class", "List A", "T10D", "Others"
];
const statusOptions = ["Scheduled", "Ongoing", "Completed"];

const emptyForm: Competition = {
  name: "",
  season: new Date().getFullYear(),
  trophy: "",
  competitionType: "",
  format: "",
  startDate: "",
  endDate: "",
  videoLocation: "",
  matchType: "",
  listOfTeams: [],
  teamsParticipating: [],
  currentStatus: "Scheduled",
};

const CompetitionsPage: React.FC = () => {
  const [form, setForm] = useState<Competition>({ ...emptyForm });
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  // Load teams and competitions
  useEffect(() => {
    db.competitions.toArray().then(setCompetitions);
    db.teams.toArray().then(setTeams);
  }, []);

  // Add team to participating
  const addParticipating = (team: string) => {
    if (!form.teamsParticipating.includes(team)) {
      setForm(f => ({ ...f, teamsParticipating: [...f.teamsParticipating, team] }));
    }
  };
  // Remove team from participating
  const removeParticipating = (team: string) => {
    setForm(f => ({
      ...f,
      teamsParticipating: f.teamsParticipating.filter(t => t !== team)
    }));
  };

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const clearForm = () => {
    setForm({ ...emptyForm });
    setEditId(null);
  };

  const saveCompetition = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (
      !form.name || !form.season || !form.trophy || !form.competitionType ||
      !form.format || !form.matchType || !form.startDate || !form.endDate ||
      !form.teamsParticipating.length
    ) {
      alert("Please fill all mandatory fields (with *).");
      return;
    }
    // Save participating teams as the teams in the tournament (both fields, for now)
    const saveObj = {
      ...form,
      listOfTeams: teams.map(t => t.name), // All teams in DB (auto, or filter by region/criteria)
      teamsParticipating: form.teamsParticipating
    };
    if (editId) {
      await db.competitions.update(editId, saveObj);
    } else {
      await db.competitions.add(saveObj);
    }
    db.competitions.toArray().then(setCompetitions);
    clearForm();
  };

  const handleEdit = (c: Competition) => {
    setForm({ ...c });
    setEditId(c.id ?? null);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await db.competitions.delete(id);
    db.competitions.toArray().then(setCompetitions);
    if (editId === id) clearForm();
  };

  // List of teams in DB
  const allTeams = teams.map(t => t.name);

  // Available = not in participating, Participating = in list
  const availableTeams = allTeams.filter(tn => !form.teamsParticipating.includes(tn));
  const participatingTeams = form.teamsParticipating;

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-10">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-8">Competitions</h2>
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-10 border border-blue-50 mb-10">
        <form onSubmit={saveCompetition} autoComplete="off">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="font-semibold text-sm">Competition Name*</label>
              <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="font-semibold text-sm">Season*</label>
              <input
                type="number"
                min={2000}
                max={2100}
                name="season"
                value={form.season}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="font-semibold text-sm">Trophy*</label>
              <input name="trophy" value={form.trophy} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="font-semibold text-sm">Competition Type*</label>
              <select name="competitionType" value={form.competitionType} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300">
                <option value="">Select Type</option>
                {compTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold text-sm">Format*</label>
              <select name="format" value={form.format} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300">
                <option value="">Select Format</option>
                {formats.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold text-sm">Match Type*</label>
              <select name="matchType" value={form.matchType} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300">
                <option value="">Select Match Type</option>
                {matchTypes.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold text-sm">Start Date*</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="font-semibold text-sm">End Date*</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" />
            </div>
            <div className="col-span-2">
              <label className="font-semibold text-sm">Video Location</label>
              <input name="videoLocation" value={form.videoLocation} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-8">
            {/* Dual List Selector for Teams */}
            <div>
              <div className="font-semibold text-sm mb-2">List of Teams*</div>
              <div className="flex gap-4">
                <ul className="flex-1 h-40 bg-blue-50 border rounded-lg overflow-auto p-2">
                  {availableTeams.map(tn => (
                    <li
                      key={tn}
                      className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-blue-100 rounded"
                      onClick={() => addParticipating(tn)}
                    >
                      <span>{tn}</span>
                      <span className="text-blue-700 text-lg font-bold">+</span>
                    </li>
                  ))}
                  {availableTeams.length === 0 && (
                    <li className="text-gray-400 text-sm text-center">No teams available</li>
                  )}
                </ul>
                <ul className="flex-1 h-40 bg-green-50 border rounded-lg overflow-auto p-2">
                  {participatingTeams.map(tn => (
                    <li
                      key={tn}
                      className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-green-100 rounded"
                      onClick={() => removeParticipating(tn)}
                    >
                      <span>{tn}</span>
                      <span className="text-red-500 text-lg font-bold">-</span>
                    </li>
                  ))}
                  {participatingTeams.length === 0 && (
                    <li className="text-gray-400 text-sm text-center">No teams selected</li>
                  )}
                </ul>
              </div>
              <div className="flex text-xs mt-1">
                <span className="flex-1 text-blue-600">Click <b>+</b> to add</span>
                <span className="flex-1 text-green-600 text-right">Click <b>-</b> to remove</span>
              </div>
            </div>
            <div>
              <label className="font-semibold text-sm">Status*</label>
              <select name="currentStatus" value={form.currentStatus} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300">
                {statusOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-800 font-bold transition">Save</button>
            <button type="button" className="bg-gray-200 text-gray-800 px-8 py-2 rounded-lg hover:bg-gray-300 font-bold transition" onClick={clearForm}>Clear</button>
          </div>
        </form>
      </div>
      {/* Table of Competitions */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        <div className="font-bold text-lg mb-3 text-blue-800">All Competitions</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Season</th>
                <th className="px-2 py-2">Trophy</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Format</th>
                <th className="px-2 py-2">Match Type</th>
                <th className="px-2 py-2">Teams</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {competitions.map(c => (
                <tr key={c.id} className="border-b">
                  <td className="px-2 py-2">{c.name}</td>
                  <td className="px-2 py-2">{c.season}</td>
                  <td className="px-2 py-2">{c.trophy}</td>
                  <td className="px-2 py-2">{c.competitionType}</td>
                  <td className="px-2 py-2">{c.format}</td>
                  <td className="px-2 py-2">{c.matchType}</td>
                  <td className="px-2 py-2">
                    {c.teamsParticipating && c.teamsParticipating.length > 0
                      ? c.teamsParticipating.map(tn => (
                        <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs mr-1 mb-1" key={tn}>{tn}</span>
                      ))
                      : "-"}
                  </td>
                  <td className="px-2 py-2">{c.currentStatus}</td>
                  <td className="px-2 py-2">
                    <button onClick={() => handleEdit(c)} className="text-blue-700 hover:underline mr-2 font-medium">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {competitions.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-400">No competitions added.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompetitionsPage;
