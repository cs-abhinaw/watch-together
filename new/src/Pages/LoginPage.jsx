import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Benefits from "../components/Benefits";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Both fields are required!");
      return;
    }

    console.log("Logging in with:", { email, password });
    setError(""); // Clear error on successful submission

    // TODO: Add API call for authentication
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <h1>Login to Your Account</h1>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
      <Benefits />
      <Reviews />
      <Footer />
    </div>
  );
};

export default LoginPage;
