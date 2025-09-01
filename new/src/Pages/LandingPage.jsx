import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function LandingPage() {
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
    <div style={styles.landingPage}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <span style={styles.logoText}>Watch Together</span>
        </div>
        <ul style={styles.navLinks}>
          <li style={styles.navItem}>
            <button style={styles.navButton}>Home</button>
          </li>
          <li style={styles.navItem}>
            <a href="#about" style={styles.navLink}>About Us</a>
          </li>
          <li style={styles.navItem}>
            <button 
              style={styles.createRoomButton}
              onClick={createRoom}
            >
              Create Room
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Experience Videos Together</h1>
          <p style={styles.heroSubtitle}>
            Watch movies, shows, and videos in perfect sync with friends and family no matter where they are
          </p>
          
          <div style={styles.roomOptions}>
            <button style={styles.primaryButton} onClick={createRoom}>
              Create a Room
            </button>
            <div style={styles.divider}>or</div>
            <div style={styles.joinRoomContainer}>
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                style={styles.roomInput}
              />
              <button style={styles.joinButton} onClick={joinRoom}>
                Join Room
              </button>
            </div>
          </div>
        </div>
        <div style={styles.heroImageContainer}>
          <div style={styles.heroImage}></div>
        </div>
      </div>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Choose Watch Together?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIconContainer}>
              <div style={styles.featureIcon}>🔄</div>
            </div>
            <h3 style={styles.featureTitle}>Perfect Synchronization</h3>
            <p style={styles.featureDescription}>
              Our advanced syncing technology ensures everyone watches at exactly the same moment
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIconContainer}>
              <div style={styles.featureIcon}>💬</div>
            </div>
            <h3 style={styles.featureTitle}>Real-time Chat</h3>
            <p style={styles.featureDescription}>
              Share reactions and thoughts instantly with our integrated chat system
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIconContainer}>
              <div style={styles.featureIcon}>🚀</div>
            </div>
            <h3 style={styles.featureTitle}>One-Click Setup</h3>
            <p style={styles.featureDescription}>
              Create a room and start watching in seconds - no downloads or sign-ups required
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={styles.testimonialsSection}>
        <h2 style={styles.sectionTitle}>What Our Users Say</h2>
        <div style={styles.testimonialsGrid}>
          <div style={styles.testimonialCard}>
            <div style={styles.quoteIcon}>"</div>
            <p style={styles.testimonialText}>
              Watch Together has transformed our long-distance movie nights. The sync is flawless and the chat makes it feel like we're all in the same room!
            </p>
            <div style={styles.testimonialAuthor}>
              <div style={styles.authorAvatar}></div>
              <div>
                <h4 style={styles.authorName}>Abhi Singh</h4>
                <p style={styles.authorInfo}>Film Enthusiast</p>
              </div>
            </div>
          </div>
          <div style={styles.testimonialCard}>
            <div style={styles.quoteIcon}>"</div>
            <p style={styles.testimonialText}>
              The user interface is so intuitive, and I love how smooth the video playback is. This is now our go-to platform for watching content with friends across the globe.
            </p>
            <div style={styles.testimonialAuthor}>
              <div style={styles.authorAvatar}></div>
              <div>
                <h4 style={styles.authorName}>Mina Patel</h4>
                <p style={styles.authorInfo}>Tech Blogger</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorksSection}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <h3 style={styles.stepTitle}>Create or Join a Room</h3>
            <p style={styles.stepDescription}>
              Generate a unique room or enter an existing room ID
            </p>
          </div>
          <div style={styles.stepDivider}></div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <h3 style={styles.stepTitle}>Share with Friends</h3>
            <p style={styles.stepDescription}>
              Send the room ID to anyone you want to watch with
            </p>
          </div>
          <div style={styles.stepDivider}></div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <h3 style={styles.stepTitle}>Enter Video URL</h3>
            <p style={styles.stepDescription}>
              Paste any supported video link and enjoy together
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Watch Together?</h2>
          <p style={styles.ctaDescription}>
            Create a room now and invite your friends and family to join you
          </p>
          <button style={styles.ctaButton} onClick={createRoom}>
            Create a Room
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer} id="about">
        <div style={styles.footerContent}>
          <div style={styles.footerBranding}>
            <div style={styles.footerLogo}>Watch Together</div>
            <p style={styles.footerTagline}>
              Bringing people together through shared experiences
            </p>
          </div>
          <div style={styles.footerLinks}>
            <div style={styles.footerLinkColumn}>
              <h4 style={styles.footerLinkTitle}>Support</h4>
              <a href="#" style={styles.footerLink}>Help Center</a>
              <a href="#" style={styles.footerLink}>Contact Us</a>
              <a href="#" style={styles.footerLink}>FAQ</a>
            </div>
            <div style={styles.footerLinkColumn}>
              <h4 style={styles.footerLinkTitle}>Legal</h4>
              <a href="#" style={styles.footerLink}>Terms of Service</a>
              <a href="#" style={styles.footerLink}>Privacy Policy</a>
              <a href="#" style={styles.footerLink}>Cookie Policy</a>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.copyright}>Made with ❤️ by Abhinaw</p>
          <p style={styles.copyright}>&copy; 2025 Watch Together. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  landingPage: {
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, sans-serif",
    color: "#333",
    margin: 0,
    padding: 0,
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 5%",
    backgroundColor: "#6200ea",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  logoText: {
    fontSize: "1.5rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    gap: "1.5rem",
    alignItems: "center",
  },
  navItem: {
    display: "inline-block",
  },
  navButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
    transition: "background-color 0.2s ease",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
    transition: "background-color 0.2s ease",
  },
  createRoomButton: {
    backgroundColor: "#7c4dff",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 5px rgba(98, 0, 234, 0.2)",
  },
  heroSection: {
    display: "flex",
    padding: "4rem 5%",
    backgroundColor: "#6200ea",
    color: "white",
    minHeight: "60vh",
    position: "relative",
    overflow: "hidden",
  },
  heroContent: {
    flex: "1",
    maxWidth: "650px",
    zIndex: 1,
  },
  heroTitle: {
    fontSize: "3.5rem",
    margin: "0 0 1rem",
    fontWeight: "800",
    lineHeight: "1.2",
    background: "linear-gradient(45deg, #ffffff, #d0bcff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "1.25rem",
    margin: "0 0 2.5rem",
    lineHeight: "1.6",
    opacity: "0.9",
    maxWidth: "550px",
  },
  heroImageContainer: {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    maxWidth: "450px",
    height: "300px",
    background: "linear-gradient(135deg, #7c4dff, #b388ff)",
    borderRadius: "12px",
    boxShadow: "0 20px 40px rgba(98, 0, 234, 0.3)",
    position: "relative",
    overflow: "hidden",
  },
  roomOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    maxWidth: "500px",
  },
  primaryButton: {
    backgroundColor: "#ff3d00",
    color: "white",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: "6px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px rgba(255, 61, 0, 0.3)",
    width: "100%",
  },
  divider: {
    textAlign: "center",
    position: "relative",
    margin: "0.5rem 0",
    fontSize: "0.9rem",
    opacity: "0.8",
  },
  joinRoomContainer: {
    display: "flex",
    width: "100%",
    gap: "0.5rem",
  },
  roomInput: {
    flex: "1",
    padding: "0.75rem 1rem",
    borderRadius: "6px",
    border: "2px solid #d0bcff",
    fontSize: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#333",
  },
  joinButton: {
    backgroundColor: "#651fff",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  featuresSection: {
    padding: "5rem 5%",
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: "2.25rem",
    fontWeight: "700",
    textAlign: "center",
    margin: "0 0 3rem",
    color: "#333",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    border: "1px solid #f0f0f0",
  },
  featureIconContainer: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4eeff",
    marginBottom: "1.5rem",
  },
  featureIcon: {
    fontSize: "2rem",
  },
  featureTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    margin: "0 0 1rem",
    color: "#6200ea",
  },
  featureDescription: {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#555",
    margin: 0,
  },
  testimonialsSection: {
    padding: "5rem 5%",
    backgroundColor: "#f8f9fa",
  },
  testimonialsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  testimonialCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    position: "relative",
    border: "1px solid #f0f0f0",
  },
  quoteIcon: {
    position: "absolute",
    top: "1rem",
    left: "1.5rem",
    fontSize: "4rem",
    color: "#e0e0e0",
    fontFamily: "Georgia, serif",
    lineHeight: "1",
    zIndex: 0,
  },
  testimonialText: {
    fontSize: "1.1rem",
    lineHeight: "1.7",
    color: "#444",
    position: "relative",
    zIndex: 1,
    margin: "0 0 1.5rem",
    fontStyle: "italic",
  },
  testimonialAuthor: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    borderTop: "1px solid #f0f0f0",
    paddingTop: "1.5rem",
  },
  authorAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#d0bcff",
    border: "2px solid #6200ea",
  },
  authorName: {
    margin: "0 0 0.25rem",
    fontWeight: "600",
    fontSize: "1.1rem",
    color: "#333",
  },
  authorInfo: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#666",
  },
  howItWorksSection: {
    padding: "5rem 5%",
    backgroundColor: "white",
  },
  stepsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "1000px",
    margin: "0 auto",
    flexWrap: "wrap",
  },
  step: {
    flex: "1",
    minWidth: "250px",
    textAlign: "center",
    padding: "1.5rem",
  },
  stepNumber: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#6200ea",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(98, 0, 234, 0.2)",
  },
  stepTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    margin: "0 0 0.75rem",
    color: "#333",
  },
  stepDescription: {
    fontSize: "1rem",
    color: "#666",
    lineHeight: "1.6",
    margin: 0,
  },
  stepDivider: {
    width: "80px",
    height: "2px",
    backgroundColor: "#e0e0e0",
    margin: "0 1rem",
  },
  ctaSection: {
    padding: "5rem 5%",
    backgroundColor: "#6200ea",
    color: "white",
    textAlign: "center",
  },
  ctaContent: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    margin: "0 0 1.5rem",
  },
  ctaDescription: {
    fontSize: "1.2rem",
    margin: "0 0 2.5rem",
    opacity: "0.9",
  },
  ctaButton: {
    backgroundColor: "#ff3d00",
    color: "white",
    border: "none",
    padding: "1rem 2.5rem",
    borderRadius: "6px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px rgba(255, 61, 0, 0.3)",
  },
  footer: {
    backgroundColor: "#212121",
    color: "#f5f5f5",
    padding: "4rem 5% 2rem",
  },
  footerContent: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "2rem",
    marginBottom: "3rem",
  },
  footerBranding: {
    maxWidth: "350px",
  },
  footerLogo: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "white",
  },
  footerTagline: {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#bdbdbd",
    margin: 0,
  },
  footerLinks: {
    display: "flex",
    gap: "4rem",
    flexWrap: "wrap",
  },
  footerLinkColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  footerLinkTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: "0 0 1rem",
    color: "white",
  },
  footerLink: {
    color: "#bdbdbd",
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "color 0.2s ease",
  },
  footerBottom: {
    borderTop: "1px solid #424242",
    paddingTop: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1rem",
  },
  copyright: {
    fontSize: "0.9rem",
    color: "#9e9e9e",
    margin: 0,
  },
};

export default LandingPage;
