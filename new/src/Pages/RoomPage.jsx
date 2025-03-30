import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import socket from "../socket/socket";

function RoomPage() {
  const { roomId } = useParams();
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const name = prompt("Enter your name:");
    if (!name) return;
    setUsername(name);
    socket.emit("join-room", { roomId, name });

    // Listen for updates
    socket.on("update-members", (members) => setMembers(members));
    socket.on("receive-message", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("change-video", (url) => setVideoUrl(url));  // Listen for video URL updates
    socket.on("play", () => setPlaying(true));
    socket.on("pause", () => setPlaying(false));

    return () => {
      socket.off("update-members");
      socket.off("receive-message");
      socket.off("change-video");
      socket.off("play");
      socket.off("pause");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send-message", { roomId, username, message });
    setMessage("");
  };

  const changeVideo = () => {
    if (!newUrl.trim()) return;
    socket.emit("change-video", { roomId, url: newUrl });
    setVideoUrl(newUrl);  // Update the video immediately on client side
    setNewUrl("");  // Clear input field
  };

  return (
    <div style={styles.container}>
      <h2>Room ID: {roomId}</h2>

      {/* Show Room Members */}
      <div style={styles.membersContainer}>
        <h3>Members in Room:</h3>
        <ul style={styles.membersList}>
          {members.map((member, index) => (
            <li key={index} style={styles.memberItem}>{member.username}</li>
          ))}
        </ul>
      </div>

      {/* Video Player */}
      {videoUrl && (
        <ReactPlayer
          url={videoUrl}
          playing={playing}
          controls
          style={{ margin: "10px auto" }}
          width="100%"   // Ensure it stretches to fit the container
          height="500px"  // Set a fixed height for the video
        />
      )}

      {/* Video Controls */}
      <div style={styles.buttonContainer}>
        <button onClick={() => socket.emit("play", roomId)} style={styles.playButton}>Play</button>
        <button onClick={() => socket.emit("pause", roomId)} style={styles.pauseButton}>Pause</button>
      </div>

      {/* Change Video Section */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter video URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          style={styles.inputField}
        />
        <button onClick={changeVideo} style={styles.changeVideoButton}>Change Video</button>
      </div>

      {/* Chat Section */}
      <div style={styles.chatContainer}>
        <h3>Chat</h3>
        <div style={styles.chatBox}>
          {messages.map((msg, index) => (
            <p key={index}><strong>{msg.username}:</strong> {msg.message}</p>
          ))}
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.inputField}
          />
          <button onClick={sendMessage} style={styles.sendButton}>Send</button>
        </div>
      </div>
    </div>
  );
}

// Inline Styles for Cleaner Code
const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#1e1e2f",
    color: "white",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  membersContainer: {
    backgroundColor: "#333",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  membersList: {
    listStyle: "none",
    padding: "0",
  },
  memberItem: {
    padding: "5px 0",
    fontSize: "16px",
  },
  buttonContainer: {
    marginTop: "10px",
  },
  playButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    marginRight: "10px",
  },
  pauseButton: {
    backgroundColor: "#FF5733",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  inputContainer: {
    marginTop: "15px",
  },
  inputField: {
    padding: "8px",
    width: "60%",
    borderRadius: "5px",
    border: "none",
    marginRight: "10px",
  },
  changeVideoButton: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "8px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  chatContainer: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#222",
    borderRadius: "8px",
  },
  chatBox: {
    height: "200px",
    overflowY: "auto",
    backgroundColor: "#333",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  sendButton: {
    backgroundColor: "#28A745",
    color: "white",
    padding: "8px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};

export default RoomPage;
