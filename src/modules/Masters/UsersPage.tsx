import React, { useEffect, useState } from "react";
import { db, type User } from "../../db/db";

const roles = ["Admin", "Analyst", "Scorer", "Coach", "Other"];

const emptyForm: User = {
  name: "",
  role: "Admin",
  machineId: "",
  licenseUpto: "",
  loginId: "",
  password: "",
  photo: "",
};

const UsersPage: React.FC = () => {
  const [form, setForm] = useState<User>({ ...emptyForm });
  const [users, setUsers] = useState<User[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  // Seed Admin user if DB is empty
  useEffect(() => {
    db.users.count().then(count => {
      if (count === 0) {
        db.users.add({
          name: "Admin User",
          role: "Admin",
          machineId: "local",
          licenseUpto: "2099-12-31",
          loginId: "admin",
          password: "admin",
          photo: "",
        }).then(() => db.users.toArray().then(setUsers));
      } else {
        db.users.toArray().then(setUsers);
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, photo: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const clearForm = () => {
    setForm({ ...emptyForm });
    setEditId(null);
  };

  const saveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.machineId || !form.licenseUpto || !form.loginId || !form.password) {
      alert("All fields are mandatory.");
      return;
    }
    if (editId) {
      await db.users.update(editId, { ...form });
    } else {
      await db.users.add({ ...form });
    }
    db.users.toArray().then(setUsers);
    clearForm();
  };

  const handleEdit = (user: User) => {
    setForm(user);
    setEditId(user.id ?? null);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await db.users.delete(id);
    db.users.toArray().then(setUsers);
    if (editId === id) clearForm();
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center py-12">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">User Management</h2>
      <div className="w-full max-w-2xl flex flex-col bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-50">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col items-center w-full md:w-1/3">
            <label htmlFor="user-photo" className="block cursor-pointer">
              {form.photo ? (
                <img src={form.photo} alt="User" className="h-24 w-24 rounded-full object-cover border-2 border-blue-200 shadow mb-3" />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-3 border-2 border-blue-200 shadow">
                  <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M5.121 17.804A9.004 9.004 0 0112 15c2.137 0 4.113.747 5.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
            </label>
            <input id="user-photo" type="file" accept="image/*" onChange={handleImg} className="hidden" />
            <div className="text-xs text-gray-400 mt-1">Upload user photo</div>
          </div>
          <form onSubmit={saveUser} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <label className="font-semibold text-sm">Display Name*</label>
              <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="font-semibold text-sm">User Role*</label>
              <select name="role" value={form.role} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300">
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold text-sm">Machine ID*</label>
              <input name="machineId" value={form.machineId} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="font-semibold text-sm">License Upto*</label>
              <input type="date" name="licenseUpto" value={form.licenseUpto} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="font-semibold text-sm">Login ID*</label>
              <input name="loginId" value={form.loginId} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="font-semibold text-sm">Password*</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="border p-2 rounded-lg w-full mt-1 focus:ring-2 focus:ring-blue-300" />
            </div>
            <div className="col-span-2 flex gap-4 mt-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition font-bold">Save</button>
              <button type="button" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-bold" onClick={clearForm}>Clear</button>
            </div>
          </form>
        </div>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        <div className="font-bold text-lg mb-3 text-blue-800">All Users</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Machine ID</th>
                <th className="px-2 py-2">License Upto</th>
                <th className="px-2 py-2">Login ID</th>
                <th className="px-2 py-2">Photo</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b">
                  <td className="px-2 py-2">{u.name}</td>
                  <td className="px-2 py-2">{u.role}</td>
                  <td className="px-2 py-2">{u.machineId}</td>
                  <td className="px-2 py-2">{u.licenseUpto}</td>
                  <td className="px-2 py-2">{u.loginId}</td>
                  <td className="px-2 py-2">
                    {u.photo ? (
                      <img src={u.photo} alt="User" className="h-8 w-8 rounded-full object-cover mx-auto" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M5.121 17.804A9.004 9.004 0 0112 15c2.137 0 4.113.747 5.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <button onClick={() => handleEdit(u)} className="text-blue-700 hover:underline mr-2 font-medium">Edit</button>
                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-400">No users added.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
