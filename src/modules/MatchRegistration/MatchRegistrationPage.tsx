import React, { useState, useEffect } from "react";
import { db, type Match, type Team, type Venue, type Player } from "../../db/db";

const matchTypes = [
  "Test", "ODI", "T20I", "100 Balls", "T20D", "First Class", "List A", "T10D", "Others"
];
const resultOptions = ["Win", "Tie", "No Result"];
const powerplayOptions = ["6 overs", "10 overs"]; // placeholder, can be made dynamic
const emptyMatch: Partial<Match> = {
  name: "",
  competition: "",
  matchType: "",
  date: "",
  venue: "",
  homeTeam: "",
  awayTeam: "",
  status: "",
  storageFolderName: "",
  // squads and playing11 in UI state only
};

const MatchRegistrationPage: React.FC = () => {
  // Data for lookups
  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  // UI State
  const [form, setForm] = useState<Partial<Match>>({ ...emptyMatch });
  const [neutralVenue, setNeutralVenue] = useState(false);
  const [homeSquad, setHomeSquad] = useState<string[]>([]);
  const [awaySquad, setAwaySquad] = useState<string[]>([]);
  const [homePlaying11, setHomePlaying11] = useState<string[]>([]);
  const [awayPlaying11, setAwayPlaying11] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [winningTeam, setWinningTeam] = useState("");
  const [manOfMatch, setManOfMatch] = useState("");
  const [powerplay, setPowerplay] = useState("");
  const [middleOvers, setMiddleOvers] = useState("");
  const [deathOvers, setDeathOvers] = useState("");
  const [videoLocation, setVideoLocation] = useState("");

  useEffect(() => {
    db.teams.toArray().then(setTeams);
    db.venues.toArray().then(setVenues);
    db.players.toArray().then(setPlayers);
  }, []);

  // Get all players for a team
  const getPlayersForTeam = (teamName: string) =>
    players.filter(p => p.team === teamName);

  // For "Man of the Match": Only players from either Playing 11
  const manOfMatchOptions = [
    ...homePlaying11.map(pid => players.find(p => p.id?.toString() === pid || p.name === pid)),
    ...awayPlaying11.map(pid => players.find(p => p.id?.toString() === pid || p.name === pid))
  ].filter(Boolean) as Player[];

  // Clear all fields
  const clearForm = () => {
    setForm({ ...emptyMatch });
    setNeutralVenue(false);
    setHomeSquad([]);
    setAwaySquad([]);
    setHomePlaying11([]);
    setAwayPlaying11([]);
    setResult("");
    setWinningTeam("");
    setManOfMatch("");
    setPowerplay("");
    setMiddleOvers("");
    setDeathOvers("");
    setVideoLocation("");
  };

  // Save match (no backend for now)
  const saveMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.homeTeam || !form.awayTeam || !form.date || !form.venue) {
      alert("Fill all mandatory fields.");
      return;
    }
    // Extra logic: Ensure at least 11 in Playing 11, but allow >11 for IPL style
    if (homePlaying11.length < 11 || awayPlaying11.length < 11) {
      alert("Select at least 11 for both Playing 11.");
      return;
    }
    await db.matches.add({
      ...form,
      neutralVenue,
      videoLocation,
      matchResult: result,
      winningTeam,
      manOfMatch,
      powerplay,
      middleOvers,
      deathOvers,
      homeSquad,
      awaySquad,
      homePlaying11,
      awayPlaying11,
    } as any); // Extend Match interface if you want type-safety
    clearForm();
    alert("Match saved!");
  };

  // All teams except the selected home team for away team select
  const availableAwayTeams = teams.filter(t => t.name !== form.homeTeam);

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-10">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Match Registration</h2>
      <form onSubmit={saveMatch} className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 border border-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT SIDE: Home Team */}
          <div>
            <label className="font-semibold text-sm">Home Team*</label>
            <select
              name="homeTeam"
              value={form.homeTeam || ""}
              onChange={e => {
                setForm(f => ({ ...f, homeTeam: e.target.value }));
                setHomeSquad([]);
                setHomePlaying11([]);
              }}
              className="border p-2 rounded-lg w-full mt-1"
              required
            >
              <option value="">Select</option>
              {teams.map(t => <option key={t.name}>{t.name}</option>)}
            </select>
            <label className="font-semibold text-sm mt-4 block">Home Team Squad</label>
            <select
              multiple
              value={homeSquad}
              onChange={e => setHomeSquad(Array.from(e.target.selectedOptions, o => o.value))}
              className="border p-2 rounded-lg w-full h-32 mt-1"
            >
              {getPlayersForTeam(form.homeTeam || "").map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
            <label className="font-semibold text-sm mt-4 block">Home Playing 11 (+ Impact)</label>
            <select
              multiple
              value={homePlaying11}
              onChange={e => setHomePlaying11(Array.from(e.target.selectedOptions, o => o.value))}
              className="border p-2 rounded-lg w-full h-32 mt-1"
            >
              {homeSquad.map(pid => (
                <option key={pid} value={pid}>{pid}</option>
              ))}
            </select>
          </div>

          {/* RIGHT SIDE: Away Team */}
          <div>
            <label className="font-semibold text-sm">Away Team*</label>
            <select
              name="awayTeam"
              value={form.awayTeam || ""}
              onChange={e => {
                setForm(f => ({ ...f, awayTeam: e.target.value }));
                setAwaySquad([]);
                setAwayPlaying11([]);
              }}
              className="border p-2 rounded-lg w-full mt-1"
              required
            >
              <option value="">Select</option>
              {availableAwayTeams.map(t => <option key={t.name}>{t.name}</option>)}
            </select>
            <label className="font-semibold text-sm mt-4 block">Away Team Squad</label>
            <select
              multiple
              value={awaySquad}
              onChange={e => setAwaySquad(Array.from(e.target.selectedOptions, o => o.value))}
              className="border p-2 rounded-lg w-full h-32 mt-1"
            >
              {getPlayersForTeam(form.awayTeam || "").map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
            <label className="font-semibold text-sm mt-4 block">Away Playing 11 (+ Impact)</label>
            <select
              multiple
              value={awayPlaying11}
              onChange={e => setAwayPlaying11(Array.from(e.target.selectedOptions, o => o.value))}
              className="border p-2 rounded-lg w-full h-32 mt-1"
            >
              {awaySquad.map(pid => (
                <option key={pid} value={pid}>{pid}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Other fields below the squads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            <label className="font-semibold text-sm">Match Name*</label>
            <input name="name" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="border p-2 rounded-lg w-full mt-1" required />
            <label className="font-semibold text-sm mt-4 block">Match Type*</label>
            <select name="matchType" value={form.matchType || ""} onChange={e => setForm(f => ({ ...f, matchType: e.target.value }))} className="border p-2 rounded-lg w-full mt-1" required>
              <option value="">Select</option>
              {matchTypes.map(m => <option key={m}>{m}</option>)}
            </select>
            <label className="font-semibold text-sm mt-4 block">Venue*</label>
            <select name="venue" value={form.venue || ""} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} className="border p-2 rounded-lg w-full mt-1" required>
              <option value="">Select</option>
              {venues.map(v => <option key={v.name}>{v.name}</option>)}
            </select>
            <label className="font-semibold text-sm mt-4 block">Date*</label>
            <input type="date" name="date" value={form.date || ""} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="border p-2 rounded-lg w-full mt-1" required />
            <label className="font-semibold text-sm mt-4 block">Video Location</label>
            <input name="videoLocation" value={videoLocation} onChange={e => setVideoLocation(e.target.value)} className="border p-2 rounded-lg w-full mt-1" />
            <div className="flex items-center mt-4">
              <input type="checkbox" checked={neutralVenue} onChange={() => setNeutralVenue(n => !n)} className="mr-2" />
              <label className="font-semibold text-sm">Neutral Venue?</label>
            </div>
          </div>
          <div>
            <label className="font-semibold text-sm">Match Result*</label>
            <select value={result} onChange={e => setResult(e.target.value)} className="border p-2 rounded-lg w-full mt-1" required>
              <option value="">Select</option>
              {resultOptions.map(r => <option key={r}>{r}</option>)}
            </select>
            {result === "Win" && (
              <>
                <label className="font-semibold text-sm mt-4 block">Winning Team</label>
                <select value={winningTeam} onChange={e => setWinningTeam(e.target.value)} className="border p-2 rounded-lg w-full mt-1">
                  <option value="">Select</option>
                  {[form.homeTeam, form.awayTeam].filter(Boolean).map(t => <option key={t}>{t}</option>)}
                </select>
              </>
            )}
            <label className="font-semibold text-sm mt-4 block">Man of the Match</label>
            <select value={manOfMatch} onChange={e => setManOfMatch(e.target.value)} className="border p-2 rounded-lg w-full mt-1">
              <option value="">Select</option>
              {manOfMatchOptions.map(p => (
                <option key={p?.id} value={p?.name}>{p?.name}</option>
              ))}
            </select>
            <label className="font-semibold text-sm mt-4 block">Powerplay Overs</label>
            <input name="powerplay" value={powerplay} onChange={e => setPowerplay(e.target.value)} className="border p-2 rounded-lg w-full mt-1" />
            <label className="font-semibold text-sm mt-4 block">Middle Overs</label>
            <input name="middleOvers" value={middleOvers} onChange={e => setMiddleOvers(e.target.value)} className="border p-2 rounded-lg w-full mt-1" />
            <label className="font-semibold text-sm mt-4 block">Death Overs</label>
            <input name="deathOvers" value={deathOvers} onChange={e => setDeathOvers(e.target.value)} className="border p-2 rounded-lg w-full mt-1" />
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-800">Save</button>
          <button type="button" className="bg-gray-200 text-gray-800 px-8 py-2 rounded-lg font-bold hover:bg-gray-300" onClick={clearForm}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default MatchRegistrationPage;
