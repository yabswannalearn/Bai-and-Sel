// path.ts
const isDocker = process.env.NODE_ENV === "production";

const BASE_URL = isDocker
  ? "http://server:3001" // 👈 inside Docker network
  : "http://localhost:3001"; // 👈 local dev

export const NEXT_PUBLIC_API_URL = `${BASE_URL}/api`;
export const NEXT_PUBLIC_AUTH_API = `${BASE_URL}/auth`;
export const NEXT_PUBLIC_UPLOAD_URL = `${BASE_URL}`;
