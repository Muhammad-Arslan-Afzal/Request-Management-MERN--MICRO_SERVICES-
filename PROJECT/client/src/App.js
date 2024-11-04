import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { authAPI } from "./api/api";
import "./App.css";
import LoginButton from "./components/LoginButton";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role")); // Load role from localStorage on init
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwtToken = urlParams.get("token");

    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);

      // Decode the token
      const decodedToken = jwtDecode(jwtToken);
      if (decodedToken.email && decodedToken.name && decodedToken.role) {
        setEmail(decodedToken.email);
        setName(decodedToken.name);
        setRole(decodedToken.role);
        localStorage.setItem("email", decodedToken.email);
        localStorage.setItem("name", decodedToken.name);
        localStorage.setItem("role", decodedToken.role);
      } else {
        console.warn(
          "Email, name, or role not found in decoded token:",
          decodedToken
        );
      }

      // Clear URL parameters for cleaner look
      window.history.replaceState({}, document.title, "/");

      // Redirect to the dashboard after setting the token
      navigate("/dashboard/request-list");
    } else {
      // Retrieve stored values if they exist
      const storedToken = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("email");
      const storedRole = localStorage.getItem("role");
      if (storedToken && storedEmail && storedRole) {
        setToken(storedToken);
        setEmail(storedEmail);
        setRole(storedRole);
      }
    }
  }, [navigate]);

  const handleLogout = async () => {
    await authAPI.post("/logout", { email, name });
    setToken(null);
    setEmail(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="App">
      <h1>Microservices App</h1>
      {!token ? (
        <LoginButton />
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <Routes>
            <Route
              path="/dashboard/*"
              element={
                <Dashboard
                  token={token}
                  requesterEmail={email}
                  userRole={role}
                />
              }
            />
            <Route
              path="/"
              element={<Navigate to="/dashboard/request-list" />}
            />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
