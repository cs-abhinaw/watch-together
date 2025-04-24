import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import "./LandingPage.css";

const LandingPage = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = uuidV4();
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
  <div className="logo">Watch Together</div>
  <ul className="nav-links">
     <li>
  <button style={{ backgroundColor: "transparent", border: "none", color: "white", cursor: "pointer" }} 
    className="create-btn" 
    >
    Home
  </button>
  <button style={{ backgroundColor: "transparent", border: "none", color: "white", cursor: "pointer" }} 
    className="create-btn" 
   >
   <a href="#foo">About Us</a> 
  </button>
  <button style={{ backgroundColor: "transparent", border: "none", color: "white", cursor: "pointer" }} 
    className="create-btn" 
    onClick={createRoom}>
    Create Room
  </button>
</li>

  </ul>
</nav>

{/* Create/Join Room Section */}
<div className="room-section">
  <h2>Start Watching Together</h2>
  <button className="create-btn" onClick={createRoom}>Create Room</button>
  <div className="join-room">
    <input
      type="text"
      placeholder="Enter Room ID"
      value={roomId}
      onChange={(e) => setRoomId(e.target.value)}
    />
    <button className="join-btn" onClick={joinRoom}>Join Room</button>
  </div>
</div>


      {/* Benefits Section */}
      <section className="benefits">
        <h2>Why Use Watch Together?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Seamless Streaming</h3>
            <p>Watch videos in sync with friends without lag.</p>
          </div>
          <div className="benefit-card">
            <h3>Easy to Use</h3>
            <p>Join a room and start watching instantly.</p>
          </div>
          <div className="benefit-card">
            <h3>Interactive Chat</h3>
            <p>Chat and react in real-time while watching.</p>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="reviews">
        <h2>What Our Users Say</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <p>"Amazing experience! Watching movies with friends has never been easier."</p>
            <h4>- Ajit </h4>
          </div>
          <div className="review-card">
            <p>"Smooth playback and great UI. Love this platform!"</p>
            <h4>- Singh</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="foo">
        <p>Made with Love by Abhinaw</p>
        <p>&copy; 2025 Watch Together All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
