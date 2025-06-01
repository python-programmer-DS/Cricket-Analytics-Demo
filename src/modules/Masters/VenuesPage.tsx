import React, { useEffect, useState } from "react";
import { db, type Venue } from "../../db/db";

const emptyVenue: Venue = {
  name: "",
  photo: "",
  country: "",
  state: "",
  city: "",
  capacity: 0,
  groundSize: "",
  homeTeam: "",
  // We'll store dimensions as a comma-separated string for MVP
};

const sectorNames = [
  "Straight", "Long On", "Mid Wicket", "Square Leg", "Fine Leg", "Third Man", "Point", "Covers", "Long Off"
];

const VenuePage: React.FC = () => {
  const [form, setForm] = useState<Venue>({ ...emptyVenue });
  const [venues, setVenues] = useState<Venue[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [sectorDims, setSectorDims] = useState<string[]>(Array(9).fill(""));

  useEffect(() => {
    db.venues.toArray().then(setVenues);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, photo: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSectorChange = (i: number, value: string) => {
    setSectorDims(sd => {
      const copy = [...sd];
      copy[i] = value;
      return copy;
    });
  };

  const clearForm = () => {
    setForm({ ...emptyVenue });
    setEditId(null);
    setSectorDims(Array(9).fill(""));
  };

  const saveVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    const groundSize = sectorDims.join(", ");
    if (editId) {
      await db.venues.update(editId, { ...form, groundSize });
    } else {
      await db.venues.add({ ...form, groundSize });
    }
    setVenues(await db.venues.toArray());
    clearForm();
  };

  const handleEdit = (v: Venue) => {
    setForm(v);
    setEditId(v.id ?? null);
    setSectorDims(v.groundSize ? v.groundSize.split(", ") : Array(9).fill(""));
  };

  const handleDelete = async (id?: number) => {
    if (id) {
      await db.venues.delete(id);
      setVenues(await db.venues.toArray());
      clearForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-12">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Venues</h2>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-50">
        <form onSubmit={saveVenue} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-sm">Venue Name*</label>
            <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" required />
          </div>
          <div>
            <label className="font-semibold text-sm">Country</label>
            <input name="country" value={form.country} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">State</label>
            <input name="state" value={form.state} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">Capacity</label>
            <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1" />
          </div>
          <div>
            <label className="font-semibold text-sm">Photo</label>
            <input type="file" accept="image/*" onChange={handlePhoto} className="block mt-1" />
            {form.photo && <img src={form.photo} alt="Venue" className="h-12 w-20 rounded mt-2" />}
          </div>
          <div className="col-span-2">
            <label className="font-semibold text-sm block mb-2">Ground Dimensions (meters in each direction):</label>
            <div className="flex flex-wrap gap-4 justify-center">
              {sectorNames.map((sector, i) => (
                <div key={sector} className="flex flex-col items-center">
                  <div className="text-xs text-gray-700">{sector}</div>
                  <input
                    type="number"
                    className="border p-1 rounded w-16 text-center"
                    value={sectorDims[i] || ""}
                    onChange={e => handleSectorChange(i, e.target.value)}
                    placeholder="m"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 flex gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-bold transition">{editId ? "Update" : "Save"}</button>
            <button type="button" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-bold transition" onClick={clearForm}>Clear</button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        <div className="font-bold text-lg mb-3 text-blue-800">All Venues</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-2 py-2">Photo</th>
                <th className="px-2 py-2">Venue</th>
                <th className="px-2 py-2">City</th>
                <th className="px-2 py-2">State</th>
                <th className="px-2 py-2">Country</th>
                <th className="px-2 py-2">Capacity</th>
                <th className="px-2 py-2">Dimensions</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((v) => (
                <tr key={v.id} className="border-b">
                  <td className="px-2 py-2">{v.photo && <img src={v.photo} alt="Venue" className="h-8 w-16 rounded object-cover" />}</td>
                  <td className="px-2 py-2">{v.name}</td>
                  <td className="px-2 py-2">{v.city}</td>
                  <td className="px-2 py-2">{v.state}</td>
                  <td className="px-2 py-2">{v.country}</td>
                  <td className="px-2 py-2">{v.capacity}</td>
                  <td className="px-2 py-2">{v.groundSize}</td>
                  <td className="px-2 py-2">
                    <button onClick={() => handleEdit(v)} className="text-blue-700 hover:underline mr-2 font-medium">Edit</button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {venues.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-400">No venues added.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VenuePage;
