// src/Router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Messages from "./components/Messages";
import Profile from "./components/Profile"; // ✅ You forgot this import

export const router = createBrowserRouter([
  { path: "/", element: <App /> },

  { path: "/signin", element: <Signin /> },
  { path: "/signup", element: <Signup /> },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },

  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },

  {
    path: "/messages",
    element: (
      <PrivateRoute>
        <Messages />
      </PrivateRoute>
    ),
  },
]);

