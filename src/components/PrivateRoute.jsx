// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { session } = UserAuth();

  // if AuthContext hasn’t finished loading
  if (session === undefined) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Checking session...
      </div>
    );
  }

  // if user not logged in
  if (!session) {
    return <Navigate to="/signup" replace />;
  }

  // otherwise render the private page
  return children;
};

export default PrivateRoute;

