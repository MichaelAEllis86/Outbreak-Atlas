//frontend/src/api.jsx

// File for adjusting api call routes based on the run environment, dev/production

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});

export default api;
