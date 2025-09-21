"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

axios.defaults.withCredentials = true

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_AUTH_API}/register`, {
        name,
        email,
        password,
      })

      setSuccess("✅ Registered successfully! Redirecting...")
      setTimeout(() => router.push("/login"), 1500) // redirect after short delay
      console.log("success teh")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration Failed")
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Register</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  )
}
