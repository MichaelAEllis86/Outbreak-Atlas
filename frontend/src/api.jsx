import axios from "axios";

// Detect if we're running locally (vite dev) or deployed (vite build)
const isLocal = import.meta.env.MODE === "development";

// In local dev → use the proxy path (/api) so vite rewrites
// In production → call backend directly (Render URL)
const baseURL = isLocal
  ? "/api" // goes through Vite proxy → localhost:3000
  : `${import.meta.env.VITE_API_BASE_URL}/api`; // goes to Render backend → /api/*

console.log("🔍 Axios baseURL =", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;

