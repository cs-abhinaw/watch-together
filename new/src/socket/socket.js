import { io } from "socket.io-client";
const socket = io("https://watch-together-nrg0.onrender.com"); // Use your backend URL
export default socket;
