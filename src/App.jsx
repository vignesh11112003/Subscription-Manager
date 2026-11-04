
import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import {
  loginUser,
  signupUser,
  getCurrentUser,
  logoutUser,
} from "./utils/auth";

import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [authError, setAuthError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const handleLogin = async (credentials) => {
    try {
      setAuthError("");

      const user = await loginUser(credentials);

      setCurrentUser(user);
      navigate("/", { replace: true });
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const handleSignup = async (userData) => {
    try {
      setAuthError("");

      const user = await signupUser(userData);

      setCurrentUser(user);
      navigate("/", { replace: true });
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setAuthError("");

    navigate("/login", { replace: true });
  };

  return (
    <div className="app">
      {!isAuthPage && currentUser && (
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      <main className={isAuthPage ? "" : "main-content"}>
        <Routes>
          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <Login
                  onLogin={handleLogin}
                  authError={authError}
                />
              )
            }
          />

          <Route
            path="/signup"
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <Signup
                  onSignup={handleSignup}
                  authError={authError}
                />
              )
            }
          />

          <Route
            path="/"
            element={
              currentUser ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/subscriptions"
            element={
              currentUser ? (
                <Subscriptions />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/analytics"
            element={
              currentUser ? (
                <Analytics />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to={currentUser ? "/" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
