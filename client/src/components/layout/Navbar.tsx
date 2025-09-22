"use client";

import { useState } from "react";
import LogoutModal from "../ui/LogoutModal";

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
      <span style={{ marginRight: "1rem" }}>My App</span>
      <button onClick={() => setShowModal(true)}>Logout</button>
      {showModal && <LogoutModal onClose={() => setShowModal(false)} />}
    </nav>
  );
}
