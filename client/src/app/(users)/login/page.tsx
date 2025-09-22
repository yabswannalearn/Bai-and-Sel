"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"

axios.defaults.withCredentials = true

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_API}/login`,
        { email, password },
        { withCredentials: true }
      )
      router.push("/")
    } catch (err: any) {
      setError(err.response?.data?.error || "Login Failed")
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p style={{ marginTop: "1rem" }}>
        No account yet?{" "}
        <Link href="/register" style={{ color: "blue", textDecoration: "underline" }}>
          Register
        </Link>
      </p>
    </div>
  )
}
