// frontend/lib/api.ts
import axios from "axios";

// Create a custom axios instance connected to FastAPI backend
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// will add JWT Interceptor later!