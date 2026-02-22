import { useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";
import PasswordToggle from "../components/PasswordToggle.jsx";
import ExternalAuth from "../components/ExternalAuth.jsx";
import "../styles/index.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);

    // Redirect to home page after signup
    navigate("/home");
  };

  return (
    <div className="container">
      <h1>Community Hub Sign-Up</h1>

      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="username">
            Username <sup style={{ color: "red" }}>*</sup>
          </label>
          <input
            type="text"
            id="username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <sup style={{ color: "red" }}>*</sup>
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password <sup style={{ color: "red" }}>*</sup>
          </label>
          <PasswordToggle
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirm Password <sup style={{ color: "red" }}>*</sup>
          </label>
          <PasswordToggle
            id="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit">Create Account</button>
      </form>

      <div className="login-link" onClick={() => navigate("/login")}>
        Already have an account? Login
      </div>

      <ExternalAuth />
    </div>
  );
}
