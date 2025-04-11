import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import RoomPage from "./Pages/RoomPage";

import "./App.css"

function App() {
  return (
    <Router>
     
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </Router>
    
  );
}

export default App;
