import React, { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';

export const CreateUserTab: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create user');
      
      setSuccess(true);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl luxury-border shadow-xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
          <UserPlus className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 font-serif">Create New User</h2>
          <p className="text-slate-500">Add a new team member to the system.</p>
        </div>
      </div>

      <form onSubmit={handleCreateUser} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            required
          />
        </div>
        {error && <p className="text-rose-600 font-bold">{error}</p>}
        {success && <p className="text-emerald-600 font-bold">User created successfully!</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all text-lg flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UserPlus className="w-6 h-6" />}
          Create User
        </button>
      </form>
    </div>
  );
};
