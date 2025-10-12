import { createClient } from '@supabase/supabase-js';

// ✅ Always use import.meta.env for Vite projects
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
