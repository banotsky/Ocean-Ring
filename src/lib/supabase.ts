import { createClient } from '@supabase/supabase-js';

// Using the credentials provided by the user as fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ofxlxptumhbwphhwxmwp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9meGx4cHR1bWhid3BoaHd4bXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTM3NDgsImV4cCI6MjA4OTkyOTc0OH0.pFBSzTCEk0RLBIg-JnGwT2LUdZzhBkVJsj85xy7pAO4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'stockmaster-auth-token',
  },
});
