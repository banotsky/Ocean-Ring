import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Loader2, Package } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 technical-grid">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-black text-white">
            <Package size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter">Ocean Ring</h1>
            <p className="text-xs font-mono opacity-50 uppercase">Inventory & Sales Management</p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase mb-2 opacity-70">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="admin@oceanring.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase mb-2 opacity-70">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-mono">
              ERROR: {error.toUpperCase()}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isSignUp ? (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            ) : (
              <>
                <LogIn size={20} />
                Access Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-black/10 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-mono uppercase hover:underline opacity-50"
          >
            {isSignUp ? 'Back to Login' : 'Request New Operator Access'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
