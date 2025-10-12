import { supabase } from '../supabaseClient';

export const PAGE_SIZE = 20;

// Fetch newest messages (paginated)
export const fetchMessages = async (page = 0) => {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data.reverse(); // newest last
};

// Insert new message
export const sendMessage = async (senderId, senderEmail, content) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ sender_id: senderId, sender_email: senderEmail, content }])
    .select();
  if (error) throw error;
  return data[0];
};

// Realtime subscription
export const subscribeToMessages = (callback) => {
  const channel = supabase
    .channel('public:messages')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => callback(payload.new)
    )
    .subscribe();
  return channel;
};
