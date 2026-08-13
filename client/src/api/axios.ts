import axios from "axios";

const api = axios.create({
  baseURL: "https://quillpen.onrender.com/api",
  withCredentials: true,
});

export default api;