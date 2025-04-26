import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
  const [copied, setCopied] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState(0);
  const [isLeader, setIsLeader] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const playerRef = useRef(null);
  const chatBoxRef = useRef(null);
  const syncThreshold = useRef(2.0); // Reduced threshold for tighter sync
  const hasJoined = useRef(false);

  useEffect(() => {
    if (!hasJoined.current) {
      const name = prompt("Enter your name:");
      if (name) {
        setUsername(name);
        socket.emit("join-room", { roomId, name });
        hasJoined.current = true;
      }
    }

    const handleUpdateMembers = (members) => setMembers(members);
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (chatBoxRef.current) {
        setTimeout(() => {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }, 100);
      }
    };
    const handleChangeVideo = (url) => {
      console.log(`[CLIENT] Video changed to: ${url}`);
      setVideoUrl(url);
      setLastSyncedTime(0);
      setPlaying(false); // Ensure video starts from beginning
    };
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleSyncTime = (time) => {
      console.log(`[CLIENT] Sync time received: ${time}`);
      if (time === 0 && lastSyncedTime > 10 && videoUrl) {
        console.log(`[CLIENT] Ignoring sync-time: 0 (lastSyncedTime: ${lastSyncedTime})`);
        return;
      }
      setLastSyncedTime(time);
      const player = playerRef.current;
      if (player && !isSeeking) {
        const current = player.getCurrentTime();
        console.log(`[CLIENT] Current time: ${current}, Sync time: ${time}, Diff: ${Math.abs(current - time)}`);
        if (Math.abs(current - time) > syncThreshold.current) {
          setIsSeeking(true);
          player.seekTo(time, "seconds");
          setTimeout(() => setIsSeeking(false), 500);
        }
      }
    };
    const handleRequestCurrentTime = ({ roomId }) => {
      const player = playerRef.current;
      if (player) {
        const currentTime = player.getCurrentTime();
        console.log(`[CLIENT] Responding with current time: ${currentTime}`);
        socket.emit("respond-current-time", { roomId, currentTime });
      }
    };
    const handleAssignedLeader = () => {
      console.log("[CLIENT] You are now the leader");
      setIsLeader(true);
    };
    const handleRequestSync = ({ roomId }) => {
      if (isLeader) {
        const player = playerRef.current;
        if (player) {
          const currentTime = player.getCurrentTime();
          console.log(`[CLIENT] Sync requested, sending time: ${currentTime}`);
          socket.emit("time-update", { roomId, currentTime });
        }
      }
    };

    socket.on("update-members", handleUpdateMembers);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("change-video", handleChangeVideo);
    socket.on("play", handlePlay);
    socket.on("pause", handlePause);
    socket.on("sync-time", handleSyncTime);
    socket.on("request-current-time", handleRequestCurrentTime);
    socket.on("assigned-leader", handleAssignedLeader);
    socket.on("request-sync", handleRequestSync);

    return () => {
      socket.off("update-members", handleUpdateMembers);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("change-video", handleChangeVideo);
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.off("sync-time", handleSyncTime);
      socket.off("request-current-time", handleRequestCurrentTime);
      socket.off("assigned-leader", handleAssignedLeader);
      socket.off("request-sync", handleRequestSync);
    };
  }, [roomId]);

  useEffect(() => {
    if (!isLeader) return;

    const interval = setInterval(() => {
      const player = playerRef.current;
      if (player && playing && !isSeeking) {
        const currentTime = player.getCurrentTime();
        if (currentTime > 0) {
          console.log(`[CLIENT] Leader sending time update: ${currentTime}`);
          socket.emit("time-update", { roomId, currentTime });
          setLastSyncedTime(currentTime);
        }
      }
    }, 5000); // Reduced to 5 seconds for more frequent updates

    return () => clearInterval(interval);
  }, [roomId, playing, isLeader, isSeeking]);

  const sendMessage = (e) => {
    e?.preventDefault();
    if (!message.trim()) return;
    socket.emit("send-message", { roomId, username, message });
    setMessage("");
  };

  const changeVideo = () => {
    if (!newUrl.trim()) return;
    socket.emit("change-video", { roomId, url: newUrl });
    setVideoUrl(newUrl);
    setNewUrl("");
    setLastSyncedTime(0); // Reset sync time when changing video
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProgress = (state) => {
    if (isSeeking || !videoUrl) return;
    if (!isLeader) {
      const diff = Math.abs(state.playedSeconds - lastSyncedTime);
      console.log(`[CLIENT] Progress check: played=${state.playedSeconds}, lastSyncedTime=${lastSyncedTime}, diff=${diff}`);
      if (diff > syncThreshold.current && lastSyncedTime > 0) {
        console.log(`[CLIENT] Progress diff detected, seeking to: ${lastSyncedTime}`);
        const player = playerRef.current;
        if (player) {
          setIsSeeking(true);
          player.seekTo(lastSyncedTime, "seconds");
          setTimeout(() => setIsSeeking(false), 500);
        }
      }
    }
  };

  const handleSeek = (seconds) => {
    if (!isSeeking) {
      console.log(`[CLIENT] Manual seek to: ${seconds}`);
      setIsSeeking(true);
      socket.emit("seek", { roomId, time: seconds });
      setTimeout(() => {
        setIsSeeking(false);
        setLastSyncedTime(seconds);
      }, 500);
    }
  };

  const handleEnded = () => {
    console.log("[CLIENT] Video ended");
    setPlaying(false);
    socket.emit("pause", roomId);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Watch Together</h1>
        <div style={styles.roomInfo}>
          <span style={styles.roomIdLabel}>Room:</span>
          <span style={styles.roomIdValue}>{roomId}</span>
          <button onClick={copyToClipboard} style={styles.copyButton}>
            {copied ? "✓" : "📋"}
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.videoSection}>
          {videoUrl ? (
            <div style={styles.playerWrapper}>
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={playing}
                controls={true}
                onProgress={handleProgress}
                onPause={() => {
                  if (!isSeeking) socket.emit("pause", roomId);
                  setPlaying(false);
                }}
                onPlay={() => {
                  if (!isSeeking) socket.emit("play", roomId);
                  setPlaying(true);
                }}
                onSeek={handleSeek}
                onEnded={handleEnded}
                width="100%"
                height="100%"
                style={styles.reactPlayer}
                config={{
                  youtube: {
                    playerVars: {
                      controls: 1,
                      modestbranding: 1,
                      loop: 0,
                      rel: 0,
                    },
                  },
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                      loop: false,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div style={styles.noVideoPlaceholder}>
              <div style={styles.noVideoMessage}>
                <p>Enter a video URL below</p>
              </div>
            </div>
          )}

          <div style={styles.videoControls}>
            <button
              onClick={() => socket.emit("play", roomId)}
              style={{
                ...styles.controlButton,
                ...(playing ? styles.activeButton : {}),
              }}
            >
              ▶
            </button>
            <button
              onClick={() => socket.emit("pause", roomId)}
              style={{
                ...styles.controlButton,
                ...(!playing ? styles.activeButton : {}),
              }}
            >
              ⏸
            </button>
            <div style={styles.videoUrlInput}>
              <input
                type="text"
                placeholder="Enter video URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                style={styles.inputField}
              />
              <button onClick={changeVideo} style={styles.changeVideoButton}>
                Load
              </button>
            </div>
          </div>
          {isLeader && (
            <div style={styles.syncControls}>
              <button
                onClick={() => {
                  const player = playerRef.current;
                  if (player) {
                    const currentTime = player.getCurrentTime();
                    socket.emit("time-update", { roomId, currentTime });
                    setLastSyncedTime(currentTime);
                  }
                }}
                style={styles.syncButton}
              >
                Force Sync Others
              </button>
            </div>
          )}
          {!isLeader && (
            <div style={styles.syncControls}>
              <button
                onClick={() => {
                  socket.emit("request-sync", { roomId });
                }}
                style={styles.syncButton}
              >
                Sync with Leader
              </button>
            </div>
          )}
        </div>

        <div style={styles.sidePanel}>
          <div style={styles.membersContainer}>
            <h3 style={styles.sectionTitle}>
              Members ({members.length}){" "}
              {isLeader && (
                <span style={styles.leaderBadge}>You are the leader</span>
              )}
            </h3>
            <ul style={styles.membersList}>
              {members.map((member, index) => (
                <li key={index} style={styles.memberItem}>
                  <span style={styles.memberIcon}>●</span>
                  <span style={styles.memberName}>
                    {member.username}{" "}
                    {member.id === socket.id && "(You)"}
                    {member.isLeader && " (Leader)"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.chatContainer}>
            <h3 style={styles.sectionTitle}>Chat</h3>
            <div style={styles.chatBox} ref={chatBoxRef}>
              {messages.length === 0 ? (
                <div style={styles.emptyChatMessage}>
                  note: play and pause pause is under development.  <br></br>
                        start your chatting                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.chatMessage,
                      ...(msg.username === username ? styles.ownMessage : {}),
                    }}
                  >
                    <span style={styles.messageSender}>{msg.username}: </span>
                    <span>{msg.message}</span>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={sendMessage} style={styles.chatInputForm}>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={styles.chatInputField}
              />
              <button type="submit" style={styles.sendButton}>
                →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "10px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    color: "#333",
  },
  header: {
    marginBottom: "10px",
    padding: "10px 15px",
    backgroundColor: "#6200ea",
    borderRadius: "6px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(98, 0, 234, 0.3)",
  },
  title: {
    margin: "0",
    fontSize: "22px",
    fontWeight: "600",
  },
  roomInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  roomIdLabel: {
    fontWeight: "bold",
    fontSize: "14px",
  },
  roomIdValue: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "3px 8px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "14px",
  },
  mainContent: {
    display: "flex",
    gap: "10px",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  videoSection: {
    flex: "1 1 600px",
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "0 1px 6px rgba(0, 0, 0, 0.05)",
  },
  playerWrapper: {
    position: "relative",
    paddingTop: "56.25%",
    backgroundColor: "#000",
  },
  reactPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  videoControls: {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #eaeaea",
  },
  syncControls: {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #eaeaea",
  },
  syncButton: {
    padding: "6px 12px",
    backgroundColor: "#651fff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  },
  controlButton: {
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#e0e0e0",
    color: "#424242",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "all 0.2s ease",
    minWidth: "36px",
  },
  activeButton: {
    backgroundColor: "#00c853",
    color: "white",
  },
  videoUrlInput: {
    flex: 1,
    display: "flex",
    gap: "8px",
  },
  sidePanel: {
    flex: "1 1 300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "350px",
  },
  membersContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "0 1px 6px rgba(0, 0, 0, 0.05)",
  },
  sectionTitle: {
    margin: "0",
    padding: "10px 15px",
    backgroundColor: "#651fff",
    color: "white",
    fontSize: "16px",
    fontWeight: "500",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaderBadge: {
    fontSize: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "2px 6px",
    borderRadius: "10px",
  },
  membersList: {
    listStyleType: "none",
    margin: "0",
    padding: "5px 10px",
    maxHeight: "120px",
    overflowY: "auto",
  },
  memberItem: {
    padding: "5px",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #f1f1f1",
    fontSize: "14px",
  },
  memberIcon: {
    marginRight: "6px",
    color: "#00c853",
    fontSize: "10px",
  },
  memberName: {
    fontWeight: "500",
  },
  chatContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "0 1px 6px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    flex: "1",
  },
  chatBox: {
    padding: "10px",
    overflowY: "auto",
    flex: "1",
    height: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  chatMessage: {
    padding: "6px 10px",
    backgroundColor: "#f1f1f1",
    borderRadius: "15px",
    fontSize: "14px",
    maxWidth: "85%",
    alignSelf: "flex-start",
  },
  ownMessage: {
    backgroundColor: "#d0f0fd",
    alignSelf: "flex-end",
    borderBottomRightRadius: "4px",
  },
  messageSender: {
    fontWeight: "bold",
    fontSize: "13px",
  },
  emptyChatMessage: {
    textAlign: "center",
    color: "#a0aec0",
    padding: "20px",
    fontStyle: "italic",
    fontSize: "14px",
  },
  chatInputForm: {
    padding: "8px 10px",
    display: "flex",
    gap: "8px",
    borderTop: "1px solid #eaeaea",
  },
  inputField: {
    flex: "1",
    padding: "6px 10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  chatInputField: {
    flex: "1",
    padding: "8px 12px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  changeVideoButton: {
    padding: "6px 12px",
    backgroundColor: "#ff3d00",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  },
  sendButton: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2979ff",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
    transition: "background-color 0.2s ease",
  },
  copyButton: {
    padding: "3px 8px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    color: "white",
    transition: "background-color 0.2s ease",
  },
  noVideoPlaceholder: {
    height: "240px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  noVideoMessage: {
    textAlign: "center",
    color: "#909090",
    fontSize: "14px",
  },
};

export default RoomPage;
