import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXAUTH_URL,
});

export default api;
