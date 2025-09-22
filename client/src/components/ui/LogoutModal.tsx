"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

export default function LogoutModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_API}/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/login"); // redirect to login
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ background: "white", padding: "2rem", borderRadius: "8px" }}>
        <h3>Are you sure you want to logout?</h3>
        <button onClick={handleLogout}>Yes</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
