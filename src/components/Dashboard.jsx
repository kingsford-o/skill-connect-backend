import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();
  const { session, signOut } = UserAuth();

const handleSignOut = async (e) => {
e.preventDefault();
try {
  await signOut();
  navigate("/");
} catch (err) {
  console.error(err)
  
}

}


  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {session?.user.email}</h2>
      <div>
        <p
        onClick = {handleSignOut}
        className = "hover:cursor-pointer border inline-block px-4 py-3 mt-4">
          Sign out
        </p>
        <Link to="/profile" className="text-green-600 hover:underline ml-100">
  Go to Profile
</Link>
      </div>
    </div>
  );
};

export default Dashboard;
