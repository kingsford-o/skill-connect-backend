// src/components/Messages.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../backend/supabaseClient";
import { UserAuth } from "../context/AuthContext";

const Messages = () => {
  const { session } = UserAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // Fetch all messages
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("id, content, sender_id, created_at")
      .order("created_at", { ascending: true });

    if (error) console.error(error);
    else setMessages(data);
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: session.user.id,
        content: newMsg,
      },
    ]);

    if (error) console.error(error);
    setNewMsg("");
  };

  // Realtime subscription
  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10 bg-green-600 text-white p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">💬 Realtime Chat</h1>
      <div className="space-y-2 max-h-80 overflow-y-auto border p-3 rounded bg-green-700">
        {messages.map((msg) => (
          <p
            key={msg.id}
            className={`p-2 rounded ${
              msg.sender_id === session?.user?.id
                ? "bg-white text-green-700 text-right"
                : "bg-green-800 text-left"
            }`}
          >
            {msg.content}
          </p>
        ))}
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded text-black"
        />
        <button
          type="submit"
          className="bg-white text-green-700 font-bold px-4 rounded hover:bg-gray-200"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Messages;
