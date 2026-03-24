import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E4E3E0]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-black" size={48} />
          <p className="font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Ocean Ring...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!session ? <Login /> : <Dashboard />}
    </>
  );
}
