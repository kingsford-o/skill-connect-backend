import { supabase } from '../supabaseClient';

// Create
export const createProfile = async (profile) => {
  const { data, error } = await supabase.from('profiles').insert([profile]).select();
  if (error) throw error;
  return data[0];
};

// Read
export const getProfile = async (userId) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
  if (error) throw error;
  return data;
};

// Update
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase.from('profiles').update(updates).eq('user_id', userId).select();
  if (error) throw error;
  return data[0];
};

// Delete
export const deleteProfile = async (userId) => {
  const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
  if (error) throw error;
};
