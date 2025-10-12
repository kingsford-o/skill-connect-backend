// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../../backend/supabaseClient";

const Profile = () => {
  const { session } = UserAuth();
  const [profile, setProfile] = useState({
    name: "",
    skills: "",
    bio: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load user profile on mount
  useEffect(() => {
    if (session?.user) fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error(error);
      setMessage("Error loading profile.");
    } else if (data) {
      setProfile(data);
    }

    setLoading(false);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updates = {
      id: session.user.id,
      email: session.user.email,
      ...profile,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      console.error(error);
      setMessage("Error saving profile.");
    } else {
      setMessage("Profile saved successfully!");
    }

    setLoading(false);
  };

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-green-600 text-white rounded-xl">
      <h1 className="mb-4 text-s">
        Welcome, {session.user.email}
      </h1>

      <form onSubmit={saveProfile} className="flex flex-col gap-3">
        <input
          className="p-3 rounded text-black"
          type="text"
          placeholder="Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
        <input
          className="p-3 rounded text-black"
          type="text"
          placeholder="Skills"
          value={profile.skills}
          onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
        />
        <textarea
          className="p-3 rounded text-black"
          placeholder="Bio"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
        <input
          className="p-3 rounded text-black"
          type="text"
          placeholder="Location"
          value={profile.location}
          onChange={(e) =>
            setProfile({ ...profile, location: e.target.value })
          }
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-white text-green-700 font-semibold p-3 rounded hover:bg-gray-200"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
        {message && <p className="text-center mt-3">{message}</p>}
      </form>
    </div>
  );
};

export default Profile;

