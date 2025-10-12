import { createClient } from '@supabase/supabase-js';

// ✅ Always use import.meta.env for Vite projects
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// ✅ Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
