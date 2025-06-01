import React, { useEffect, useState } from "react";
import { db, type Player, type BowlerSpecialization } from "../../db/db";

const battingOrders = [
  "Opener", "Top Order", "Middle Order", "Lower Middle Order", "Finisher"
];
const playerRoles = [
  "Allrounder", "Batter", "Bowler", "Batting Allrounder", "Bowling Allrounder"
];
const statuses = ["Active", "Retired"];

const bowlingStyles = ["Fast", "Spin"];
const bowlingTypes = ["Fast", "Spin"];

const emptyPlayer: Player = {
  name: "",
  playerId: 0,
  shortName: "",
  photo: "",
  dob: "",
  nationality: "",
  battingStyle: "",
  battingOrder: "",
  bowlingStyle: "",
  bowlingType: "",
  bowlingSpecialization: "",
  playerRole: "",
  team: "",
  status: "Active"
};

const PlayersPage: React.FC = () => {
  const [form, setForm] = useState<Player>({ ...emptyPlayer });
  const [players, setPlayers] = useState<Player[]>([]);
  const [bowlerSpecs, setBowlerSpecs] = useState<BowlerSpecialization[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    db.players.toArray().then(setPlayers);
    db.bowlerSpecializations.toArray().then(setBowlerSpecs);
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
    setForm({ ...emptyPlayer });
    setEditId(null);
    setError("");
  };

  const savePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add any required validations here
    if (!form.name.trim()) return setError("Player Name is required.");
    if (!form.shortName.trim()) return setError("Short Name is required.");
    if (!form.playerRole.trim()) return setError("Player Role is required.");
    if (!form.status) return setError("Status is required.");
    setError("");
    if (editId) {
      await db.players.update(editId, form);
    } else {
      await db.players.add(form);
    }
    setPlayers(await db.players.toArray());
    clearForm();
  };

  const handleEdit = (p: Player) => {
    setForm(p);
    setEditId(p.id ?? null);
    setError("");
  };

  const handleDelete = async (id?: number) => {
    if (id) {
      await db.players.delete(id);
      setPlayers(await db.players.toArray());
      clearForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-12">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Players</h2>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-50">
        <form onSubmit={savePlayer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {error && <div className="col-span-2 text-red-600 font-medium">{error}</div>}
          <div>
            <label className="font-semibold text-sm">Player Name*</label>
            <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required />
          </div>
          <div>
            <label className="font-semibold text-sm">Short Name*</label>
            <input name="shortName" value={form.shortName} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required />
          </div>
          <div>
            <label className="font-semibold text-sm">Player ID</label>
            <input type="number" name="playerId" value={form.playerId} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">Nationality</label>
            <input name="nationality" value={form.nationality} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">Batting Style</label>
            <input name="battingStyle" value={form.battingStyle} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">Batting Order</label>
            <select name="battingOrder" value={form.battingOrder} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1">
              <option value="">Select</option>
              {battingOrders.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Bowling Style</label>
            <select name="bowlingStyle" value={form.bowlingStyle} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1">
              <option value="">Select</option>
              {bowlingStyles.map(bs => <option key={bs}>{bs}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Bowling Type</label>
            <select name="bowlingType" value={form.bowlingType} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1">
              <option value="">Select</option>
              {bowlingTypes.map(bt => <option key={bt}>{bt}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Bowling Specialization</label>
            <select name="bowlingSpecialization" value={form.bowlingSpecialization} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1">
              <option value="">Select</option>
              {bowlerSpecs.map(spec => (
                <option value={spec.specialization} key={spec.id}>{spec.specialization}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Player Role*</label>
            <select name="playerRole" value={form.playerRole} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required>
              <option value="">Select</option>
              {playerRoles.map(role => <option key={role}>{role}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Status*</label>
            <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Team</label>
            <input name="team" value={form.team} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          {/* Player Photo */}
          <div className="flex flex-col items-center">
            <label className="font-semibold text-sm mb-1">Photo</label>
            <div>
              {form.photo ? (
                <img src={form.photo} alt="Player" className="h-16 w-16 rounded-full border-2 border-blue-200 object-cover shadow" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200 shadow">
                  <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M5.121 17.804A9.004 9.004 0 0112 15c2.137 0 4.113.747 5.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handlePhoto} className="block mt-1" />
          </div>
          <div className="col-span-2 flex gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-bold transition">{editId ? "Update" : "Save"}</button>
            <button type="button" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-bold transition" onClick={clearForm}>Clear</button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        <div className="font-bold text-lg mb-3 text-blue-800">All Players</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-2 py-2">Photo</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Short Name</th>
                <th className="px-2 py-2">ID</th>
                <th className="px-2 py-2">Nationality</th>
                <th className="px-2 py-2">Batting</th>
                <th className="px-2 py-2">Bowling Style</th>
                <th className="px-2 py-2">Bowling Type</th>
                <th className="px-2 py-2">Bowling Spec</th>
                <th className="px-2 py-2">Player Role</th>
                <th className="px-2 py-2">Team</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="px-2 py-2">
                    {p.photo ? (
                      <img src={p.photo} alt="Player" className="h-8 w-8 rounded-full mx-auto object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M5.121 17.804A9.004 9.004 0 0112 15c2.137 0 4.113.747 5.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2">{p.name}</td>
                  <td className="px-2 py-2">{p.shortName}</td>
                  <td className="px-2 py-2">{p.playerId}</td>
                  <td className="px-2 py-2">{p.nationality}</td>
                  <td className="px-2 py-2">{p.battingStyle}</td>
                  <td className="px-2 py-2">{p.bowlingStyle}</td>
                  <td className="px-2 py-2">{p.bowlingType}</td>
                  <td className="px-2 py-2">{p.bowlingSpecialization}</td>
                  <td className="px-2 py-2">{p.playerRole}</td>
                  <td className="px-2 py-2">{p.team}</td>
                  <td className="px-2 py-2">{p.status}</td>
                  <td className="px-2 py-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-700 hover:underline mr-2 font-medium">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td colSpan={13} className="text-center py-4 text-gray-400">No players added.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayersPage;
